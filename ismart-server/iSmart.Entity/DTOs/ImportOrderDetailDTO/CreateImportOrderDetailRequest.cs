using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ImportOrderDetailDTO
{
    public class CreateImportOrderDetailRequest
    {
        public int ImportId { get; set; }

        public float CostPrice { get; set; }

        public string BatchCode { get; set; }

        public DateTime ManufactureDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int? GoodsId { get; set; }

        public int? Quantity { get; set; }


    }
}
