using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.InventoryCheckDTO
{
    public class CreateInventoryCheckResponse : BaseResponseDTO
    {
        public byte[] Pdf { get; set; }
    }
}
