using DnsClient;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using PortfolioMakerBackend.DTOs;
using PortfolioMakerBackend.Models;

namespace PortfolioMakerBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PortfolioController : ControllerBase
    {
        private readonly IMongoCollection<Portfolio> _portfolios;
        private readonly IMongoCollection<Project> _projects;
        
        public PortfolioController(IMongoClient mongoClient, IOptions<MongoDBSettings> mongoSettigns)
        {
            var database = mongoClient.GetDatabase(mongoSettigns.Value.DatabaseName);
            _portfolios = database.GetCollection<Portfolio>("Portfolios");
            _projects = database.GetCollection<Project>("Projects");
        }

        [HttpGet]
        [Authorize]
        public ActionResult<List<Portfolio>> GetAll()
        {
            System.Diagnostics.Debug.WriteLine($"Getting all portfolios");
            var portfolios = _portfolios.Find(portfolio => true).ToList();
            return Ok(portfolios);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Portfolio>> CreatePortfolio([FromBody] PortfolioDTO portfolioDto)
        {
            System.Diagnostics.Debug.WriteLine($"Creating new portfolio");
            if (portfolioDto.Projects == null)
            {
                System.Diagnostics.Debug.WriteLine("No portfolio projects!!!");
                return BadRequest(new { message = "A portfolio must include at least one project." });
            }

            var portfolioId = ObjectId.GenerateNewId().ToString();
            var portfolio = new Portfolio
            {
                Id = portfolioId,
                Name = portfolioDto.Name,
                Description = portfolioDto.Description,
                BannerImageUrl = portfolioDto.BannerImageUrl,
                IsPublished = portfolioDto.IsPublished,
                About = portfolioDto.About,
                Contacts = portfolioDto.Contacts,
                Projects = portfolioDto.Projects.Select(p => new Project
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    PortfolioId = portfolioId,
                    Title = p.Title,
                    Description = p.Description,
                    Technologies = p.Technologies,
                    DemoUrl = p.DemoUrl,
                    RepoUrl = p.RepoUrl,
                    CreatedAt = DateTime.UtcNow
                }).ToList(),
                CreatedAt = DateTime.UtcNow
            };

            System.Diagnostics.Debug.WriteLine($"Portfolio - {portfolio}");

            await _portfolios.InsertOneAsync(portfolio);

            return Ok(portfolio);
        }

        [HttpPost("{portfolioId}/projects")]
        public async Task<IActionResult> AddProjectToPortfolio(string portfolioId, [FromBody] ProjectDTO projectDto)
        {
            var portfolio = await _portfolios.Find(p => p.Id == portfolioId).FirstOrDefaultAsync();
            if (portfolio == null)
            {
                return NotFound("Portfolio not found.");
            }

            var project = new Project
            {
                Id = ObjectId.GenerateNewId().ToString(),
                PortfolioId = portfolioId,
                Title = projectDto.Title,
                Description = projectDto.Description,
                Technologies = projectDto.Technologies,
                DemoUrl = projectDto.DemoUrl,
                RepoUrl = projectDto.RepoUrl,
                CreatedAt = DateTime.UtcNow
            };

            await _projects.InsertOneAsync(project);

            portfolio.Projects.Add(project);
            await _portfolios.ReplaceOneAsync(p => p.Id == portfolioId, portfolio);

            return Ok(project);
        }

        [HttpPut("{ id }")]
        public ActionResult<Portfolio> Put(string id, [FromBody] Portfolio updatedPortfolio)
        {
            var portfolio = _portfolios.Find(p => p.Id == id).FirstOrDefault();
            if(portfolio == null)
            {
                return NotFound();
            }

            portfolio.Name = updatedPortfolio.Name;
            portfolio.Description = updatedPortfolio.Description;
            portfolio.Projects = updatedPortfolio.Projects;
            portfolio.BannerImageUrl = updatedPortfolio.BannerImageUrl;
            portfolio.IsPublished = updatedPortfolio.IsPublished;
            portfolio.About = updatedPortfolio.About;
            portfolio.Contacts = updatedPortfolio.Contacts;

            _portfolios.ReplaceOne(p => p.Id == id, portfolio);
            return Ok(portfolio);
        }

        [HttpDelete("{ id }")]
        public IActionResult Delete(string id)
        {
            var portfolio = _portfolios.Find(p => p.Id == id).FirstOrDefault();
            if (portfolio == null)
            {
                return NotFound();
            }

            _portfolios.DeleteOne(p => p.Id == id);
            return NoContent();
        }
    }
}
