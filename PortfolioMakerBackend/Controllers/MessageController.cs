﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
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
        public ActionResult<List<Message>> GetByRecieverId(string recieverId)
        {
            var messages = _messageCollection.Find(m => m.RecieverId == recieverId).ToList();
            if (messages == null) return NotFound();
            return messages;
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

        [HttpDelete("delete/reciever/{recieverId}")]
        [Authorize]
        public IActionResult DeleteAllMessages(string recieverId)
        {
            var message = _messageCollection.Find(m => m.RecieverId == recieverId).ToList();
            if (message == null)
            {
                return NotFound();
            }

            _messageCollection.DeleteMany(m => m.RecieverId == recieverId);
            return NoContent();
        }

        [HttpDelete("delete/{id}")]
        [Authorize]
        public IActionResult DeleteMessage(string id)
        {
            var message = _messageCollection.Find(m => m.Id == id).FirstOrDefault();
            if (message == null)
            {
                return NotFound();
            }

            _messageCollection.DeleteOne(m => m.Id == id);
            return NoContent();
        }
    }
}
