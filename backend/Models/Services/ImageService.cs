using System.Net;
using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using backend.Data;
using backend.Models.Entities;
using backend.Models.Services.Dtos;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;

namespace backend.Models.Services;

public class ImageService : IImageService
{
    private readonly ICreamRepo _repo;
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly ILogger<ImageService> _logger;
    private readonly DtoMapper _dtoMapper;
    
    public ImageService(ICreamRepo repo, IAmazonS3 s3Client, S3Bucket s3Bucket, ILogger<ImageService> logger, DtoMapper dtoMapper)
    {
        _repo = repo;
        _s3Client = s3Client;
        _bucketName = s3Bucket.BucketName;
        _logger = logger;
        _dtoMapper = dtoMapper;
    }

    public ServiceResponse<PhotoDto> SetProfilePicture(int userId, IFormFile file)
    {
        var user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<PhotoDto>.NotFound($"User with id {userId} not found.");
        }
        
        if (!file.ContentType.Contains("image"))
        {
            return ServiceResponse<PhotoDto>.BadRequest("The file you uploaded is not an image.");
        }
        
        var photo = UploadImage(file);
        
        if (photo == null)
        {
            return ServiceResponse<PhotoDto>.Fail("We received your image but failed to upload it to our servers. Please report this error.");
        }
        
        var oldProfilePicture = user.ProfilePicture;
        user.ProfilePicture = photo;
        _repo.SaveChanges();
        
        if (oldProfilePicture != null)
        {
            DeleteImage(oldProfilePicture);
        }
        
        return ServiceResponse<PhotoDto>.Created(_dtoMapper.PhotoToPhotoDto(photo));
    }

    public ServiceResponse<PhotoDto> AddGalleryPicture(int userId, IFormFile file)
    {
        var user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<PhotoDto>.NotFound($"User with id {userId} not found.");
        }
        
        if (user.Photos.Count >= ValidationConfig.MaxGalleryPhotos)
        {
            return ServiceResponse<PhotoDto>.BadRequest($"You can only have up to {ValidationConfig.MaxGalleryPhotos} photos, please remove some before adding.");
        }
        
        if (!file.ContentType.Contains("image"))
        {
            return ServiceResponse<PhotoDto>.BadRequest("The file you uploaded is not an image.");
        }
        
        var photo = UploadImage(file);
        
        if (photo == null)
        {
            return ServiceResponse<PhotoDto>.Fail("We received your image but failed to upload it to our servers. Please report this error.");
        }
        
        user.Photos.Add(photo);
        _repo.SaveChanges();
        
        return ServiceResponse<PhotoDto>.Created(_dtoMapper.PhotoToPhotoDto(photo));
    }
    
    public ServiceResponse<string> DeleteProfilePicture(int userId)
    {
        var user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<string>.NotFound($"User with id {userId} not found.");
        }
        
        if (user.ProfilePicture == null)
        {
            return ServiceResponse<string>.NotFound("User does not have a profile picture.");
        }
        
        if (DeleteImage(user.ProfilePicture))
        {
            user.ProfilePicture = null;
            _repo.SaveChanges();
            return ServiceResponse<string>.Ok("Profile picture deleted.");
        }
        
        return ServiceResponse<string>.Fail("Failed to delete profile picture.");
    }
    
    public ServiceResponse<string> DeleteGalleryPicture(int userId, int photoId)
    {
        var user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<string>.NotFound($"User with id {userId} not found.");
        }
        
        var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
        
        if (photo == null)
        {
            return ServiceResponse<string>.Forbidden($"Photo with id {photoId} does not exist or does not belong to you.");
        }
        
        if (DeleteImage(photo))
        {
            user.Photos.Remove(photo);
            _repo.SaveChanges();
            return ServiceResponse<string>.Ok("Photo deleted.");
        }
        
        return ServiceResponse<string>.Fail("Failed to delete photo.");
    }

    public Photo? UploadImage(IFormFile file)
    {
        using var image = Image.Load(file.OpenReadStream());  // Load the image from the file stream

        // Convert to WebP and store in a memory stream
        using var memoryStream = new MemoryStream();
        var webpOptions = new WebpEncoder
        {
            Quality = 80
        };
        image.Save(memoryStream, webpOptions);
        
        var key = Guid.NewGuid().ToString();
        
        var putRequest = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
            InputStream = memoryStream,
            ContentType = "image/webp"
        };
        
        var response = _s3Client.PutObjectAsync(putRequest).Result;
        
        if (response.HttpStatusCode != HttpStatusCode.OK)
        {
            _logger.LogError($"Failed to upload image to S3. Status code: {response.HttpStatusCode}");
            return null;
        }

        return new Photo { Key = key };
    }

    public bool DeleteImage(Photo photo)
    {
        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = photo.Key
        };
        
        var response = _s3Client.DeleteObjectAsync(deleteRequest).Result;
        
        _repo.RemovePhoto(photo.Id);
        
        return response.HttpStatusCode == HttpStatusCode.NoContent;
    }
}