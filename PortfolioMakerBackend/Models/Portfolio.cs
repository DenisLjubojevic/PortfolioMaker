﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PortfolioMakerBackend.Models
{
    public class Portfolio
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string BannerImageUrl { get; set; }
        public bool IsPublished { get; set; }

        public About About { get; set; }

        public List<Project> Projects { get; set; } = new List<Project>();

        public Contact Contacts { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public class About
    {
        public string Name { get; set; }
        public string Bio { get; set; }
    }

    public class Contact
    {
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
