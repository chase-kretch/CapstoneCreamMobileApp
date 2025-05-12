using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("health")]
public class HealthController: Controller
{
    [HttpGet]
    public ActionResult<string> HealthCheck()
    {
        return Ok("Healthy");
    }
}