using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartLetterBox.ViewModels;

namespace SmartLetterBox.DataLayer
{


    public class DataContext : IdentityDbContext<IdentityUser>
    {
        public DataContext(DbContextOptions
    <DataContext> options) : base(options)
        { }
        
        public DbSet<Letter> Letters { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Database=CourseWork;Trusted_Connection=True;");
        }

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    base.OnModelCreating(builder);
        //}
    }
}
