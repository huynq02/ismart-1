using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class User
    {
        public User()
        {
            BillCreatedNavigations = new HashSet<Bill>();
            BillUpdatedNavigations = new HashSet<Bill>();
            EmailTokens = new HashSet<EmailToken>();
            ExportOrders = new HashSet<ExportOrder>();
            GoodsHistories = new HashSet<GoodsHistory>();
            ImportOrders = new HashSet<ImportOrder>();
            RefreshTokens = new HashSet<RefreshToken>();
            UserWarehouses = new HashSet<UserWarehouse>();
            CreatedReturnOrders = new HashSet<ReturnsOrder>();
            ApprovedReturnOrders = new HashSet<ReturnsOrder>();
        }

        public int UserId { get; set; }
        public string? Email { get; set; }
        public string Password { get; set; }
        public string? Phone { get; set; }
        public int RoleId { get; set; }
        public int StatusId { get; set; }
        public string? UserName { get; set; }
        public string? UserCode { get; set; }
        
        public string? Address { get; set; }
        public string? Image { get; set; }
        public string? FullName { get; set; }

        public virtual Role Role { get; set; }
        public virtual Status Status { get; set; }
        public virtual ICollection<Bill> BillCreatedNavigations { get; set; }
        public virtual ICollection<Bill> BillUpdatedNavigations { get; set; }
        public virtual ICollection<EmailToken> EmailTokens { get; set; }
        public virtual ICollection<ExportOrder> ExportOrders { get; set; }
        public virtual ICollection<GoodsHistory> GoodsHistories { get; set; }
        public virtual ICollection<ImportOrder> ImportOrders { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
        public virtual ICollection<UserWarehouse> UserWarehouses { get; set; }
        public virtual ICollection<ReturnsOrder> CreatedReturnOrders { get; set; }
        public virtual ICollection<ReturnsOrder> ApprovedReturnOrders { get; set; }
    }
}
