using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ExportOrderDTO
{
    public class UpdateExportOrderRequest
    {
        public int ExportId { get; set; }

        public int UserId { get; set; }

        public float? TotalPrice{ get; set; }

        public string? Note { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ExportedDate { get; set; }

        public int? StatusId { get; set; }

        public string? ExportCode { get; set; } = null!;

        public int? WarehouseId { get; set; }

        public int? DeliveryId { get; set; }

        public string? Image { get; set; }

        public int? ManagerId { get; set; }
        public int? CustomerId { get; set; }
    }
}
