using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ImportOrderDTO
{
    public class ImportOrderDTO
    {
        public int ImportId { get; set; }

        public int UserId { get; set; }
        public string? UserName { get; set; }

        public int SupplierId { get; set; }
        public string? SupplierName { get; set; }

        public float TotalCost { get; set; }

        public string? Note { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? ImportedDate { get; set; }

        public int StatusId { get; set; }
        public string? StatusType { get; set; }
        public string? ImportCode { get; set; } 

        public int StorageId { get; set; }
        public string? StorageName { get; set; }
        public int? WarehouseDestinationId { get; set; }
        public string? WarehouseDestinationName { get; set; }

        public int? DeliveryId { get; set; }
        public string? DeliveryName { get; set; }
        public string? Image { get; set; }

        public int? StorekeeperId { get; set; }
        public string? StorekeeperName { get; set; }    
        public List<ImportDetailDTO> ImportOrderDetails { get; set; }

    }
}
