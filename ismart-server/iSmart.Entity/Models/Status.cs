using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class Status
    {
        public Status()
        {
            Bills = new HashSet<Bill>();
            ExportOrders = new HashSet<ExportOrder>();
            Goods = new HashSet<Good>();
            ImportOrders = new HashSet<ImportOrder>();
            ReturnsOrders = new HashSet<ReturnsOrder>();
            Suppliers = new HashSet<Supplier>();
            Users = new HashSet<User>();
            Deliveries = new HashSet<Delivery>();
            InventoryChecks = new HashSet<InventoryCheck>();
        }

        public int StatusId { get; set; }
        public string StatusType { get; set; }

        public virtual ICollection<Delivery> Deliveries { get; set; }
        public virtual ICollection<Bill> Bills { get; set; }
        public virtual ICollection<ExportOrder> ExportOrders { get; set; }
        public virtual ICollection<Good> Goods { get; set; }
        public virtual ICollection<ImportOrder> ImportOrders { get; set; }
        public virtual ICollection<ReturnsOrder> ReturnsOrders { get; set; }
        public virtual ICollection<Supplier> Suppliers { get; set; }
        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<InventoryCheck> InventoryChecks { get; set; }
    }
}
