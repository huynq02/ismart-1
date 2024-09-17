using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class BillDetail
    {
        public int DetailId { get; set; }
        public int BillId { get; set; }
        public int GoodsId { get; set; }
        public int CurrentStock { get; set; }
        public int ActualStock { get; set; }
        public int AmountDifferential { get; set; }
        public string? Note { get; set; }

        public virtual Bill Bill { get; set; }
        public virtual Good Goods { get; set; }
    }
}
