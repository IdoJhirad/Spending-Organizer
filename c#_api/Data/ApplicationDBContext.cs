using System.Security.Principal;
using c__api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace c__api.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
            :base(dbContextOptions)
        {
            
        }
        public DbSet<Expense> Expense { get; set; }
        public DbSet<CategoryModel> Categories { get; set; }
        public DbSet<UserCategory> UserCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //forgin key of userCategory
            modelBuilder.Entity<UserCategory>(x => x.HasKey(p => new { p.AppUserId, p.CategoryModelId }));

            modelBuilder.Entity<UserCategory>()
                .HasOne(u => u.AppUser)
                .WithMany(u => u.UserCategories)
                .HasForeignKey(p => p.AppUserId);

            modelBuilder.Entity<UserCategory>()
                .HasOne(u => u.CategoryModel)
                .WithMany(u => u.UserCategories)
                .HasForeignKey(p => p.CategoryModelId);



            //rolls definenition user and admin
            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Name = "User",
                    NormalizedName = "USER"
                },
            };
            //put the rols in the model 
            modelBuilder.Entity<IdentityRole>().HasData(roles);




            //modelBuilder.Entity<CategoryModel>()
            //.HasIndex(c => c.CategoryName)
            //.IsUnique();
        }
    }
}
