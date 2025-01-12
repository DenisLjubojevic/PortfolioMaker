using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using PortfolioMakerBackend.Models;

namespace PortfolioMakerBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkExperienceController: ControllerBase
    {
        private readonly IMongoCollection<WorkExperience> _workExperienceCollection;

        public WorkExperienceController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("PortfolioDB");
            _workExperienceCollection = database.GetCollection<WorkExperience>("WorkExperience");
        }

        [HttpGet]
        public async Task<IEnumerable<WorkExperience>> GetAll()
        {
            return await _workExperienceCollection.Find(we => true).ToListAsync();
        } 

        [HttpGet("{id}")]
        public async Task<ActionResult<WorkExperience>> GetById(string id)
        {
            var workExperience = await _workExperienceCollection.Find(we => we.Id == id).FirstOrDefaultAsync();
            if (workExperience == null) return NotFound();
            return Ok(workExperience);
        }

        [HttpPost]
        public async Task<IActionResult> Create(WorkExperience workExperience)
        {
            await _workExperienceCollection.InsertOneAsync(workExperience);
            return CreatedAtAction(nameof(GetById), new { id = workExperience.Id }, workExperience);
        }
    }
}
