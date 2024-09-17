using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

namespace iSmart.Entity.Models
{
    public partial class iSmartContext : DbContext
    {
        public iSmartContext()
        {
        }

        public iSmartContext(DbContextOptions<iSmartContext> options)
            : base(options)
        {
        }
        public virtual DbSet<BatchCheckingDetail> BatchDetails { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<ActionType> ActionTypes { get; set; }
        public virtual DbSet<AvailableForReturn> AvailableForReturns { get; set; }
        public virtual DbSet<Bill> Bills { get; set; }
        public virtual DbSet<BillDetail> BillDetails { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Delivery> Deliveries { get; set; }
        public virtual DbSet<EmailToken> EmailTokens { get; set; }
        public virtual DbSet<ExportOrder> ExportOrders { get; set; }
        public virtual DbSet<ExportOrderDetail> ExportOrderDetails { get; set; }
        public virtual DbSet<Feature> Features { get; set; }
        public virtual DbSet<Good> Goods { get; set; }
        public virtual DbSet<GoodsHistory> GoodsHistories { get; set; }
        public virtual DbSet<ImportOrder> ImportOrders { get; set; }
        public virtual DbSet<ImportOrderDetail> ImportOrderDetails { get; set; }
        public virtual DbSet<MeasuredUnit> MeasuredUnits { get; set; }
        public virtual DbSet<RefreshToken> RefreshTokens { get; set; }
        public virtual DbSet<ReturnsOrder> ReturnsOrders { get; set; }
        public virtual DbSet<ReturnsOrderDetail> ReturnsOrderDetails { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Status> Statuses { get; set; }
        public virtual DbSet<Supplier> Suppliers { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserWarehouse> UserWarehouses { get; set; }
        public virtual DbSet<Warehouse> Warehouses { get; set; }
        public virtual DbSet<GoodsWarehouse> GoodsWarehouses { get; set; }
        public virtual DbSet<InventoryCheck> InventoryChecks { get; set; }
        public virtual DbSet<InventoryCheckDetail> InventoryCheckDetails { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                    .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                    .AddJsonFile("appsettings.json")
                    .Build();

                optionsBuilder.UseSqlServer(configuration.GetConnectionString("SqlConnection"));
            }
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.CustomerId);
                entity.Property(e => e.CustomerName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.CustomerAddress)
                      .HasMaxLength(200);

                entity.Property(e => e.CustomerPhone)
                      .HasMaxLength(20);

                entity.Property(e => e.CustomerEmail)
                      .HasMaxLength(100);

            });
            modelBuilder.Entity<InventoryCheck>()
                .HasOne(ic => ic.Warehouse)
                .WithMany(w => w.InventoryChecks)
                .HasForeignKey(ic => ic.WarehouseId);

            modelBuilder.Entity<InventoryCheck>().HasOne(d => d.Status)
                    .WithMany(p => p.InventoryChecks)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InventoryCheck_Status");

            modelBuilder.Entity<InventoryCheckDetail>()
                .HasOne(icd => icd.InventoryCheck)
                .WithMany(ic => ic.InventoryCheckDetails)
                .HasForeignKey(icd => icd.InventoryCheckId);

            modelBuilder.Entity<InventoryCheckDetail>()
                .HasOne(icd => icd.Good)
                .WithMany(g => g.InventoryCheckDetails)
                .HasForeignKey(icd => icd.GoodId);
            modelBuilder.Entity<InventoryCheckDetail>()
                .HasMany(icd => icd.BatchDetails)
                .WithOne(bd => bd.InventoryCheckDetail)
                .HasForeignKey(bd => bd.InventoryCheckDetailId);

            modelBuilder.Entity<GoodsWarehouse>(entity =>
            {
                entity.HasKey(e => new { e.GoodsId, e.WarehouseId });

                entity.HasOne(d => d.Good)
                    .WithMany(p => p.GoodsWarehouses)
                    .HasForeignKey(d => d.GoodsId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Warehouse)
                    .WithMany(p => p.GoodsWarehouses)
                    .HasForeignKey(d => d.WarehouseId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ActionType>(entity =>
            {
                entity.HasKey(e => e.ActionId);

                entity.ToTable("ActionType");

                entity.Property(e => e.ActionId).ValueGeneratedNever();

                entity.Property(e => e.Action)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description).HasMaxLength(250);
            });

            modelBuilder.Entity<AvailableForReturn>(entity =>
            {
                entity.HasOne(d => d.Export)
                    .WithMany(p => p.AvailableForReturns)
                    .HasForeignKey(d => d.ExportId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(d => d.Goods)
                    .WithMany(p => p.AvailableForReturns)
                    .HasForeignKey(d => d.GoodsId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Import)
                    .WithMany(p => p.AvailableForReturns)
                    .HasForeignKey(d => d.ImportId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Bill>(entity =>
            {
                entity.ToTable("Bill");

                entity.Property(e => e.BillCode)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Note).HasMaxLength(250);

                entity.HasOne(d => d.CreatedNavigation)
                    .WithMany(p => p.BillCreatedNavigations)
                    .HasForeignKey(d => d.CreatedId)
                    .HasConstraintName("FK_StocktakeNote_User_CreatedId");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.Bills)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StocktakeNote_Status");

                entity.HasOne(d => d.UpdatedNavigation)
                    .WithMany(p => p.BillUpdatedNavigations)
                    .HasForeignKey(d => d.UpdatedId)
                    .HasConstraintName("FK_StocktakeNote_User_UpdatedId");

                entity.HasOne(d => d.Warehouse)
                    .WithMany(p => p.Bills)
                    .HasForeignKey(d => d.WarehouseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StocktakeNote_Storage_StorageId");
            });

            modelBuilder.Entity<BillDetail>(entity =>
            {
                entity.HasKey(e => e.DetailId)
                    .HasName("PK_StocktakeNoteDetail");

                entity.ToTable("BillDetail");

                entity.Property(e => e.Note).HasMaxLength(250);

                entity.HasOne(d => d.Bill)
                    .WithMany(p => p.BillDetails)
                    .HasForeignKey(d => d.BillId)
                    .HasConstraintName("FK_StocktakeNoteDetail_StocktakeNote_StocktakeId");

                entity.HasOne(d => d.Goods)
                    .WithMany(p => p.BillDetails)
                    .HasForeignKey(d => d.GoodsId)
                    .HasConstraintName("FK_StocktakeNoteDetail_Goods_GoodsId");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Category");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description).HasMaxLength(250);
            });

            modelBuilder.Entity<Delivery>(entity =>
            {
                entity.HasOne(d => d.Status)
                    .WithMany(d => d.Deliveries)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Delivery_Status");
                entity.HasKey(e => e.DeliveyId);

                entity.ToTable("Delivery");

                entity.Property(e => e.DeliveryName).HasMaxLength(50);
            });

            modelBuilder.Entity<EmailToken>(entity =>
            {
                entity.HasKey(e => e.TokenId);

                entity.ToTable("EmailToken");

                entity.Property(e => e.Token)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.EmailTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<ExportOrder>(entity =>
            {
                entity.HasKey(e => e.ExportId);

                entity.ToTable("ExportOrder");

                entity.Property(e => e.ExportCode)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Image)
                    .IsUnicode(false)
                    .HasColumnName("image");

                entity.Property(e => e.Note).HasMaxLength(250);

                entity.HasOne(d => d.Delivery)
                    .WithMany(p => p.ExportOrders)
                    .HasForeignKey(d => d.DeliveryId)
                    .HasConstraintName("FK_ExportOrder_Delivery");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.ExportOrders)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ExportOrder_Status");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.ExportOrders)
                    .HasForeignKey(d => d.UserId);

                entity.HasOne(d => d.Warehouse)
                    .WithMany(p => p.ExportOrders)
                    .HasForeignKey(d => d.WarehouseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ExportOrder_Storage_StorageId");

                entity.HasOne(d => d.Customer)
                   .WithMany(c => c.ExportOrders)  // Customer can have many ExportOrders
                   .HasForeignKey(d => d.CustomerId)  // Foreign key property in ExportOrder
                   .OnDelete(DeleteBehavior.ClientSetNull)  // If Customer is deleted, set CustomerId to null
                   .HasConstraintName("FK_ExportOrder_Customer_CustomerId");
            });

            modelBuilder.Entity<ExportOrderDetail>(entity =>
            {
                entity.HasKey(e => e.DetailId);

                entity.ToTable("ExportOrderDetail");

                entity.HasOne(d => d.Export)
                    .WithMany(p => p.ExportOrderDetails)
                    .HasForeignKey(d => d.ExportId);

                entity.HasOne(d => d.Goods)
                    .WithMany(p => p.ExportOrderDetails)
                    .HasForeignKey(d => d.GoodsId)
                    .HasConstraintName("FK_ExportOrderDetail_Goods");
                entity.HasOne(eod => eod.ImportOrderDetail)
                     .WithMany()
                     .HasForeignKey(eod => eod.ImportOrderDetailId)
                     .OnDelete(DeleteBehavior.ClientSetNull)
                     .HasConstraintName("FK_ExportOrderDetail_ImportOrderDetail");
            });

            modelBuilder.Entity<Feature>(entity =>
            {
                entity.Property(e => e.FeatureId).HasColumnName("featureId");

                entity.Property(e => e.Featurename)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("featurename");

                entity.Property(e => e.Url).HasColumnName("url");
            });

            modelBuilder.Entity<Good>(entity =>
            {
                entity.HasKey(e => e.GoodsId);

                entity.Property(e => e.Barcode).HasMaxLength(24);

                entity.Property(e => e.Description).HasMaxLength(250);

                entity.Property(e => e.GoodsCode).HasMaxLength(24);

                entity.Property(e => e.GoodsName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.MeasuredUnit).HasMaxLength(100);

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Goods)
                    .HasForeignKey(d => d.CategoryId);

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.Goods)
                    .HasForeignKey(d => d.StatusId)
                    .HasConstraintName("FK_Goods_Status");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.Goods)
                    .HasForeignKey(d => d.SupplierId);

            });

            modelBuilder.Entity<GoodsHistory>(entity =>
            {
                entity.HasKey(e => e.HistoryId);

                entity.ToTable("GoodsHistory");

                entity.Property(e => e.CostPriceDifferential).HasMaxLength(50);

                entity.Property(e => e.Note).HasMaxLength(250);

                entity.Property(e => e.QuantityDifferential).HasMaxLength(11);

                entity.HasOne(d => d.Action)
                    .WithMany(p => p.GoodsHistories)
                    .HasForeignKey(d => d.ActionId);

                entity.HasOne(d => d.Goods)
                    .WithMany(p => p.GoodsHistories)
                    .HasForeignKey(d => d.GoodsId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.GoodsHistories)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<ImportOrder>(entity =>
            {
                entity.HasKey(e => e.ImportId);

                entity.ToTable("ImportOrder");

                entity.Property(e => e.Image)
                    .IsUnicode(false)
                    .HasColumnName("image");

                entity.Property(e => e.ImportCode)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Note).HasMaxLength(250);

                entity.HasOne(d => d.Delivery)
                    .WithMany(p => p.ImportOrders)
                    .HasForeignKey(d => d.DeliveryId)
                    .HasConstraintName("FK_ImportOrder_Delivery");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.ImportOrders)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ImportOrder_Status");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.ImportOrders)
                    .HasForeignKey(d => d.SupplierId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.ImportOrders)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ImportOrder_User");

                entity.HasOne(d => d.Warehouse)
                    .WithMany(p => p.ImportOrders)
                    .HasForeignKey(d => d.WarehouseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ImportOrder_Storage_StorageId");
            });

            modelBuilder.Entity<ImportOrderDetail>(entity =>
            {
                entity.HasKey(e => e.DetailId);

                entity.ToTable("ImportOrderDetail");

                entity.Property(e => e.BatchCode).IsRequired();
                entity.Property(e => e.CostPrice).IsRequired();
                entity.Property(e => e.ManufactureDate).IsRequired();
                entity.Property(e => e.ExpiryDate).IsRequired();
                entity.Property(e => e.Quantity).IsRequired();

                entity.HasOne(d => d.Goods)
                    .WithMany(p => p.ImportOrderDetails)
                    .HasForeignKey(d => d.GoodsId)
                    .HasConstraintName("FK_ImportOrderDetail_Goods");

                entity.HasOne(d => d.Import)
                    .WithMany(p => p.ImportOrderDetails)
                    .HasForeignKey(d => d.ImportId);
            });


            modelBuilder.Entity<MeasuredUnit>(entity =>
            {
                entity.ToTable("MeasuredUnit");

                entity.Property(e => e.MeasuredUnitName)
                    .IsRequired()
                    .HasMaxLength(100);
            });



            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.TokenId);

                entity.ToTable("RefreshToken");

                entity.Property(e => e.IsRevoked)
                    .IsRequired()
                    .HasDefaultValueSql("(CONVERT([bit],(0)))");

                entity.Property(e => e.JwtId)
                    .IsRequired()
                    .HasMaxLength(36);

                entity.Property(e => e.Token)
                    .IsRequired()
                    .HasMaxLength(44);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.RefreshTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<ReturnsOrder>(entity =>
            {
                entity.HasKey(e => e.ReturnOrderId);

                entity.ToTable("ReturnOrder");

                entity.Property(e => e.ReturnOrderCode)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.ReturnedDate).HasDefaultValueSql("('0001-01-01T00:00:00.0000000')");
                entity.Property(e => e.ConfirmedDate).HasDefaultValueSql("('0001-01-01T00:00:00.0000000')");

                entity.HasOne(d => d.Warehouse)
                    .WithMany(p => p.ReturnsOrders)
                    .HasForeignKey(d => d.WarehouseId)
                    .HasConstraintName("FK_ReturnOrder_Warehouse");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.ReturnsOrders)
                    .HasForeignKey(d => d.SupplierId)
                    .HasConstraintName("FK_ReturnOrder_Supplier");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.ReturnsOrders)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ReturnOrder_Status");

                entity.HasOne(d => d.User)
                   .WithMany(p => p.CreatedReturnOrders)
                   .HasForeignKey(d => d.CreatedBy)
                   .OnDelete(DeleteBehavior.NoAction)
                   .HasConstraintName("FK_ReturnOrder_CreatedByUser");

                entity.HasOne(d => d.ApprovedByUser)
                    .WithMany(p => p.ApprovedReturnOrders)
                    .HasForeignKey(d => d.ApprovedBy)
                    .OnDelete(DeleteBehavior.NoAction)
                    .HasConstraintName("FK_ReturnOrder_ApprovedByUser");
            });

            modelBuilder.Entity<ReturnsOrderDetail>(entity =>
            {
                entity.HasKey(e => e.ReturnOrderDetailId);

                entity.ToTable("ReturnOrderDetail");

                entity.HasOne(d => d.Goods)
                    .WithMany(p => p.ReturnsOrderDetails)
                    .HasForeignKey(d => d.GoodsId)
                    .HasConstraintName("FK_ReturnOrderDetail_Goods");

                entity.HasOne(d => d.ReturnOrder)
                    .WithMany(p => p.ReturnsOrderDetails)
                    .HasForeignKey(d => d.ReturnOrderId)
                    .OnDelete(DeleteBehavior.NoAction)
                    .HasConstraintName("FK_ReturnOrderDetail_ReturnOrder");

                entity.Property(e => e.Reason).HasMaxLength(250);
                entity.Property(e => e.BatchCode).HasMaxLength(50);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasMany(d => d.Features)
                    .WithMany(p => p.Roles)
                    .UsingEntity<Dictionary<string, object>>(
                        "RoleFeature",
                        l => l.HasOne<Feature>().WithMany().HasForeignKey("FeatureId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_RoleFeature_Features"),
                        r => r.HasOne<Role>().WithMany().HasForeignKey("RoleId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_RoleFeature_Role"),
                        j =>
                        {
                            j.HasKey("RoleId", "FeatureId");

                            j.ToTable("RoleFeature");

                            j.IndexerProperty<int>("RoleId").HasColumnName("roleId");

                            j.IndexerProperty<int>("FeatureId").HasColumnName("featureId");
                        });
            });

            modelBuilder.Entity<Status>(entity =>
            {
                entity.ToTable("Status");

                entity.Property(e => e.StatusType)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.ToTable("Supplier");

                entity.Property(e => e.Note).HasMaxLength(250);

                entity.Property(e => e.SupplierEmail).HasMaxLength(62);

                entity.Property(e => e.SupplierName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.SupplierPhone)
                    .IsRequired()
                    .HasMaxLength(15);

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.Suppliers)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Supplier_Status");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.Address).HasMaxLength(250);

                entity.Property(e => e.Email).HasMaxLength(62);

                entity.Property(e => e.FullName).HasMaxLength(100);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(32);

                entity.Property(e => e.StatusId).HasDefaultValueSql("(CONVERT([bit],(0)))");

                entity.Property(e => e.UserCode).HasMaxLength(24);

                entity.Property(e => e.UserName).HasMaxLength(100);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId);

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.StatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Status");
            });

            modelBuilder.Entity<UserWarehouse>(entity =>
            {
                entity.ToTable("User_Warehouse");

                entity.HasIndex(e => new { e.UserId, e.WarehouseId }, "UQ__User_War__95E846B211E0D37C")
                    .IsUnique();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserWarehouses)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__User_Ware__UserI__68487DD7");

                entity.HasOne(d => d.Warehouse)
                    .WithMany(p => p.UserWarehouses)
                    .HasForeignKey(d => d.WarehouseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__User_Ware__Wareh__693CA210");
            });

            modelBuilder.Entity<Warehouse>(entity =>
            {
                entity.ToTable("Warehouse");

                entity.Property(e => e.WarehouseAddress).HasMaxLength(100);

                entity.Property(e => e.WarehouseName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.WarehousePhone)
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}