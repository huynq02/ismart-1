using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.GoodsDTO
{
    public class GoodHistoryDTO
    {
        public int HistoryId { get; set; }

        public int GoodsId { get; set; }

        public int ActionId { get; set; }

        public string? ActionType { get; set; }

        public DateTime Date { get; set; }

        public float? CostPrice { get; set; }

        public string? CostPriceDifferential { get; set; }

        public int? Quantity { get; set; }

        public string? QuantityDifferential { get; set; }

        public string? Note { get; set; }

        public string? OrderCode { get; set; }

        public int UserId { get; set; }

        public string? UserName { get; set; }

    }
}
