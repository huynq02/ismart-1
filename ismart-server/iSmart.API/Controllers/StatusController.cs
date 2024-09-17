using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using iSmart.Service;

namespace iSmart.API.Controllers
{
    [Route("api/status")]
    [ApiController]
    //[Authorize]

    public class StatusController : ControllerBase
    {
        private readonly IStatusService _statusService;

        public StatusController(IStatusService statusService)
        {
            _statusService = statusService;
        }

        [HttpGet("get-all-status")]
        public IActionResult GetAllStatus()
        {
            var result = _statusService.GetAllStatus();
            return Ok(result);
        }
    }
}
