using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.WarehouseDTO
{
    public class CreateWarehouseRequest
    {
        public string StorageName { get; set; }
        public string? StorageAddress { get; set; } = null;
        public string? StoragePhone { get; set; } = null;
    }
}
