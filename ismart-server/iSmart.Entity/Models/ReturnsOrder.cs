using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class ReturnsOrder
    {
        public ReturnsOrder()
        {
            ReturnsOrderDetails = new HashSet<ReturnsOrderDetail>();
        }

            public int ReturnOrderId { get; set; }
            public string ReturnOrderCode { get; set; }
            public DateTime ReturnedDate { get; set; }
            public DateTime? ConfirmedDate { get; set; }
            public int WarehouseId { get; set; }
            public Warehouse Warehouse { get; set; }
            public int SupplierId { get; set; }
            public Supplier Supplier { get; set; }
            public int StatusId { get; set; }
            public Status Status { get; set; }
            // Thêm thông tin người tạo và người xác nhận
            public int CreatedBy { get; set; }
            public int? ApprovedBy { get; set; }
        public virtual User User { get; set; } // Người tạo đơn
        public virtual User ApprovedByUser { get; set; } // Người duyệt đơn (Optional)

        public virtual ICollection<ReturnsOrderDetail> ReturnsOrderDetails { get; set; }
    }
}
