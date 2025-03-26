using System.ComponentModel.DataAnnotations;

namespace c__api.Dtos.Account
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Password { get; set; }
        //[Required]
        //[Phone]
        //public string? Phone { get; set; }
    }
}
