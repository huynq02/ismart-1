using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.Models;

namespace iSmart.Entity.DTOs.GoodsDTO
{
    public class GoodsDTO
    {
        public int GoodsId { get; set; }

        public string GoodsName { get; set; } = null!;

        public string? GoodsCode { get; set; }

        public int CategoryId { get; set; }

        public string? Description { get; set; }

        public int SupplierId { get; set; }

        public float CostPrice { get; set; }

        public string? MeasuredUnit { get; set; }

        public int InStock { get; set; }

        public string? Image { get; set; }

        public int? StatusId { get; set; }

        public float StockPrice { get; set; }
        public DateTime? CreatedDate { get; set; }


        public int? WarrantyTime { get; set; }

        public string? Barcode { get; set; }

        public int StorageId { get; set; }

        public int? MaxStock { get; set; }

        public int? MinStock { get; set; }

        public string CategoryName { get; set; } = null!;


        public string Status { get; set; }


        public string StorageName { get; set; } = null!;

        public string SupplierName { get; set; } = null!;

    }
}
