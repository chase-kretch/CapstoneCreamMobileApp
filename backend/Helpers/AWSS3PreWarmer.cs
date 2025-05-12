using Amazon.S3;
using Amazon.S3.Model;

namespace backend.Helpers;

// All this class does is force a request to be made with the S3 Client which prevents the first actual request from being slow

public class AWSS3PreWarmer
{
    private readonly IAmazonS3 _s3Client;
    private readonly ILogger<AWSS3PreWarmer> _logger;

    public AWSS3PreWarmer(IAmazonS3 s3Client, ILogger<AWSS3PreWarmer> logger)
    {
        _s3Client = s3Client;
        _logger = logger;
    }

    public async Task PreWarmConnectionAsync()
    {

    }
}