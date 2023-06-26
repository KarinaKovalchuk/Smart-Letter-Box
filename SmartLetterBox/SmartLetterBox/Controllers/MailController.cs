using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartLetterBox.DataLayer;
using SmartLetterBox.JWT;
using SmartLetterBox.ModelDTO;
using SmartLetterBox.Validator;
using SmartLetterBox.ViewModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace SmartLetterBox.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly DataContext context;
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly IJWTTokenServices jwtTokenService;

        public MailController(
            DataContext _context,
            UserManager<IdentityUser> _userManager, 
            SignInManager<IdentityUser> signInManager, 
            IJWTTokenServices _jWTTokenServices)
        {
            this.context = _context;
            this.userManager = _userManager;
            this.signInManager = signInManager;
            this.jwtTokenService = _jWTTokenServices;
        }

        [HttpGet("get-received-letters")]
        public List<LetterDTO> GetRecievedLetters([FromQuery] string received)
        {
            var user = context.Users.FirstOrDefault(x => x.Email == received);
            return context.Letters.Where(x => x.RecievedId == user.Id).Select(l => new LetterDTO()
            {
                Id = l.Id,
                Title = l.Title,
                Recieved = received,
                Description = l.Description,
                Status = l.Status,
                IsReaden = l.IsReaden,
                Sender = context.Users.FirstOrDefault(u => u.Id == l.SenderId).Email
            }).ToList();

        }

        [HttpGet("get-sender-letters")]
        public List<LetterDTO> GetSenderLetters([FromQuery] string sender)
        {
            var user = context.Users.FirstOrDefault(x => x.Email == sender);
            return context.Letters.Where(x => x.SenderId == user.Id).Select(l => new LetterDTO()
            {
                Id = l.Id,
                Title = l.Title,
                Recieved = context.Users.FirstOrDefault(u => u.Id == l.RecievedId).Email,
                Description = l.Description,
                Status = l.Status,
                IsReaden = l.IsReaden,
                Sender = user.Email
            }).ToList();
        }

        [HttpPost("add-letter")]
        public LetterDTO AddLetter([FromQuery] string title, string desc, string sender, string received)
        {
            var receivedUser = context.Users.FirstOrDefault(x => x.Email == received);
            var senderUser = context.Users.FirstOrDefault(x => x.Email == sender);
            var letter = new Letter()
            {
                Title = title,
                Description = desc,
                IsReaden = false,
                Status = true,
                SenderId = senderUser.Id,
                RecievedId = receivedUser.Id
            };
            context.Letters.Add(letter);
            context.SaveChanges();
            return new LetterDTO()
            {
                Id = letter.Id,
                Description = letter.Description,
                IsReaden = letter.IsReaden,
                Recieved = receivedUser.Email,
                Sender = senderUser.Email,
                Status = letter.Status,
                Title = letter.Title
            };
        }

        [HttpPost("set-is-readen")]
        public void SetIsReaden([FromQuery] string id)
        {
            var letter = context.Letters.FirstOrDefault(l => l.Id == Int32.Parse(id));
            letter.IsReaden = true;
            context.SaveChanges();
        }

        [HttpGet("get-count-unread-message")]
        public int GetCountUnreadMessage([FromQuery] string received)
        {
            var user = context.Users.FirstOrDefault(x => x.Email == received);
            return context.Letters.Where(x => x.RecievedId == user.Id && x.IsReaden == false).Select(l => new LetterDTO()
            {
                Id = l.Id,
                Title = l.Title,
                Recieved = received,
                Description = l.Description,
                Status = l.Status,
                IsReaden = l.IsReaden,
                Sender = context.Users.FirstOrDefault(u => u.Id == l.SenderId).Email
            }).Count();
        }

        [HttpGet("is-sended")]
        public bool IsSendedMessage([FromQuery] string id)
        {
            var letter = context.Letters.FirstOrDefault(x => x.Id == Int32.Parse(id));
            if (letter == null) return false;
            else return true;
        }
        [HttpPost("register")]
        public async Task<ResultDTO> Register([FromQuery] string email, string password)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new ResultErrorDTO()
                    {
                        Status = 401,
                        Message = "ERROR",
                        Errors = CustomValidator.getErrorsByModel(ModelState)
                    };
                }

                var user = new IdentityUser()
                {
                    Email = email,
                    UserName = email
                };


                IdentityResult result = await userManager.CreateAsync(user, password);
                result = await userManager.AddToRoleAsync(user, "user");

                if (result.Succeeded)
                {
                    context.Users.Attach(user);
                    context.SaveChanges();

                    return new ResultDTO()
                    {
                        Message = "OK",
                        Status = 200
                    };
                }
                else
                {
                    return new ResultErrorDTO()
                    {
                        Message = "ERROR",
                        Status = 403,
                        Errors = CustomValidator.getErrorsByIdentityResult(result)
                    };
                }


            }
            catch (Exception e)
            {
                return new ResultErrorDTO
                {
                    Status = 500,
                    Message = e.Message,
                    Errors = new List<string>()
                    {
                        e.Message
                    }
                };
            }

        }

        [HttpPost("login")]
        public async Task<ResultDTO> Login([FromQuery] string email, string password)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new ResultErrorDTO
                    {
                        Message = "ERROR",
                        Status = 401,
                        Errors = CustomValidator.getErrorsByModel(ModelState)
                    };
                }

                var result = signInManager.PasswordSignInAsync(email, password, false, false).Result;

                if (!result.Succeeded)
                {
                    return new ResultErrorDTO
                    {
                        Status = 403,
                        Message = "ERROR",
                        Errors = new List<string> { "Incorrect email or password" }
                    };
                }
                else
                {
                    var user = await userManager.FindByEmailAsync(email);
                    await signInManager.SignInAsync(user, false);


                    return new ResultLoginDTO
                    {
                        Status = 200,
                        Message = "OK",
                        Token = jwtTokenService.CreateToken(user)
                    };
                }
            }
            catch (Exception e)
            {
                return new ResultErrorDTO
                {
                    Status = 500,
                    Message = "ERROR",
                    Errors = new List<string> { e.Message }
                };
            }
        }

        [HttpGet("delete-by-id")]
        public void DeleteById([FromQuery] string id)
        {
            var letter = context.Letters.FirstOrDefault(x=>x.Id == Int32.Parse(id));
            context.Letters.Remove(letter);
            context.SaveChanges();
        }
    }
}
