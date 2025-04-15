using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using PortfolioMakerBackend.DTOs;
using PortfolioMakerBackend.Models;

namespace PortfolioMakerBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IMongoCollection<Reports> _reportCollection;

        public ReportController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("PortfolioDB");
            _reportCollection = database.GetCollection<Reports>("Reports");
        }

        [HttpGet]
        [Authorize]
        public async Task<IEnumerable<Reports>> GetAll()
        {
            return await _reportCollection.Find(r => true).ToListAsync();
        }

        [HttpGet("portfolio/{portfolioId}")]
        [Authorize]
        public async Task<ActionResult<Reports>> GetByPortfolioId(string portfolioId)
        {
            var report = await _reportCollection.Find(r => r.PortfolioId == portfolioId).FirstOrDefaultAsync();
            if (report == null) return NotFound();
            return report;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateReport(ReportDTO reportDTO)
        {
            var reportId = ObjectId.GenerateNewId().ToString();

            Reports report = new Reports
            {
                Id = reportId,
                PortfolioId = reportDTO.PortfolioId,
                Comment = reportDTO.Comment,
            };

            await _reportCollection.InsertOneAsync(report);

            return Ok(report);
        }

        [HttpDelete("delete/{portfolioId}")]
        [Authorize]
        public IActionResult Delete(string portfolioId)
        {
            var report = _reportCollection.Find(r => r.PortfolioId == portfolioId).FirstOrDefault();
            if (report == null) return NotFound();
            _reportCollection.DeleteOne(r => r.PortfolioId == portfolioId);
            return NoContent();

        }

    }
}
