using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PortfolioMakerBackend.Models;
using Quartz;

namespace PortfolioMakerBackend.Services
{
    public class DeleteOldPreviewsService: IJob
    {
        private readonly IMongoCollection<Portfolio> _portfolios;
        private readonly ILogger<DeleteOldPreviewsService> _logger;

        public DeleteOldPreviewsService(IMongoClient mongoClient, IOptions<MongoDBSettings> mongoSettings, ILogger<DeleteOldPreviewsService> logger)
        {
            var database = mongoClient.GetDatabase(mongoSettings.Value.DatabaseName);
            _portfolios = database.GetCollection<Portfolio>("Portfolios");
            _logger = logger;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var tresholdDate = DateTime.UtcNow.AddHours(-24);
            try
            {
                var result = await _portfolios.DeleteManyAsync(p => p.PreviewId != null && p.CreatedAt < tresholdDate);
                _logger.LogInformation($"Deleted {result.DeletedCount} old preview portfolios.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting old previews: {ex.Message}");
            }
        }
    }
}
