using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ExportOrderDTO
{
    public class CreateExportOrderRequest
    {
 
        public string ExportCode { get; set; } = null!;
        public float? TotalPrice { get; set; }

        public string? Note { get; set; }

        public DateTime? ExportedDate { get; set; }

        public int WarehouseId { get; set; }

        public DateTime? CancelDate { get; set; }

        public int? DeliveryId { get; set; }

        public string? Image { get; set; }

        public int? CustomerId { get; set; }
        public int? WarehouseDestinationId { get; set; }
        //public List<ExportDetailDTO> ExportOrderDetails { get; set; }
    }
}
