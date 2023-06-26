using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using SmartLetterBox.DataLayer;

namespace SmartLetterBox.JWT
{

    public class JWTTokenServices : IJWTTokenServices
    {
        private readonly DataContext context;
        private readonly IConfiguration configuration;
        private readonly UserManager<IdentityUser> userManager;

        public JWTTokenServices(
            DataContext _context,
            IConfiguration _configuration,
            UserManager<IdentityUser> _userManager)
        {
            configuration = _configuration;
            context = _context;
            userManager = _userManager;
        }

        public string CreateToken(IdentityUser user)
        {
            var roles = userManager.GetRolesAsync(user).Result;
            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim("email", user.Email.ToString())
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim("roles", role));
            }

            var jwtTokenSecretKey = configuration.GetValue<string>("SecretPhrase");
            var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtTokenSecretKey));
            var signInCredentials = new SigningCredentials(signInKey, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                    signingCredentials: signInCredentials,
                    claims: claims,
                    expires: DateTime.Now.AddDays(10)
                );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
