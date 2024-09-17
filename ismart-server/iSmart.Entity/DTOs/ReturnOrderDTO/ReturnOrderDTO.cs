using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ReturnOrderDTO
{
    public class ReturnOrderDTO
    {
        public int ReturnOrderId { get; set; }
        public string ReturnOrderCode { get; set; }
        public DateTime ReturnedDate { get; set; }
        public int WarehouseId { get; set; }
        public string WarehouseName { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public int StatusId { get; set; }
        public string StatusType { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public int? ApprovedBy { get; set; }
        public string ApprovedByName { get; set; }
        public List<ReturnOrderDetailDto> ReturnOrderDetails { get; set; }
    }
}
