using Google.Analytics.Data.V1Beta;
using Microsoft.AspNetCore.Mvc;
using static Google.Analytics.Data.V1Beta.Filter.Types;

namespace PortfolioMakerBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly BetaAnalyticsDataClient _client;
        private readonly string _propertyId;

        public AnalyticsController(IConfiguration config)
        {
            var clientBuilder = new BetaAnalyticsDataClientBuilder
            {
                CredentialsPath = config["GoogleAnalytics:KeyFilePath"]
            };
            _client = clientBuilder.Build();
            _propertyId = config["GoogleAnalytics:PropertyId"];
        }

        [HttpGet("portfolio/{portfolioId}/views")]
        public async Task<IActionResult> GetPortfolioViews(string portfolioId)
        {
            var request = new RunReportRequest
            {
                Property = $"properties/{_propertyId}",
                Dimensions = { new Dimension { Name = "pagePath" } },
                Metrics = { new Metric { Name = "screenPageViews" } },
                DimensionFilter = new FilterExpression
                {
                    Filter = new Filter
                    {
                        FieldName = "pagePath",
                        StringFilter = new Filter.Types.StringFilter
                        {
                            MatchType = StringFilter.Types.MatchType.Contains,
                            Value = $"/preview/{portfolioId}"
                        }
                    }
                },
                DateRanges =
                {
                    new DateRange { StartDate = "30daysAgo", EndDate = "today"}
                }
            };

            var response = await _client.RunReportAsync(request);

            long totalViews = response.Rows.Sum(row => 
                long.TryParse(row.MetricValues[0].Value, out var v) ? v : 0
            );

            return Ok(new { portfolioId, views = totalViews });
        }

        [HttpGet("portfolio/{portfolioId}/timeseries")]
        public async Task<IActionResult> GetPortfolioTimeSeries(string portfolioId)
        {
            var request = new RunReportRequest
            {
                Property = $"properties/{_propertyId}",
                Dimensions = { new Dimension { Name = "date" } },
                Metrics = { new Metric { Name = "screenPageViews" } },
                DimensionFilter = new FilterExpression
                {
                    Filter = new Filter
                    {
                        FieldName = "pagePath",
                        StringFilter = new Filter.Types.StringFilter
                        {
                            MatchType = StringFilter.Types.MatchType.Contains,
                            Value = $"/preview/{portfolioId}"
                        }
                    }
                },
                DateRanges = { new DateRange { StartDate = "30daysAgo", EndDate = "today" } }
            };

            var response = await _client.RunReportAsync(request);
            var series = response.Rows.Select(row => new
            {
                date = row.DimensionValues[0].Value,
                views = int.Parse(row.MetricValues[0].Value)
            }).ToList();

            return Ok(series);
        }
    }
}
