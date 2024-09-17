using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class GoodsHistory
    {
        public int HistoryId { get; set; }
        public int GoodsId { get; set; }
        public int ActionId { get; set; }
        public DateTime Date { get; set; }
        public float? CostPrice { get; set; }
        public string? CostPriceDifferential { get; set; }
        public int? Quantity { get; set; }
        public string? QuantityDifferential { get; set; }
        public string? Note { get; set; }
        public string? OrderCode { get; set; }
        public int UserId { get; set; }

        public virtual ActionType Action { get; set; }
        public virtual Good Goods { get; set; }
        public virtual User User { get; set; }
    }
}
