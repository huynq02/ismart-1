using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ReturnOrderDTO
{
    public class UpdateReturnOrderRequest
    {
        public int ReturnOrderId { get; set; }
        public string ReturnOrderCode { get; set; }
        public DateTime ReturnedDate { get; set; }
        public int WarehouseId { get; set; }
        public int SupplierId { get; set; }
        public int StatusId { get; set; }
        public int CreatedBy { get; set; }
        public int? ApprovedBy { get; set; }
    }
}
