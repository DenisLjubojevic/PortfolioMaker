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
    public class MessageController: ControllerBase
    {
        private readonly IMongoCollection<Message> _messageCollection;

        public MessageController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("PortfolioDB");
            _messageCollection = database.GetCollection<Message>("Message");
        }

        [HttpGet]
        [Authorize]
        public async Task<IEnumerable<Message>> GetAll()
        {
            return await _messageCollection.Find(r => true).ToListAsync();
        }

        [HttpGet("reciever/{recieverId}")]
        [Authorize]
        public async Task<ActionResult<Message>> GetByRecieverId(string recieverId)
        {
            var message = await _messageCollection.Find(m => m.RecieverId == recieverId).FirstOrDefaultAsync();
            if (message == null) return NotFound();
            return message;
        }


        [HttpPost("send")]
        [Authorize]
        public async Task<IActionResult> SendMessage(MessageDTO messageDTO)
        {
            var messageId = ObjectId.GenerateNewId().ToString();

            Message message = new Message
            {
                Id = messageId,
                SenderId = messageDTO.SenderId,
                RecieverId = messageDTO.RecieverId,
                Context = messageDTO.Context,
                Status = messageDTO.Status,
            };

            await _messageCollection.InsertOneAsync(message);

            return Ok(message);
        }
    }
}
