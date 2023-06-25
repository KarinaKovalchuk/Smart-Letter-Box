using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartLetterBox.ViewModels;
using System;
using System.Linq;

namespace SmartLetterBox.DataLayer
{
    public class Seeder
    {
        public static void SeedDb(IServiceProvider services, IConfiguration config)
        {
            using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var manager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var managerRole = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                SeedData(manager, managerRole, context);
            }
        }

        public static void SeedData(UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager, DataContext context)
        {
            //var roleName = "user";
            //if (roleManager.FindByNameAsync(roleName).Result == null)
            //{
            //    var resUserRole = roleManager.CreateAsync(new IdentityRole
            //    {
            //        Name = roleName
            //    }).Result;

                var user = new IdentityUser()
                {
                    UserName = "ZezSasha",
                    Email = "examples@gmail.com",
                    PhoneNumber = "1234567890"
                };

                var resultUser = userManager.CreateAsync(user, "207Hs72gs!").Result;
                resultUser = userManager.AddToRoleAsync(user, "user").Result;
                context.SaveChanges();

            

            var letter = new Letter()
            {
                Title = "Name of letter",
                Description = "Шановний [Ім'я/Титул/Пошта одержувача]",
                IsReaden = false,
                Status = true,
                SenderId = context.Users.FirstOrDefault(x=>x.Email == "examples@gmail.com").Id,
                RecievedId = context.Users.FirstOrDefault(x => x.Email == "examples@gmail.com").Id

            };

            context.Letters.Add(letter);
            context.SaveChanges();
        }
    }
}
