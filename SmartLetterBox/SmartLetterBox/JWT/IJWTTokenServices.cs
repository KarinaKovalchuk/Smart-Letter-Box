using Microsoft.AspNetCore.Identity;

namespace SmartLetterBox.JWT
{
    public interface IJWTTokenServices
    {
        string CreateToken(IdentityUser user);
    }
}
