using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PortfolioMakerBackend.Models
{
	public class Project
	{
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string PortfolioId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string[] Technologies { get; set; }
        public string DemoUrl { get; set; }
        public string RepoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
