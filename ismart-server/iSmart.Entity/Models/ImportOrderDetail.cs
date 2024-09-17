 using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class ImportOrderDetail
    {
        public int DetailId { get; set; }
        public string BatchCode { get; set; }
        public int ImportId { get; set; }

        public int GoodsId { get; set; }
        public float CostPrice { get; set; }
        public DateTime ManufactureDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int Quantity { get; set; }
        public int ActualQuantity { get; set; }
        public virtual Good Goods { get; set; }
        public virtual ImportOrder Import { get; set; }
    }
}
