using System;
using System.Collections.Generic;
using static iSmart.Entity.Models.ReturnsOrder;

namespace iSmart.Entity.Models
{
    public partial class ReturnsOrderDetail
    {
        public int ReturnOrderDetailId { get; set; }
        public int ReturnOrderId { get; set; }
        public ReturnsOrder ReturnOrder { get; set; }
        public int GoodsId { get; set; }
        public Good Goods { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } 
        public string BatchCode { get; set; }
    }

}
