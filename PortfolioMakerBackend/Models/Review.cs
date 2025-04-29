using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace PortfolioMakerBackend.Models
{
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string PortfolioId { get; set; }
        public string UserId { get; set; }
        public int Mark {  get; set; }
        public string Comment { get; set; }
    }
}
