using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using PortfolioMakerBackend.Models;
using PortfolioMakerBackend.Services;
using PortfolioMakerBackend.Stores;
using System.Text;
using Quartz;
using Quartz.Simpl;
using Quartz.AspNetCore;
using Serilog;
using dotenv.net;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

DotEnv.Load();

builder.Configuration.AddEnvironmentVariables();

var mongoConnection = Environment.GetEnvironmentVariable("MONGODB_CONNECTION");
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
var jwtISSUER = Environment.GetEnvironmentVariable("JWT_ISSUER");

var mongoSettings = new MongoDBSettings
{
    ConnectionString = mongoConnection,
    DatabaseName = "PortfolioDB"
};

builder.Services.Configure<MongoDBSettings>(options =>
{
    options.ConnectionString = mongoConnection;
    options.DatabaseName = "PortfolioDB";
});

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});


builder.Services.AddSingleton<IUserStore<User>, MongoUserStore>();
builder.Services.AddSingleton<IRoleService, MongoRolesService>();

builder.Services.AddIdentity<User, IdentityRole>()
    .AddUserStore<MongoUserStore>()
    .AddRoleStore<MongoRoleStore>()
    .AddDefaultTokenProviders();


builder.Services.AddQuartz(q =>
{
    q.UseJobFactory<MicrosoftDependencyInjectionJobFactory>();

    var jobKey = new JobKey("DeleteOldPreviewsJob");
    q.AddJob<DeleteOldPreviewsService>(opts => opts.WithIdentity(jobKey));

    q.AddTrigger(opts => opts
                    .ForJob(jobKey)
                    .WithIdentity("DeleteOldPreviewsTrigger")
                    .WithCronSchedule("0 0 * * * ?"));
});

builder.Services.AddQuartzServer(options =>
{
    options.WaitForJobsToComplete = true;
});

builder.Services.AddSingleton<IJob, DeleteOldPreviewsService>();
builder.Services.AddSingleton<MicrosoftDependencyInjectionJobFactory>();

var logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
builder.Host.UseSerilog(logger);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("ADMIN"));
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtISSUER,
            ValidAudience = jwtISSUER,  
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token."
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.Use(async (context, next) =>
{
    if (context.Request.Method == HttpMethods.Options)
    {
        context.Response.StatusCode = StatusCodes.Status204NoContent;
        return;
    }
    await next.Invoke();
});

app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    var token = context.Request.Headers["Authorization"];
    Console.WriteLine($"Token in request: {token}");
    await next.Invoke();
});

app.UseRouting();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
