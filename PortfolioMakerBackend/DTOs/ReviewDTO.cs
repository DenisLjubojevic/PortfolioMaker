namespace PortfolioMakerBackend.DTOs
{
    public class ReviewDTO
    {
        public string Id { get; set; }
        public string PortfolioId { get; set; }
        public string UserId { get; set; }
        public int Mark { get; set; }
        public string Comment { get; set; }
    }
}
