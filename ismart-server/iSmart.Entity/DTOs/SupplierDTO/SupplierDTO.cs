using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.Models;

namespace iSmart.Entity.DTOs.SupplierDTO
{
    public class SupplierDTO
    {
        public int SupplierId { get; set; }

        public string SupplierName { get; set; } = null!;

        public string SupplierPhone { get; set; } = null!;

        public string? SupplierEmail { get; set; }

        public string? Note { get; set; }

        public int StatusId { get; set; }

        public string  Status { get; set; } = null!;
    }
}
