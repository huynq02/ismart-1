using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.InventoryCheckDTO
{
    public class ResponseInventoryCheckDetailDTO
    {
        public string goodCode { get; set; }
        public string goodName { get; set; }
        public string MeasureUnit { get; set; }
        public int InAppQuantity { get; set; }
        public int ActualQuantity { get; set; }
        public string Note { get; set; }
        public int Difference { get; set; }
        public List<ResponseBatchDetailDTO> BatchDetails { get; set; }

    }

    public class ResponseBatchDetailDTO
    {
        public string BatchCode { get; set; }
        public int ExpectedQuantity { get; set; }
        public int ActualQuantity { get; set; }
        public string Note { get; set; }
    }
}