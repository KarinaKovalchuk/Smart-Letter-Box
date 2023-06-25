using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;
using Microsoft.AspNetCore.Identity;

namespace SmartLetterBox.ViewModels
{
    public class Letter
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public bool IsReaden { get; set; }

        [Required]
        public bool Status { get; set; }

        public string SenderId { get; set; }
        [ForeignKey(nameof(SenderId))]
        public virtual IdentityUser Sender { get; set; }

        public string RecievedId { get; set; }
        [ForeignKey(nameof(RecievedId))]
        public virtual IdentityUser Recieved { get; set; }

    }
}
