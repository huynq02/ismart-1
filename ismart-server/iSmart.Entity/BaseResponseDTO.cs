using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity
{
    public class BaseResponseDTO
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }

    }
}
