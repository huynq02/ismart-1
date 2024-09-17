using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.WarehouseDTO
{
    public class UpdateWarehouseRequest
    {
        public int StorageId { get; set; }
        public string? StorageName { get; set; }
        public string? StorageAddress { get; set; }
        public string? StoragePhone { get; set; }
    }
}
