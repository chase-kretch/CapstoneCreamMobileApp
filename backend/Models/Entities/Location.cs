using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace backend.Models.Entities;

[Owned]
public class Location
{
    [Required]
    public required string Country { get; set; }
    [Required]
    public required string City { get; set; }
    [Required]
    public required double Latitude { get; set; }
    [Required]
    public required double Longitude { get; set; }
    
    public double CalculateDistanceInMeters(Location other)
    {
        const double EarthRadiusKm = 6371; // Earth's radius in kilometers
        
        var dLat = ToRadians(other.Latitude - Latitude);
        var dLon = ToRadians(other.Longitude - Longitude);
        
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(Latitude)) * Math.Cos(ToRadians(other.Latitude)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        
        return EarthRadiusKm * c * 1000; // Convert to meters
    }
    
    public double CalculateDistanceInKilometers(Location other)
    {
        return CalculateDistanceInMeters(other) / 1000;
    }
    
    private static double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}