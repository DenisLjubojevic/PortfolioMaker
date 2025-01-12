using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PortfolioMakerBackend.Models
{
    public class WorkExperience
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string PortfolioId { get; set; }
        public string Position { get; set; }
        public string StartedWorking {  get; set; }
        public string EndedWorking { get; set; }
        public string Company { get; set; }
        public string Location { get; set; }
        public string[] Responsibilities { get; set; }
    }
}
