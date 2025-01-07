using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using PortfolioMakerBackend.Models;

namespace PortfolioMakerBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IMongoCollection<Project> _projectCollection;

        public ProjectController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("PortfolioDB");
            _projectCollection = database.GetCollection<Project>("Projects");
        }

        [HttpGet]
        public async Task<IEnumerable<Project>> GetAll()
        {
            return await _projectCollection.Find(p => true).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetById(string id)
        {
            var project = await _projectCollection.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (project == null) return NotFound();
            return project;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Project project)
        {
            project.CreatedAt = System.DateTime.UtcNow;
            await _projectCollection.InsertOneAsync(project);
            return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
        }
    }
}
