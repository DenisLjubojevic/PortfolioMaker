namespace PortfolioMakerBackend.DTOs
{
    public class ProjectDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string[] Technologies { get; set; }
        public string DemoUrl { get; set; }
        public string RepoUrl { get; set; }
    }
}
