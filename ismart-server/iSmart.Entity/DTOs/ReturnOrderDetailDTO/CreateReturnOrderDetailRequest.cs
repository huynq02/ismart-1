using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ReturnOrderDetailDTO
{
    public class CreateReturnOrderDetailRequest
    {
        public int ReturnOrderId { get; set; }
        public int GoodsId { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; }
        public string BatchCode { get; set; }
    }
}
