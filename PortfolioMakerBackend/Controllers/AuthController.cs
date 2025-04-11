using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PortfolioMakerBackend.Models;
using PortfolioMakerBackend.Models.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PortfolioMakerBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            System.Diagnostics.Debug.WriteLine($"Login: {login.Email}");
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user == null) return Unauthorized("Invalid email or password");
            System.Diagnostics.Debug.WriteLine($"Role: {user.Roles}");

            var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid email or password");

            if (string.IsNullOrEmpty(user.EmailAddress))
            {
                return Unauthorized("Email address is missing.");
            }

            var token = await GenerateJwtToken(user);
            return Ok(new { Token = token, Role = user.Roles[0] });
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpModel signUp)
        {
            System.Diagnostics.Debug.WriteLine($"SignUp - Email: {signUp.Email}");
            System.Diagnostics.Debug.WriteLine($"SignUp - Date of birth: {signUp.DateOfBirth}");

            var user = new User
            {
                UserName = signUp.Email,
                EmailAddress = signUp.Email,
                FirstName = signUp.FirstName,
                LastName = signUp.LastName,
                DateOfBirth = signUp.DateOfBirth,
                ProfilePictureUrl = signUp.ProfilePictureUrl,
            };

            var result = await  _userManager.CreateAsync(user, signUp.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            if(!string.IsNullOrEmpty(signUp.Role))
                await _userManager.AddToRoleAsync(user, signUp.Role);
            else
            {
                await _userManager.AddToRoleAsync(user, "User");
            }

            System.Diagnostics.Debug.WriteLine($"User created - EmailAddress: {user.EmailAddress}");
            return Ok("User registered successfully");
        }
        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            System.Diagnostics.Debug.WriteLine("Logout");
            return Ok(new { message = "Logout successful" });
        }

        private async Task<string> GenerateJwtToken(User user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);
            var roleClaims = userRoles.Select(role => new Claim(ClaimTypes.Role, role));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.EmailAddress),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            }
            .Union(roleClaims);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
