using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartLetterBox.DataLayer;
using SmartLetterBox.ModelDTO;
using SmartLetterBox.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SmartLetterBox.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly DataContext context;
        private readonly UserManager<IdentityUser> userManager;

        public MailController(
            DataContext _context,
            UserManager<IdentityUser> _userManager)
        {
            this.context = _context;
            this.userManager = _userManager;
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
        public void AddLetter([FromQuery] string title, string desc, string sender, string received)
        {
            var receivedUser = context.Users.FirstOrDefault(x => x.Email == received);
            var senderUser = context.Users.FirstOrDefault(x => x.Email == sender);
            context.Letters.Add(new Letter()
            {
                Title = title,
                Description = desc,
                IsReaden = false,
                Status = true,
                SenderId = senderUser.Id,
                RecievedId = receivedUser.Id
            });
            context.SaveChanges();

        }
        [HttpPost("set-is-readen")]
        public void SetIsReaden([FromQuery] string id)
        {
            var letter = context.Letters.FirstOrDefault(l => l.Id == Int32.Parse(id));
            letter.IsReaden = true;
            context.SaveChanges();
        }
    }
}
