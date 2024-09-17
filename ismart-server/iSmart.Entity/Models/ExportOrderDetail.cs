using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class ExportOrderDetail
    {
        public int DetailId { get; set; }
        public int ExportId { get; set; }
        public float Price { get; set; }
        public int? GoodsId { get; set; }
        public int? Quantity { get; set; }
        public int ImportOrderDetailId { get; set; }
        public virtual ExportOrder Export { get; set; }
        public virtual Good Goods { get; set; }
        public virtual ImportOrderDetail ImportOrderDetail { get; set; } 
    }
}
