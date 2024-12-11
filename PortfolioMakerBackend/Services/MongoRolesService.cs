using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PortfolioMakerBackend.Models;

namespace PortfolioMakerBackend.Services
{
    public class MongoRolesService : IRoleService
    {
        private readonly IMongoCollection<Roles> _roles;

        public MongoRolesService(IMongoClient mongoCliet, IOptions<MongoDBSettings> mongoSettings)
        {
            var database = mongoCliet.GetDatabase(mongoSettings.Value.DatabaseName);
            _roles = database.GetCollection<Roles>("Roles");
        }

        public async Task<IdentityRole> GetRoleByNameAsync(string roleName)
        {
            var role = await _roles.Find(r => r.Name == roleName).FirstOrDefaultAsync();
            return role == null ? null : new IdentityRole(role.Name) { Id = role.Id };
        }

        public async Task<IdentityResult> CreateRoleAsync(IdentityRole role)
        {
            var existingRole = await _roles.Find(r => r.Name == role.Name).FirstOrDefaultAsync();
            if (existingRole != null)
                return IdentityResult.Failed(new IdentityError { Description = "Role already exists" });

            var newRole = new Roles { Id = Guid.NewGuid().ToString(), Name = role.Name };
            await _roles.InsertOneAsync(newRole);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteRoleAsync(string roleId)
        {
            var result = await _roles.DeleteOneAsync(r => r.Id == roleId);
            return result.DeletedCount > 0
                ? IdentityResult.Success
                : IdentityResult.Failed(new IdentityError { Description = "Role not found" });
        }
    }
}
