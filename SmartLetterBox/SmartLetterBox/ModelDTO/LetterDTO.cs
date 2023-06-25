using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SmartLetterBox.ModelDTO
{
    public class LetterDTO
    {
        public int Id { get; set; }
       
        public string Title { get; set; }

        public string Description { get; set; }

        public bool IsReaden { get; set; }

        public bool Status { get; set; }

        public string Sender { get; set; }

        public string Recieved { get; set; }
    }
}
