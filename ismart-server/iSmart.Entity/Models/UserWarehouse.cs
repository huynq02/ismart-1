using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class UserWarehouse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int WarehouseId { get; set; }

        public virtual User User { get; set; }
        public virtual Warehouse Warehouse { get; set; }
    }
}
