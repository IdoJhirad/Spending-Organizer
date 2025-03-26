using System.Security.Claims;
using System.Threading.Tasks;
using c__api.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace c__api.Middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class AuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuthMiddleware> _logger;


        public AuthMiddleware(RequestDelegate next, ILogger<AuthMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            try
            {
                _logger.LogInformation("AuthMiddleware invoked for path: {Path}", httpContext.Request.Path);

                //middlewear is singlton by default 
                // create a scope to resolve the UserManager service
                //using for self resolve
                using var scope = httpContext.RequestServices.CreateScope();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

                var email = httpContext.User.FindFirstValue(ClaimTypes.Email);
                if (!string.IsNullOrWhiteSpace(email))
                {
                    var appUser = await userManager.FindByNameAsync(email);
                    if (appUser != null)
                    {
                        httpContext.Items["User"] = appUser;
                        _logger.LogInformation("User {Email} authenticated and attached to HttpContext.", email);

                    }

                }

                await _next(httpContext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in AuthMiddleware.");
            }

        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class AuthMiddlewareExtensions
    {
        public static IApplicationBuilder UseAuthMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuthMiddleware>();
        }
    }
}
