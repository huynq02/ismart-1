using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.InventoryCheckDTO
{
    public class ResponseInventoryCheckDTO
    {
        public string WarehouseName { get; set; }
        public string WarehouseAddress { get; set; }
        public DateTime CheckDate { get; set; }
        public string AccountantName { get; set; }
        public string WarehouseManagerName { get; set; }
        public List<ResponseInventoryCheckDetailDTO> Detail { get; set;}
    }
}
