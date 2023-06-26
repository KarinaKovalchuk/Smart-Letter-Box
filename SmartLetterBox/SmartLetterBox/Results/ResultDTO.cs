using System.Collections.Generic;

namespace SmartLetterBox.Results
{

    public class ResultDTO
    {
        public int Status { get; set; }
        public string Message { get; set; }
    }

    public class ResultErrorDTO : ResultDTO
    {
        public List<string> Errors { get; set; }
    }

    public class ResultLoginDTO : ResultDTO
    {
        public string Token { get; set; }
    }


}
