using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WaterProject.API.Data;

namespace WaterProject.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WaterController : ControllerBase
    {
        private WaterDbContext _waterContext;
        public WaterController(WaterDbContext temp) => _waterContext = temp;

        [HttpGet("AllProjects")]
        public IActionResult GetProjects(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? ProjectTypes = null)
        {
            var query = _waterContext.Projects.AsQueryable();

            if (ProjectTypes != null && ProjectTypes.Any())
            {
                query = query.Where(p => ProjectTypes.Contains(p.ProjectType));
            }

            var totalNumProjects = query.Count();

            var projects = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var numProjects = _waterContext.Projects.Count();

            var someObject = new
            {
                Projects = projects,
                NumProjects = numProjects
            };

            return Ok(someObject);
        }

        [HttpGet("GetProjectTypes")]
        public IActionResult GetProjectTypes()
        {
            var projectTypes = _waterContext.Projects
                .Select(p => p.ProjectType)
                .Distinct()
                .ToList();

            return Ok(projectTypes);
        }
    }
}
