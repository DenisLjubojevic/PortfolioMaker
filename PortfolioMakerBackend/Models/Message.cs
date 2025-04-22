using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace PortfolioMakerBackend.Models
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string SenderId { get; set; }
        public string RecieverId { get; set; }
        public string Context { get; set; }
        public string Status {  get; set; } // Warning, Information
    }
}
