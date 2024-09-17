using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ExportOrderDTO
{
    public class ExportOrderDTO
    {
        public int ExportId { get; set; }

        public string ExportCode { get; set; } = null!;

        public int UserId { get; set; }

        public string? UserName { get; set; }

        public float TotalPrice { get; set; }

        public string? Note { get; set; }

        public int StatusId { get; set; }

        public string StatusType { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? ExportedDate { get; set; }

        public int WarehouseId { get; set; }

        public string WarehouseName { get; set; }
        public int? WarehouseDestinationId { get; set; }

        public string? WarehouseDestinationName { get; set; }

        public DateTime? CancelDate { get; set; }

        public int? DeliveryId { get; set; }

        public string? DeliveryName { get; set; }


        public string? Image { get; set; }

        public int? ManagerId { get; set; }

        public string? ManagerName { get; set; }

        public string? CustomerName { get; set; }
        public List<ExportDetailDTO> ExportOrderDetails { get; set; }
    }
}