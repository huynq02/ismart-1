using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class Good
    {
        public Good()
        {
            AvailableForReturns = new HashSet<AvailableForReturn>();
            BillDetails = new HashSet<BillDetail>();
            ExportOrderDetails = new HashSet<ExportOrderDetail>();
            GoodsHistories = new HashSet<GoodsHistory>();
            ImportOrderDetails = new HashSet<ImportOrderDetail>();
            ReturnsOrderDetails = new HashSet<ReturnsOrderDetail>();
            GoodsWarehouses = new HashSet<GoodsWarehouse>();
        }

        public int GoodsId { get; set; }
        public string GoodsName { get; set; }
        public string? GoodsCode { get; set; }
        public int CategoryId { get; set; }
        public string? Description { get; set; }
        public int SupplierId { get; set; }
        public string? MeasuredUnit { get; set; }
        public string? Image { get; set; }
        public int? StatusId { get; set; }
        public float StockPrice { get; set; }
        public string? Barcode { get; set; }
        public int? MaxStock { get; set; }
        public int? MinStock { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? WarrantyTime { get; set; }

        public virtual Category Category { get; set; }
        public virtual Status Status { get; set; }
        public virtual Supplier Supplier { get; set; }
        public virtual ICollection<AvailableForReturn> AvailableForReturns { get; set; }
        public virtual ICollection<BillDetail> BillDetails { get; set; }
        public virtual ICollection<ExportOrderDetail> ExportOrderDetails { get; set; }
        public virtual ICollection<GoodsHistory> GoodsHistories { get; set; }
        public virtual ICollection<ImportOrderDetail> ImportOrderDetails { get; set; }
        public virtual ICollection<ReturnsOrderDetail> ReturnsOrderDetails { get; set; }
        public virtual ICollection<GoodsWarehouse> GoodsWarehouses { get; set; }
        public virtual ICollection<InventoryCheckDetail> InventoryCheckDetails { get; set; }
    }
}
