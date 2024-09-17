using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class Bill
    {
        public Bill()
        {
            BillDetails = new HashSet<BillDetail>();
        }

        public int BillId { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Canceled { get; set; }
        public DateTime? Updated { get; set; }
        public int StatusId { get; set; }
        public int? UpdatedId { get; set; }
        public int WarehouseId { get; set; }
        public string? Note { get; set; }
        public int CreatedId { get; set; }
        public string BillCode { get; set; }

        public virtual User CreatedNavigation { get; set; }
        public virtual Status Status { get; set; }
        public virtual User UpdatedNavigation { get; set; }
        public virtual Warehouse Warehouse { get; set; }
        public virtual ICollection<BillDetail> BillDetails { get; set; }
    }
}
