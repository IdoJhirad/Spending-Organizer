using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using c__api.Dtos.Account;
using c__api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace c__api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _symmetricSecurityKey;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager, ILogger<AccountController> logger, IConfiguration configuration, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _logger = logger;
            _configuration = configuration;
            _symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigninKey"]!));
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                var userExsist =await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email);
                if (userExsist)
                {
                    return BadRequest("User already exsist.");
                }
                var appUser = new AppUser
                {
                    UserName = registerDto.Email,
                    Email = registerDto.Email,
                    Name = registerDto.Name

                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password!);
                if (!createdUser.Succeeded)
                {
                    _logger.LogInformation($"User faild to register  with mail {registerDto.Email} errors {createdUser.Errors.ToList()}");
                    return BadRequest(createdUser.Errors);
                }
                var roleRes = await _userManager.AddToRoleAsync(appUser, "User");
                if (!roleRes.Succeeded)
                {
                    return StatusCode(500, roleRes.Errors);
                }
                return Ok(
                    new NewUserDto
                    {
                        Name = appUser.Name,
                        Email = appUser.Email,
                        Token = GeneretToken(appUser)
                    }
                    );

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in registewr user{ex}");
                return StatusCode(500, "Server Error please try agin later");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto) 
        {
            try
            {
                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
                if (user == null)
                {
                    return BadRequest("User does not exisit.");
                }
                var res = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
                if (!res.Succeeded)
                {
                    return Unauthorized("email/paswword invalid!");
                }
                return Ok(new NewUserDto
                {
                    Email = user.Email,
                    Name = user.Name,
                    Token = GeneretToken(user)
                });
            }
            catch (Exception ex) 
            {
                _logger.LogError($"Error in registewr user{ex}");
                return StatusCode(500, "Server Error please try agin later");
            }
        }

        private string GeneretToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Name, user.Name!)
            };
            var creds = new SigningCredentials(_symmetricSecurityKey, SecurityAlgorithms.HmacSha512Signature);
            //object representation of the token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(1),
                SigningCredentials = creds,
                Issuer = _configuration["JWT:Issuer"],
                Audience = _configuration["JWT:Audience"]
            };
            //create token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

    }
}
