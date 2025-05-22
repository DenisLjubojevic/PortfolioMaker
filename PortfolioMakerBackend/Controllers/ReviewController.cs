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
    public class ReviewController : ControllerBase
    {
        private readonly IMongoCollection<Review> _reviewCollection;

        public ReviewController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("PortfolioDB");
            _reviewCollection = database.GetCollection<Review>("Review");
        }

        [HttpGet]
        [Authorize]
        public async Task<IEnumerable<Review>> GetAll()
        {
            return await _reviewCollection.Find(r => true).ToListAsync();
        }

        [HttpGet("portfolio/{portfolioId}")]
        [Authorize]
        public ActionResult<List<Review>> GetByPortfolioId(string portfolioId)
        {
            var reviews = _reviewCollection.Find(r => r.PortfolioId == portfolioId).ToList();
            if (reviews == null) return NotFound();
            return Ok(reviews);
        }

        [HttpGet("user/{userId}/portfolio/{portfolioId}")]
        [Authorize]
        public ActionResult<List<Review>> GetByUserIdAndPortfolioId(string userId, string portfolioId)
        {
            var reviews = _reviewCollection.Find(r => r.UserId == userId && r.PortfolioId == portfolioId).ToList();
            if (reviews == null) return NotFound();
            return Ok(reviews);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateReview(ReviewDTO reviewDTO)
        {
            var reviewId = ObjectId.GenerateNewId().ToString();

            Review review = new Review
            {
                Id = reviewId,
                PortfolioId = reviewDTO.PortfolioId,
                UserId = reviewDTO.UserId,
                Mark = reviewDTO.Mark,
                Comment = reviewDTO.Comment,
            };
            await _reviewCollection.InsertOneAsync(review);
            return Ok(review);
        }
    }
}
