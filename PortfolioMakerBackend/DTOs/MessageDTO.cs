namespace PortfolioMakerBackend.DTOs
{
    public class MessageDTO
    {
        public string SenderId { get; set; }
        public string RecieverId { get; set; }
        public string Context { get; set; }
        public string Status { get; set; }
    }
}
