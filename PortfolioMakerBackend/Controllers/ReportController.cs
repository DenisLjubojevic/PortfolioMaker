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
    }
}
