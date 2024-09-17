using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.Models
{
    public partial class GoodsWarehouse
    {
        public int GoodsId { get; set; }
        public int WarehouseId { get; set; }
        public int Quantity { get; set; }

        public virtual Good Good { get; set; }
        public virtual Warehouse Warehouse { get; set; }
    }
}
