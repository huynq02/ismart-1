using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ImportOrderDetailDTO
{
    public class BatchInventoryDTO
    {
        public int ImportOrderDetailId { get; set; }
        public string BatchCode { get; set; }
        public float CostPrice { get; set; }
        public DateTime ManufactureDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime? ImportedDate { get; set; }

        public int ActualQuantity { get; set; }
        public int Quantity { get; set; }
        public string? Location { get; set; }
    }
}