using Microsoft.AspNetCore.Identity;

namespace PortfolioMakerBackend.Services
{
    public interface IRoleService
    {
        Task<IdentityRole> GetRoleByNameAsync(string roleName);
        Task<IdentityResult> CreateRoleAsync(IdentityRole role);
        Task<IdentityResult> DeleteRoleAsync(string roleId);
    }
}
