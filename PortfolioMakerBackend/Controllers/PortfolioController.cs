using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
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

        private readonly GridFSBucket _gridFSBucket;
        
        public PortfolioController(IMongoClient mongoClient, IOptions<MongoDBSettings> mongoSettigns)
        {
            var database = mongoClient.GetDatabase(mongoSettigns.Value.DatabaseName);
            _portfolios = database.GetCollection<Portfolio>("Portfolios");
            _projects = database.GetCollection<Project>("Projects");

            _gridFSBucket = new GridFSBucket(database);
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
            var finalUrl = $"https://localhost:7146/api/portfolio/preview/{portfolioId}";

            var portfolio = new Portfolio
            {
                Id = portfolioId,
                Name = portfolioDto.Name,
                Description = portfolioDto.Description,
                BannerImageUrl = portfolioDto.BannerImageUrl,
                IsPublished = portfolioDto.IsPublished,
                About = portfolioDto.About,
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
                Contacts = portfolioDto.Contacts,
                PortfolioUrl = finalUrl,
                CreatedAt = DateTime.UtcNow,
                PreviewId = null,
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

        [HttpPost("preview")]
        public async Task<ActionResult> GeneratePreview([FromBody] PortfolioDTO portfolioDto)
        {
            if (portfolioDto.Projects == null || portfolioDto.Projects.Count == 0)
            {
                return BadRequest(new { message = "A portfolio must include at least one project." });
            }

            var previewUuid = Guid.NewGuid().ToString();
            var previewUrl = $"https://localhost:7146/api/portfolio/preview/{previewUuid}";

            var previewPortfolio = new Portfolio
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = portfolioDto.Name,
                Description = portfolioDto.Description,
                BannerImageUrl = portfolioDto.BannerImageUrl,
                IsPublished = false,
                About = portfolioDto.About,
                Projects = portfolioDto.Projects.Select(p => new Project
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Title = p.Title,
                    Description = p.Description,
                    Technologies = p.Technologies,
                    DemoUrl = p.DemoUrl,
                    RepoUrl = p.RepoUrl,
                    CreatedAt = DateTime.UtcNow
                }).ToList(),
                Contacts = portfolioDto.Contacts,
                PreviewUrl = previewUrl,
                CreatedAt = DateTime.UtcNow,
                PreviewId = previewUuid,
            };

            await _portfolios.InsertOneAsync(previewPortfolio);

            return Ok(new { previewUrl, previewId = previewUuid });

        }

        [HttpGet("preview/{portfolioId}")]
        public async Task<IActionResult> GetPreviewPortfolio(string portfolioId)
        {
            System.Diagnostics.Debug.WriteLine("Preview getting");
            var requestPortfolioUrl = "https://localhost:7146/api/portfolio/preview/" + portfolioId;
            System.Diagnostics.Debug.WriteLine("requestPortfolioUrl id - " + requestPortfolioUrl);
            var portfolio = await _portfolios.Find(p => p.PortfolioUrl == requestPortfolioUrl).FirstOrDefaultAsync();
            if (portfolio == null)
            {
                return NotFound(new { message = "Portfolio not found" });
            }
            return Ok(portfolio);
        }

        [HttpGet("cv/{fileId}")]
        public async Task<IActionResult> GetCV(string fileId)
        {
            try
            {
                var objectId = new ObjectId(fileId);

                // Download the file from GridFS
                var fileStream = await _gridFSBucket.OpenDownloadStreamAsync(objectId);

                return File(fileStream, "application/octet-stream", fileStream.FileInfo.Filename);
            }
            catch (GridFSFileNotFoundException)
            {
                return NotFound(new { message = "File not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the file.", error = ex.Message });
            }
        }

        [HttpPost("upload-cv")]
        public async Task<IActionResult> UploadCV(IFormFile cvFile)
        {
            if (cvFile == null || cvFile.Length == 0)
            {
                return BadRequest(new { message = "No file provided" });
            }

            try
            {
                using var stream = cvFile.OpenReadStream();
                var fileId = await _gridFSBucket.UploadFromStreamAsync(cvFile.FileName, stream);

                return Ok(new { message = "CV uploaded successfully!", fileId = fileId.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading the file.", error = ex.Message });
            }
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

        [HttpDelete("preview/{previewId}")]
        public IActionResult DeletePreview(string previewId)
        {
            // Find the portfolio by previewId
            var portfolio = _portfolios.Find(p => p.PreviewId == previewId).FirstOrDefault();
            if (portfolio == null)
            {
                return NotFound(new { message = "Preview portfolio not found." });
            }

            // Delete the portfolio
            _portfolios.DeleteOne(p => p.PreviewId == previewId);

            return NoContent();
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
