using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public sealed class CreamPostgresDbContext : CreamDbContext
{
    static CreamPostgresDbContext()
    {
        // Allows unspecified timestamp values to work with postgres
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables(prefix: "CREAM_")
                .Build();
            
            var host = configuration.GetValue<string>("DB_HOST");
            var database = configuration.GetValue<string>("DB_NAME");
            var username = configuration.GetValue<string>("DB_USERNAME");
            var password = configuration.GetValue<string>("DB_PASSWORD");
            
            Console.WriteLine("host: " + host);
            Console.WriteLine("database: " + database);
            Console.WriteLine("username: " + username);
    
            var connectionString = $"Host={host};Database={database};Username={username};Password={password}";
            
            optionsBuilder.UseNpgsql(connectionString).UseLazyLoadingProxies();
        }
    }
}