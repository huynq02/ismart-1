using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.InventoryCheckDTO
{
    public class CreateInventoryCheckDTO
    {
        public int InventoryCheckId { get; set; }
        public int WarehouseId { get; set; }
        public DateTime CheckDate { get; set; }
        public string? status { get; set; }
        public List<InventoryCheckDetailDTO> InventoryCheckDetails { get; set; }
    }
}
