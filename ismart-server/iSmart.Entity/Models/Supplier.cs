using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class Supplier
    {
        public Supplier()
        {
            Goods = new HashSet<Good>();
            ImportOrders = new HashSet<ImportOrder>();
            ReturnsOrders = new HashSet<ReturnsOrder>();
        }

        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierPhone { get; set; }
        public int StatusId { get; set; }
        public string? SupplierEmail { get; set; }
        public string? Note { get; set; }

        public virtual Status Status { get; set; }
        public virtual ICollection<Good> Goods { get; set; }
        public virtual ICollection<ImportOrder> ImportOrders { get; set; }
        public virtual ICollection<ReturnsOrder> ReturnsOrders { get; set; }
    }
}
