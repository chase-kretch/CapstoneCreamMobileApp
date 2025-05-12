using backend.Models.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public sealed class CreamSqliteDbContext : CreamDbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables(prefix: "CREAM_")
                .Build();
            optionsBuilder.UseSqlite(configuration.GetConnectionString("DefaultConnection")).UseLazyLoadingProxies();
        }
    }
}