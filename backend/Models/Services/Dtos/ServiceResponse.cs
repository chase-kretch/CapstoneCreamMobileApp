namespace backend.Models.Services.Dtos;

public class ServiceResponse<T>
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public int StatusCode { get; set; }
    public T? Data { get; set; }
    
    public static ServiceResponse<T> Ok(T data, string message = "Success")
    {
        return new ServiceResponse<T>
        {
            IsSuccess = true,
            Message = message,
            StatusCode = 200,
            Data = data
        };
    }
    
    public static ServiceResponse<T> Created(T data, string message = "Created")
    {
        return new ServiceResponse<T>
        {
            IsSuccess = true,
            Message = message,
            StatusCode = 201,
            Data = data
        };
    }
    
    public static ServiceResponse<T> BadRequest(string message)
    {
        return new ServiceResponse<T>
        {
            IsSuccess = false,
            Message = message,
            StatusCode = 400,
        };
    }
    
    public static ServiceResponse<T> Conflict( string message)
    {
        return new ServiceResponse<T>
        {
            IsSuccess = false,
            Message = message,
            StatusCode = 409,
        };
    }
    
    public static ServiceResponse<T> NotFound(string message)
    {
        return new ServiceResponse<T>
        {
            IsSuccess = false,
            Message = message,
            StatusCode = 404,
        };
    }
    
    public static ServiceResponse<T> Fail(string message)
    {
        return new ServiceResponse<T>
        {
            IsSuccess = false,
            Message = message,
            StatusCode = 500,
        };
    }
    
    public static ServiceResponse<object?> NoContent()
    {
        return new ServiceResponse<object?>
        {
            IsSuccess = true,
            Message = "No Content",
            StatusCode = 204,
            Data = null
        };
    }
    
    public static ServiceResponse<T> Unauthorized(string message)
    {
        return new ServiceResponse<T>
        {
            IsSuccess = false,
            Message = message,
            StatusCode = 401,
        };
    }
    
    public static ServiceResponse<T> Forbidden(string message)
    {
        return new ServiceResponse<T>
        {
            IsSuccess = false,
            Message = message,
            StatusCode = 403,
        };
    }

    internal bool Any()
    {
        throw new NotImplementedException();
    }
}