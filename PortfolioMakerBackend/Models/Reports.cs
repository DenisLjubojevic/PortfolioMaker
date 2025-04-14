using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace PortfolioMakerBackend.Models
{
    public class Reports
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string PortfolioId { get; set; }
        public string Comment { get; set; }
    }
}
