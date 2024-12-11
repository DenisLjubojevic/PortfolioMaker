using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PortfolioMakerBackend.Services;

namespace PortfolioMakerBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RolesController(IRoleService roleService, RoleManager<IdentityRole> roleManager)
        {
            _roleService = roleService;
            _roleManager = roleManager;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRole([FromBody] IdentityRole role)
        {
            var result = await _roleService.CreateRoleAsync(role);
            if (result.Succeeded)
                return Ok("Role created successfully");

            return BadRequest(result.Errors);
        }

        [HttpPost("delete/{roleId}")]
        public async Task<IActionResult> DeleteRole(string roleId)
        {
            var result = await _roleService.DeleteRoleAsync(roleId);
            if (result.Succeeded)
                return Ok("Role deleted successfully");

            return BadRequest(result.Errors);
        }
    }
}
