using System.Linq.Expressions;
using System.Security.Claims;
using c__api.Models;
using Microsoft.AspNetCore.Identity;

namespace c__api.Utils.Helpers
{
    public static class Extensions
    {
        /*
         * Extension method for IQueryable (DbSet) Check if condition valid and do the filter or return the src
         * Func<T, bool> delagate get T return bool like the e=> e.amount == amount
         * Expression<Func<T, bool>>  Wraps that function in an expression tree, allowing it to be inspected and translated by LINQ providers.
         * means  not just passing a compiled function; you're passing an expression that describes the function, which can be analyzed and transformed at runtime.
         */
        public static IQueryable<T> WhereIf<T>(this IQueryable<T> source, bool condition, Expression<Func<T, bool>> filter)
        {
            return condition ? source.Where(filter) : source;
        }
        public static async Task<AppUser?> GetAppUserAsync(this ClaimsPrincipal user, UserManager<AppUser> userManager)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrWhiteSpace(email))
            {       
                return null;
            }
            var appUser = await userManager.FindByNameAsync(email);
            return appUser;
        }


    }
}
