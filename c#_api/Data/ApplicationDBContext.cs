using System.Security.Principal;
using c__api.Models;
using Microsoft.EntityFrameworkCore;

namespace c__api.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
            :base(dbContextOptions)
        {
            
        }
        public DbSet<Expense> Expense { get; set; }
        public DbSet<CategoryModel> Categories { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            //modelBuilder.Entity<CategoryModel>()
            //.HasIndex(c => c.CategoryName)
            //.IsUnique();
        }
    }
}
