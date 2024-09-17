using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class ImportOrder
    {
        public ImportOrder()
        {
            AvailableForReturns = new HashSet<AvailableForReturn>();
            ImportOrderDetails = new HashSet<ImportOrderDetail>();
        }

        public int ImportId { get; set; }
        public int UserId { get; set; }
        public int? SupplierId { get; set; }
        public float TotalCost { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ImportedDate { get; set; }
        public int StatusId { get; set; }
        public string ImportCode { get; set; }
        public int WarehouseId { get; set; }
        public int? DeliveryId { get; set; }
        public string? Image { get; set; }
        public int? StaffId { get; set; }
        public int? WarehouseDestinationId { get; set; }
        public virtual Delivery Delivery { get; set; }
        public virtual Status Status { get; set; }
        public virtual Supplier Supplier { get; set; }
        public virtual User User { get; set; }
        public virtual Warehouse Warehouse { get; set; }
        public virtual ICollection<AvailableForReturn> AvailableForReturns { get; set; }
        public virtual ICollection<ImportOrderDetail> ImportOrderDetails { get; set; }

    }
}
