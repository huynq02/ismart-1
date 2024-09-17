using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.Models
{
    public class BatchCheckingDetail
    {
        public int Id { get; set; }
        public int InventoryCheckDetailId { get; set; }
        public string BatchCode { get; set; }
        public int ExpectedQuantity { get; set; }
        public int ActualQuantity { get; set; }
        public string? Note { get; set; }
        public InventoryCheckDetail InventoryCheckDetail { get; set; }
    }
}