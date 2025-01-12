using PortfolioMakerBackend.Models;

namespace PortfolioMakerBackend.DTOs
{
    public class PortfolioDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string BannerImageUrl { get; set; }
        public bool IsPublished { get; set; }
        public About About { get; set; }
        public List<ExperienceDTO> Experience { get; set; }
        public List<ProjectDTO> Projects { get; set; }
        public Contact Contacts { get; set; }
        public string PortfolioUrl { get; set; }
    }
}
