using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.ReportDTO
{
    public class ExportReportDto
    {
        public string TransactionCode { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string MeasureUnit { get; set; }
        public int Quantity { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}
