namespace PortfolioMakerBackend.DTOs
{
    public class ExperienceDTO
    {
        public string Position { get; set; }
        public string StartedWorking { get; set; }
        public string EndedWorking { get; set; }
        public string Company {  get; set; }
        public string Location { get; set; }
        public string[] Responsibilities { get; set; }
    }
}
