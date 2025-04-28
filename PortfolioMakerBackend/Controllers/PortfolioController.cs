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
        private readonly IMongoCollection<Reports> _reports;
        private readonly IMongoCollection<WorkExperience>  _workExperience;

        private readonly GridFSBucket _gridFSBucket;
        
        public PortfolioController(IMongoClient mongoClient, IOptions<MongoDBSettings> mongoSettigns)
        {
            var database = mongoClient.GetDatabase(mongoSettigns.Value.DatabaseName);
            _portfolios = database.GetCollection<Portfolio>("Portfolios");
            _projects = database.GetCollection<Project>("Projects");
            _reports = database.GetCollection<Reports>("Reports");
            _workExperience = database.GetCollection<WorkExperience>("WorkExperience");

            _gridFSBucket = new GridFSBucket(database);
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public ActionResult<List<Portfolio>> GetAll()
        {
            var portfolios = _portfolios.Find(portfolio => portfolio.Id == portfolio.Id).ToList();
            return Ok(portfolios);
        }

        [HttpGet("public")]
        [Authorize]
        public ActionResult<List<Portfolio>> GetPublicPortfolios()
        {
            var portfolios = _portfolios.Find(portfolio => portfolio.IsPublished == true).ToList();
            return Ok(portfolios);
        }

        [HttpGet("reported")]
        [Authorize]
        public ActionResult<List<Portfolio>> GetReportedPortfolios()
        {
            var reports = _reports.Find(report => true).ToList();

            var reportedPortfolioIds = reports.Select(r => r.PortfolioId).Distinct().ToList();

            var filter = Builders<Portfolio>.Filter.In(p => p.Id, reportedPortfolioIds);

            var portfolios = _portfolios.Find(filter).ToList();

            return Ok(portfolios);
        }

        [HttpGet("search/{searchedName}")]
        [Authorize]
        public ActionResult<List<Portfolio>> GetSearchedNamePortfolios(string searchedName)
        {
            var searchedPortfolios = _portfolios.Find(portfolio => portfolio.IsPublished == true && portfolio.Name.ToLower().Contains(searchedName.ToLower())).ToList();
            return Ok(searchedPortfolios);
        }

        [HttpGet("user")]
        [Authorize]
        public ActionResult<List<Portfolio>> GetUserPortfolio()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User information is missing.");
            }

            System.Diagnostics.Debug.WriteLine($"Getting portfolios for user: {userId}");
            var portfolios = _portfolios.Find(portfolio => portfolio.UserId == userId).ToList();
            return Ok(portfolios);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult<Portfolio>> CreatePortfolio([FromBody] PortfolioDTO portfolioDto)
        {
            System.Diagnostics.Debug.WriteLine($"Creating new portfolio");
            if (portfolioDto.Projects == null)
            {
                System.Diagnostics.Debug.WriteLine("No portfolio projects!!!");
                return BadRequest(new { message = "A portfolio must include at least one project." });
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User information is missing.");
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
                Contacts = portfolioDto.Contacts,
                PortfolioUrl = finalUrl,
                CreatedAt = DateTime.UtcNow,
                PreviewId = null,
                UserId = userId,
                TemplateId = portfolioDto.TemplateId,
            };

            System.Diagnostics.Debug.WriteLine($"Portfolio - {portfolio}");

            await _portfolios.InsertOneAsync(portfolio);

            return Ok(portfolio);
        }

        [HttpPost("{portfolioId}/experiences")]
        public async Task<IActionResult> AddExperienceToPortfolio(string portfolioId, [FromBody] ExperienceDTO experienceDto)
        {
            var portfolio = await _portfolios.Find(p => p.Id == portfolioId).FirstOrDefaultAsync();
            if (portfolio == null)
            {
                return BadRequest("Portfolio not found.");
            }

            var experience = new WorkExperience
            {
                Id = ObjectId.GenerateNewId().ToString(),
                PortfolioId = portfolioId,
                Position = experienceDto.Position,
                StartedWorking = experienceDto.StartedWorking,
                EndedWorking = experienceDto.EndedWorking,
                Company = experienceDto.Company,
                Location = experienceDto.Location,
                Responsibilities = experienceDto.Responsibilities
            };

            await _workExperience.InsertOneAsync(experience);

            portfolio.Experience.Add(experience);
            System.Diagnostics.Debug.WriteLine("Updated portfolio experience: " + portfolio.Experience.Count);
            await _portfolios.ReplaceOneAsync(p => p.Id == portfolioId, portfolio);

            return Ok(experience);
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
                ImageId = projectDto.ImageId,
                Title = projectDto.Title,
                Description = projectDto.Description,
                Technologies = projectDto.Technologies,
                DemoUrl = projectDto.DemoUrl,
                RepoUrl = projectDto.RepoUrl,
                CreatedAt = DateTime.UtcNow
            };

            await _projects.InsertOneAsync(project);

            portfolio.Projects.Add(project);
            System.Diagnostics.Debug.WriteLine("Updated portfolio " + portfolio.Projects.Count);
            await _portfolios.ReplaceOneAsync(p => p.Id == portfolioId, portfolio);

            return Ok(project);
        }

        [HttpPost("preview")]
        [Authorize]
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
                Experience = portfolioDto.Experience.Select(e => new WorkExperience
                {
                    Id= ObjectId.GenerateNewId().ToString(),
                    Position = e.Position,
                    StartedWorking = e.StartedWorking,
                    EndedWorking = e.EndedWorking,
                    Company = e.Company,
                    Location = e.Location,
                    Responsibilities = e.Responsibilities
                }).ToList(),
                Projects = portfolioDto.Projects.Select(p => new Project
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    ImageId = p.ImageId,
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
                UserId = portfolioDto.UserId,
                TemplateId = portfolioDto.TemplateId,
            };

            await _portfolios.InsertOneAsync(previewPortfolio);

            return Ok(new { previewUrl, previewId = previewUuid });

        }

        [HttpGet("preview/{portfolioId}")]
        [Authorize]
        public async Task<IActionResult> GetPortfolioFinished(string portfolioId)
        {
            System.Diagnostics.Debug.WriteLine("Preview getting");
            var requestPortfolioUrl = "https://localhost:7146/api/portfolio/preview/" + portfolioId;
            System.Diagnostics.Debug.WriteLine("requestPortfolioUrl id - " + requestPortfolioUrl);
            var portfolio = await _portfolios.Find(p => p.PortfolioUrl == requestPortfolioUrl).FirstOrDefaultAsync();
            if (portfolio == null)
            {
                var previewPortfolio = await _portfolios.Find(p => p.PreviewUrl == requestPortfolioUrl).FirstOrDefaultAsync();
                if(previewPortfolio == null)
                {
                    return NotFound(new { message = "Portfolio not found" });
                }
                return Ok(previewPortfolio);
            }
            return Ok(portfolio);
        }

        [HttpGet("cv/{fileId}")]
        public async Task<IActionResult> GetCV(string fileId)
        {
            try
            {
                var objectId = new ObjectId(fileId);

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
        [Authorize]
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

        [HttpGet("templatePicture/{templateId}")]
        public async Task<IActionResult> GetTemplatePicture(string templateId)
        {
            try
            {
                var objectId = new ObjectId(templateId);

                var fileStream = await _gridFSBucket.OpenDownloadStreamAsync(objectId);

                return File(fileStream, "image/jpeg", fileStream.FileInfo.Filename);
            }
            catch (GridFSFileNotFoundException)
            {
                return NotFound(new { message = "Template picture not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the template picture.", error = ex.Message });
            }
        }

        [HttpPost("upload-template-picture")]
        [Authorize]
        public async Task<IActionResult> UploadTemplatePicture(IFormFile templatePicture)
        {
            if (templatePicture == null || templatePicture.Length == 0)
            {
                return BadRequest(new { message = "No file provided" });
            }

            try
            {
                using var stream = templatePicture.OpenReadStream();
                var fileId = await _gridFSBucket.UploadFromStreamAsync(templatePicture.FileName, stream);

                return Ok(new { message = "Template picture uploaded successfully", fileId = fileId.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading the template picture.", error = ex.Message });
            }
        }

        [HttpGet("profile-picture/{fileId}")]
        public async Task<IActionResult> GetProfilePicture(string fileId)
        {
            try
            {
                var objectId = new ObjectId(fileId);

                var fileStream = await _gridFSBucket.OpenDownloadStreamAsync(objectId);

                return File(fileStream, "image/jpeg", fileStream.FileInfo.Filename);
            }catch(GridFSFileNotFoundException)
            {
                return NotFound(new { message = "Profile picture not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the profile picture.", error = ex.Message });
            }
        }

        [HttpPost("upload-profile-picture")]
        [Authorize]
        public async Task<IActionResult> UploadProfilePicture(IFormFile profilePicture)
        {
            if (profilePicture == null || profilePicture.Length == 0)
            {
                return BadRequest(new { message = "No file provided" });
            }

            try
            {
                using var stream = profilePicture.OpenReadStream();
                var fileId = await _gridFSBucket.UploadFromStreamAsync(profilePicture.FileName, stream);

                return Ok(new { message = "Profile picture uploaded successfully", fileId = fileId.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading the profile picture.", error = ex.Message });
            }
        }

        [HttpPost("upload-project-image")]
        [Authorize]
        public async Task<IActionResult> UploadProjectImage(IFormFile projectImage)
        {
            if (projectImage == null || projectImage.Length == 0)
            {
                return BadRequest(new { message = "No file provided" });
            }
            try
            {
                using var stream = projectImage.OpenReadStream();
                var fileId = await _gridFSBucket.UploadFromStreamAsync(projectImage.FileName, stream);
                return Ok(new { message = "Project image uploaded successfully", fileId = fileId.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading the project image.", error = ex.Message });
            }
        }

        [HttpDelete("delete-project-image/{fileId}")]
        public async Task<IActionResult> DeleteProjectImage(string fileId)
        {
            try
            {
                var objectId = new ObjectId(fileId);
                await _gridFSBucket.DeleteAsync(objectId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the project image.", error = ex.Message });
            }
        }



        [HttpPut("changePrivacy/{id}/{isPublished}")]
        [Authorize]
        public async Task<IActionResult> ChangePrivacy(string id, bool isPublished)
        {
            var portfolio = await _portfolios.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (portfolio == null)
            {
                return NotFound("Portfolio not found.");
            }

            portfolio.IsPublished = isPublished;

            await _portfolios.ReplaceOneAsync(p => p.Id == id, portfolio);

            return Ok(portfolio);
        }


        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Put(string id, [FromBody] PortfolioDTO updatedPortfolioDTO)
        {
            var portfolio = await _portfolios.Find(p => p.Id == id).FirstOrDefaultAsync();
            if(portfolio == null)
            {
                return NotFound("Portfolio not found.");
            }

            var newExperience = updatedPortfolioDTO.Experience
                    .Where(dto => !portfolio.Experience.Any(e =>
                                        e.Position == dto.Position &&
                                        e.StartedWorking == dto.StartedWorking &&
                                        e.EndedWorking == dto.EndedWorking &&
                                        e.Company == dto.Company &&
                                        e.Location == dto.Location &&
                                        e.Responsibilities == dto.Responsibilities))
                    .ToList();

            var oldExperience = portfolio.Experience
                    .Where(e => updatedPortfolioDTO.Experience.Any(dto =>
                                        e.Position == dto.Position &&
                                        e.StartedWorking == dto.StartedWorking &&
                                        e.EndedWorking == dto.EndedWorking &&
                                        e.Company == dto.Company &&
                                        e.Location == dto.Location &&
                                        e.Responsibilities == dto.Responsibilities))
                    .ToList();

            var experienceToRemove = portfolio.Experience
                    .Where(e => !oldExperience.Any(oldExperience => oldExperience.Equals(e)) && 
                                !newExperience.Any(newExperience => newExperience.Equals(e)))
                    .ToList();

            foreach( var experience in experienceToRemove )
            {
                portfolio.Experience.Remove(experience);
                _workExperience.DeleteOne(e => e.Id == experience.Id);
            }

            var newProjects = updatedPortfolioDTO.Projects
                    .Where(dto => !portfolio.Projects.Any(p => p.Description == dto.Description))
                    .ToList();

            var oldProjects = portfolio.Projects
                    .Where(p => updatedPortfolioDTO.Projects.Any(dto => dto.Description == p.Description))
                    .ToList();

            var projectsToRemove = portfolio.Projects
                    .Where(project => !oldProjects.Any(oldProject => oldProject.Equals(project)) &&
                                      !newProjects.Any(newProject => newProject.Equals(project)))
                    .ToList();


            foreach (var project in projectsToRemove)
            {
                System.Diagnostics.Debug.WriteLine($"project to rm: " + project);

                if(project.ImageId != "67f3ee10d86850c0a5aec7bd")
                {
                    await DeleteProjectImage(project.ImageId);
                }

                portfolio.Projects.Remove(project);
                _projects.DeleteOne(p => p.Id == project.Id);
            }

            portfolio.Name = updatedPortfolioDTO.Name;
            portfolio.Description = updatedPortfolioDTO.Description;
            portfolio.BannerImageUrl = updatedPortfolioDTO.BannerImageUrl;
            portfolio.IsPublished = updatedPortfolioDTO.IsPublished;
            portfolio.About = updatedPortfolioDTO.About;    
            portfolio.Contacts = updatedPortfolioDTO.Contacts;
            portfolio.UserId = updatedPortfolioDTO.UserId;
            portfolio.TemplateId = updatedPortfolioDTO.TemplateId;

            await _portfolios.ReplaceOneAsync(p => p.Id == id, portfolio);

            foreach (var projectDTO in newProjects)
            {
                System.Diagnostics.Debug.WriteLine($"add project: " + projectDTO);
                await AddProjectToPortfolio(id, projectDTO);
            }

            foreach (var experienceDTO in newExperience)
            {
                await AddExperienceToPortfolio(id, experienceDTO);
            }

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
        [Authorize]
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
