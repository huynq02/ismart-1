using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.SupplierDTO
{
    public class CreateSupplierRequest
    {

        public string SupplierName { get; set; } = null!;

        public string SupplierPhone { get; set; } = null!;

        public int StatusId { get; set; }

        public string? SupplierEmail { get; set; }

        public string? Note { get; set; }

    }
}
