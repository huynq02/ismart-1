using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.Models
{
    public class InventoryCheck
    {
        public int Id { get; set; }
        public int WarehouseId { get; set; }
        public int StatusId { get; set; }
        public DateTime CheckDate { get; set; }

        // Navigation property
        public virtual Status Status { get; set; }
        public virtual Warehouse Warehouse { get; set; }
        public virtual ICollection<InventoryCheckDetail> InventoryCheckDetails { get; set; }
    }
}