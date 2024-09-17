using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ExportOrderDTO
{
    public class ExportDetailDTO
    {
        public int DetailId { get; set; }

        public int ExportId { get; set; }

        public float Price { get; set; }

        public int? GoodsId { get; set; }
        public string? GoodsCode { get; set; }

        public int? Quantity { get; set; }

        public int ImportOrderDetailId { get; set; }

        public string? batchCode { get; set; }
    }
}
