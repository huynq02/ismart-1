
using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs;
using iSmart.Entity.DTOs.GoodsDTO;
using iSmart.Entity.Models;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Caching.Memory;
using System.Security.AccessControl;


namespace iSmart.Service
{
    public interface IGoodsService
    {
        GoodsFilterPaging GetGoodsByKeyword(int pageSize, int page, int? warehouseId, int? categoryId, int? supplierId, int? sortPriece, string? keyword = "");
        Task<List<Good>?> GetAllGoods();

        Task<List<Good>?> GetAllGoodsWithStorageAndSupplier(int storageId, int supplierId);
        Task<List<Good>?> GetAllGoodsOfSupplier(int supplierId);
        Good GetGoodsById(int id);
        CreateGoodsResponse AddGoods(CreateGoodsRequest goods, int userId);
        CreateGoodsResponse AddGoodsByAdmin(CreateGoodsRequest goods, int warehouseId);
        UpdateGoodsResponse UpdateGoods(UpdateGoodsRequest goods);
        bool UpdateStatusGoods(int id, int StatusId);
        Task<List<GoodsDTO>?> GetGoodsInWarehouse(int warehouseId);
        Task<List<GoodsDTO>?> GetGoodsInWarehouseBySupplier(int warehouseId, int supplierId);
        GoodsDTO GetGoodsInWarehouseById(int warehouseId, int goodId);
        List<GoodAlert> Alert(int warehouseId);
    }
    public class GoodsService : IGoodsService
    {
        private readonly iSmartContext _context;
        private readonly IUserWarehouseService _userWarehouseService;
        private readonly IMemoryCache _cache;

        public GoodsService(iSmartContext context, IUserWarehouseService userWarehouseService, IMemoryCache memoryCache)
        {
            _context = context;
            _userWarehouseService = userWarehouseService;
            _cache = memoryCache;
        }

        public CreateGoodsResponse AddGoodsByAdmin(CreateGoodsRequest goods, int warehouseId)
        {
            try
            {
                // Kiểm tra xem hàng hóa đã tồn tại chưa
                var existingGood = _context.Goods
                    .SingleOrDefault(i => i.GoodsCode == goods.GoodsCode);

                if (existingGood == null)
                {

                    string countryCode = "VN";
                    string year = DateTime.Now.Year.ToString().Substring(2, 2);
                    string barcode = $"{countryCode}{year}{goods.GoodsCode}";
                    // Tạo hàng hóa mới
                    var newGood = new Good
                    {
                        GoodsName = goods.GoodsName,
                        GoodsCode = goods.GoodsCode,
                        CategoryId = goods.CategoryId,
                        Description = goods.Description,
                        SupplierId = goods.SupplierId,
                        MeasuredUnit = goods.MeasuredUnit,
                        Image = goods.Image,
                        StatusId = goods.StatusId,
                        StockPrice = goods.StockPrice,
                        CreatedDate = DateTime.Now,
                        WarrantyTime = goods.WarrantyTime,
                        Barcode = barcode,
                        MaxStock = goods.MaxStock,
                        MinStock = goods.MinStock
                    };

                    _context.Goods.Add(newGood);
                    _context.SaveChanges();

                    var goodsWarehouse = new GoodsWarehouse
                    {
                        GoodsId = newGood.GoodsId,
                        WarehouseId = warehouseId,
                        Quantity = 0
                    };

                    _context.GoodsWarehouses.Add(goodsWarehouse);
                    _context.SaveChanges();

                    return new CreateGoodsResponse { IsSuccess = true, Message = "Thêm hàng hóa thành công" };
                }
                else
                {
                    var existingGoodsWarehouse = _context.GoodsWarehouses
                        .SingleOrDefault(gw => gw.GoodsId == existingGood.GoodsId && gw.WarehouseId == warehouseId);

                    if (existingGoodsWarehouse == null)
                    {
                        var goodsWarehouse = new GoodsWarehouse
                        {
                            GoodsId = existingGood.GoodsId,
                            WarehouseId = warehouseId,
                            Quantity = 0
                        };

                        _context.GoodsWarehouses.Add(goodsWarehouse);
                        _context.SaveChanges();

                        return new CreateGoodsResponse { IsSuccess = true, Message = "Thêm hàng hóa vào kho hàng thành công" };
                    }
                    else
                    {
                        return new CreateGoodsResponse { IsSuccess = false, Message = "Hàng đã tồn tại trong kho hàng này" };
                    }
                }
            }
            catch (Exception ex)
            {
                return new CreateGoodsResponse { IsSuccess = false, Message = $"Thêm hàng hóa thất bại, {ex.Message}" };
            }
        }

        public CreateGoodsResponse AddGoods(CreateGoodsRequest goods, int userId)
        {
            try
            {
                var warehouseId = _userWarehouseService.GetWarehouseIdByIdAsync(userId).Result;

                if (warehouseId == null)
                {
                    return new CreateGoodsResponse { IsSuccess = false, Message = "WarehouseId không tìm thấy" };
                }
                string countryCode = "VN";
                string year = DateTime.Now.Year.ToString().Substring(2, 2);
                string barcode = $"{countryCode}{year}{goods.GoodsCode}";
                // Tạo hàng hóa mới
                var newGood = new Good
                {
                    GoodsName = goods.GoodsName,
                    GoodsCode = goods.GoodsCode,
                    CategoryId = goods.CategoryId,
                    Description = goods.Description,
                    SupplierId = goods.SupplierId,
                    MeasuredUnit = goods.MeasuredUnit,
                    Image = goods.Image,
                    StatusId = goods.StatusId,
                    StockPrice = goods.StockPrice,
                    CreatedDate = DateTime.Now,
                    WarrantyTime = goods.WarrantyTime,
                    Barcode = barcode,
                    MaxStock = goods.MaxStock,
                    MinStock = goods.MinStock
                };

                // Kiểm tra xem hàng hóa đã tồn tại trong cùng kho hàng chưa
                var existingGood = _context.Goods
                    .SingleOrDefault(i => i.GoodsCode == goods.GoodsCode);

                if (existingGood == null)
                {
                    // Thêm hàng hóa mới vào bảng Goods
                    _context.Goods.Add(newGood);
                    _context.SaveChanges();

                    // Tạo bản ghi trong bảng GoodsWarehouse để thiết lập mối quan hệ
                    var goodsWarehouse = new GoodsWarehouse
                    {
                        GoodsId = newGood.GoodsId,
                        WarehouseId = (int)warehouseId,
                        Quantity = 0
                    };

                    _context.GoodsWarehouses.Add(goodsWarehouse);
                    _context.SaveChanges();

                    return new CreateGoodsResponse { IsSuccess = true, Message = "Thêm hàng hóa thành công" };
                }
                else
                {
                    return new CreateGoodsResponse { IsSuccess = false, Message = "Hàng đã tồn tại" };
                }
            }
            catch (Exception ex)
            {
                return new CreateGoodsResponse { IsSuccess = false, Message = $"Thêm hàng hóa thất bại, {ex.Message}" };
            }
        }



        public async Task<List<Good>?> GetAllGoods()
        {
            try
            {
                var goods = await _context.Goods.ToListAsync();
                return goods;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<List<Good>?> GetAllGoodsWithStorageAndSupplier(int storageId, int supplierId)
        {
            try
            {
                var goods = await _context.Goods
                    .Where(g => g.GoodsWarehouses.Any(gw => gw.WarehouseId == storageId) && g.SupplierId == supplierId)
                    .ToListAsync();
                return goods;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<List<Good>?> GetAllGoodsOfSupplier(int supplierId)
        {
            try
            {
                var goods = await _context.Goods
                    .Where(g => g.SupplierId == supplierId)
                    .ToListAsync();
                return goods;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public Good GetGoodsById(int id)
        {
            try
            {
                var goods = _context.Goods.FirstOrDefault(g => g.GoodsId == id);
                return goods ?? null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public GoodsDTO GetGoodsInWarehouseById(int warehouseId, int goodId)
        {
            try
            {
                var goods = _context.GoodsWarehouses
                    .Include(g => g.Good)
                        .ThenInclude(g => g.Category)
                    .Include(g => g.Good)
                        .ThenInclude(g => g.Supplier)
                    .Include(g => g.Good)
                        .ThenInclude(g => g.Status)
                    .FirstOrDefault(g => g.WarehouseId == warehouseId && g.GoodsId == goodId);

                if (goods == null)
                {
                    throw new Exception("Không tìm thấy sản phẩm trong kho với ID được cung cấp.");
                }

                return new GoodsDTO
                {
                    GoodsId = goods.GoodsId,
                    GoodsCode = goods.Good.GoodsCode,
                    GoodsName = goods.Good.GoodsName,
                    CategoryId = goods.Good.CategoryId,
                    CategoryName = goods.Good.Category?.CategoryName,
                    Description = goods.Good.Description,
                    StockPrice = goods.Good.StockPrice,
                    MeasuredUnit = goods.Good.MeasuredUnit,
                    InStock = goods.Quantity,
                    Image = goods.Good.Image,
                    CreatedDate = goods.Good.CreatedDate,
                    WarrantyTime = goods.Good.WarrantyTime,
                    Barcode = goods.Good.Barcode,
                    MinStock = goods.Good.MinStock,
                    MaxStock = goods.Good.MaxStock,
                    SupplierId = goods.Good.SupplierId,
                    SupplierName = goods.Good.Supplier?.SupplierName,
                    StatusId = goods.Good.StatusId,
                    Status = goods.Good.Status?.StatusType
                };
            }
            catch (Exception e)
            {
                throw new Exception($"Lỗi khi truy xuất sản phẩm: {e.Message}");
            }
        }


        public GoodsFilterPaging? GetGoodsByKeyword(int pageSize, int page, int? warehouseId, int? categoryId, int? supplierId, int? sortPrice, string? keyword = "")
        {
            try
            {
                // Đảm bảo giá trị page không âm hoặc bằng 0
                if (page < 1)
                {
                    page = 1;
                }

                var goodsQuery = _context.Goods
                .Include(g => g.Status)
                .Include(g => g.Category)
                .Include(g => g.Supplier)
                .Include(g => g.GoodsWarehouses)
                .Where(g => (!categoryId.HasValue || g.CategoryId == categoryId)
                    && (!supplierId.HasValue || g.SupplierId == supplierId) && (!warehouseId.HasValue || g.GoodsWarehouses.Any(gw => gw.WarehouseId == warehouseId)));

                // Kiểm tra và áp dụng điều kiện về keyword
                if (!string.IsNullOrEmpty(keyword))
                {
                    var keywords = keyword.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    goodsQuery = goodsQuery.AsEnumerable().Where(g =>
                        keywords.Any(k => g.GoodsName.ToLower().Contains(k) ||
                                          g.GoodsCode.ToLower().Contains(k))
                    ).AsQueryable();
                }


                // Kiểm tra nếu muốn sắp xếp theo stockPrice từ bé đến lớn
                if (sortPrice == 1)
                {
                    goodsQuery = goodsQuery.OrderBy(g => g.StockPrice);
                }
                // Kiểm tra nếu muốn sắp xếp theo stockPrice từ lớn đến bé
                else if (sortPrice == 2)
                {
                    goodsQuery = goodsQuery.OrderByDescending(g => g.StockPrice);
                }
                else
                {
                    goodsQuery = goodsQuery.OrderByDescending(g => g.CreatedDate);
                }

                var count = goodsQuery.Count();
                var goods = goodsQuery
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(g => new GoodsDTO
                    {
                        GoodsId = g.GoodsId,
                        GoodsCode = g.GoodsCode,
                        GoodsName = g.GoodsName,
                        CategoryId = g.CategoryId,
                        CategoryName = g.Category.CategoryName,
                        Description = g.Description,
                        StockPrice = g.StockPrice,
                        MeasuredUnit = g.MeasuredUnit,
                        InStock = warehouseId.HasValue ? g.GoodsWarehouses.FirstOrDefault(gw => gw.WarehouseId == warehouseId && gw.GoodsId == g.GoodsId).Quantity : 0,
                        Image = g.Image,
                        CreatedDate = g.CreatedDate,
                        WarrantyTime = g.WarrantyTime,
                        Barcode = g.Barcode,
                        MinStock = g.MinStock,
                        MaxStock = g.MaxStock,
                        SupplierId = g.SupplierId,
                        SupplierName = g.Supplier.SupplierName,
                        StatusId = g.StatusId,
                        Status = g.Status.StatusType
                    }).ToList();

                var totalPages = (int)Math.Ceiling((double)count / pageSize);

                return new GoodsFilterPaging { TotalPages = totalPages, PageSize = pageSize, Data = goods };
            }
            catch (Exception ex)
            {
                // Xử lý ngoại lệ nếu có
                throw new Exception("An error occurred while fetching goods by keyword", ex);
            }
        }



        public UpdateGoodsResponse UpdateGoods(UpdateGoodsRequest goods)
        {
            try
            {
                var existingGood = _context.Goods.FirstOrDefault(g => g.GoodsId == goods.GoodsId);
                if (existingGood == null)
                {
                    return new UpdateGoodsResponse { IsSuccess = false, Message = "Hàng hóa không tồn tại" };
                }
                var duplicateGood = _context.Goods.FirstOrDefault(g => g.GoodsCode == goods.GoodsCode && g.GoodsId != goods.GoodsId);
                if (duplicateGood != null)
                {
                    return new UpdateGoodsResponse
                    {
                        IsSuccess = false,
                        Message = "GoodsCode đã tồn tại",
                    };
                }
                existingGood.GoodsName = goods.GoodsName;
                existingGood.GoodsCode = goods.GoodsCode;
                existingGood.CategoryId = goods.CategoryId;
                existingGood.Description = goods.Description;
                existingGood.SupplierId = goods.SupplierId;
                existingGood.StockPrice = goods.StockPrice;
                existingGood.MeasuredUnit = goods.MeasuredUnit;
                existingGood.Image = goods.Image;
                existingGood.StatusId = goods.StatusId;
                existingGood.WarrantyTime = goods.WarrantyTime;
                existingGood.Barcode = goods.Barcode;
                existingGood.MaxStock = goods.MaxStock;
                existingGood.MinStock = goods.MinStock;

                _context.Goods.Update(existingGood);
                _context.SaveChanges();
                return new UpdateGoodsResponse { IsSuccess = true, Message = "Cập nhật hàng hóa thành công" };
            }
            catch (Exception ex)
            {
                return new UpdateGoodsResponse { IsSuccess = false, Message = $"Cập nhật hàng hóa thất bại: {ex.Message}" };
            }
        }


        public bool UpdateStatusGoods(int id, int StatusId)
        {
            try
            {
                var user = GetGoodsById(id);
                if (user == null)
                {
                    return false;
                }
                user.StatusId = StatusId;
                _context.Update(user);
                _context.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<GoodsDTO>> GetGoodsInWarehouse(int warehouseId)
        {
            return await _context.GoodsWarehouses
                .Where(gw => gw.WarehouseId == warehouseId)
                .OrderByDescending(g => g.Good.CreatedDate)
                .Select(gw => new GoodsDTO
                {
                    GoodsId = gw.Good.GoodsId,
                    GoodsCode = gw.Good.GoodsCode,
                    GoodsName = gw.Good.GoodsName,
                    CategoryId = gw.Good.CategoryId,
                    CategoryName = gw.Good.Category.CategoryName,
                    Description = gw.Good.Description,
                    StockPrice = gw.Good.StockPrice,
                    MeasuredUnit = gw.Good.MeasuredUnit,
                    InStock = gw.Quantity,
                    Image = gw.Good.Image,
                    CreatedDate = gw.Good.CreatedDate,
                    WarrantyTime = gw.Good.WarrantyTime,
                    Barcode = gw.Good.Barcode,
                    MinStock = gw.Good.MinStock,
                    MaxStock = gw.Good.MaxStock,
                    SupplierId = gw.Good.SupplierId,
                    SupplierName = gw.Good.Supplier.SupplierName,
                    StatusId = gw.Good.StatusId,
                    Status = gw.Good.Status.StatusType
                })
                .ToListAsync();
        }

        public async Task<List<GoodsDTO>> GetGoodsInWarehouseBySupplier(int warehouseId, int supplierId)
        {
            return await _context.GoodsWarehouses.Include(g => g.Good).ThenInclude(g => g.Supplier)
                .Where(gw => gw.WarehouseId == warehouseId && gw.Good.SupplierId == supplierId)
                .OrderByDescending(g => g.Good.CreatedDate)
                .Select(gw => new GoodsDTO
                {
                    GoodsId = gw.Good.GoodsId,
                    GoodsCode = gw.Good.GoodsCode,
                    GoodsName = gw.Good.GoodsName,
                    CategoryId = gw.Good.CategoryId,
                    CategoryName = gw.Good.Category.CategoryName,
                    Description = gw.Good.Description,
                    StockPrice = gw.Good.StockPrice,
                    MeasuredUnit = gw.Good.MeasuredUnit,
                    InStock = gw.Quantity,
                    Image = gw.Good.Image,
                    CreatedDate = gw.Good.CreatedDate,
                    WarrantyTime = gw.Good.WarrantyTime,
                    Barcode = gw.Good.Barcode,
                    MinStock = gw.Good.MinStock,
                    MaxStock = gw.Good.MaxStock,
                    SupplierId = gw.Good.SupplierId,
                    SupplierName = gw.Good.Supplier.SupplierName,
                    StatusId = gw.Good.StatusId,
                    Status = gw.Good.Status.StatusType
                })
                .ToListAsync();
        }

        public List<GoodAlert> Alert(int warehouseId)
        {
            var products = _context.GoodsWarehouses.Include(g => g.Good).Where(g => g.WarehouseId == warehouseId).ToList();
            var bactchs = _context.ImportOrderDetails.Include(i => i.Import).Where(i => i.Import.StatusId == 4 && i.Import.WarehouseId == warehouseId).ToList();
            var alertGoods = new List<GoodAlert>();
            var managers = _context.UserWarehouses.Include(uw => uw.User).ThenInclude(uw => uw.Role).Where(uw => uw.User.RoleId == 1 || uw.WarehouseId == warehouseId && uw.User.RoleId == 2).ToList();
            var today = DateTime.Now;
            foreach (var product in products)
            {
                if (product.Good.MinStock > product.Quantity)
                {
                    alertGoods.Add(new GoodAlert
                    {
                        GoodName = product.Good.GoodsName,
                        GoodCode = product.Good.GoodsCode,
                        Quantity = product.Quantity,
                        MinStock = product.Good.MinStock,
                        MaxStock = product.Good.MaxStock,
                        AlertType = "Thiếu Hàng",
                        Message = $"Hàng tồn kho của {product.Good.GoodsName} đang ở mức thấp. Số lượng hiện tại: {product.Quantity}. Số lượng tối thiểu yêu cầu: {product.Good.MinStock}.",
                    });
                }
                else if (product.Good.MaxStock < product.Quantity)
                {
                    alertGoods.Add(new GoodAlert
                    {
                        GoodName = product.Good.GoodsName,
                        GoodCode = product.Good.GoodsCode,
                        Quantity = product.Quantity,
                        MinStock = product.Good.MinStock,
                        MaxStock = product.Good.MaxStock,
                        AlertType = "Thừa Hàng",
                        Message = $"Hàng tồn kho của {product.Good.GoodsName} đang ở mức cao. Số lượng hiện tại: {product.Quantity}. Số lượng tối đa cho phép: {product.Good.MaxStock}.",
                    });
                }
            }
            foreach (var batch in bactchs)
            {
                if (batch.ExpiryDate < today.AddDays(30))
                {
                    alertGoods.Add(new GoodAlert
                    {
                        GoodName = batch.Goods.GoodsName,
                        GoodCode = batch.Goods.GoodsCode,
                        Quantity = batch.Quantity,
                        ManufactureDate = batch.ManufactureDate,
                        ExpiryDate = batch.ExpiryDate,
                        AlertType = "Lô hàng sắp hết hạn",
                        Message = $"Lô hàng tồn kho có mã {batch.BatchCode} sắp hết hạn vào ngày {batch.ExpiryDate.ToShortDateString()}.",
                    });
                }
            }
            if (alertGoods.Count > 0)
            {
                string emailBody = "Dưới đây là các cảnh báo về hàng tồn kho:\n\n";
                foreach (var alert in alertGoods)
                {
                    emailBody += $"{alert.AlertType}: {alert.Message}\n";
                }

                foreach (var manager in managers)
                {
                    string email = manager.User.Email?.Trim();

                    // Kiểm tra nếu email hợp lệ
                    if (!string.IsNullOrEmpty(email) && IsValidEmail(email))
                    {
                        string cacheKey = $"LastSent_{email}";

                        if (!_cache.TryGetValue(cacheKey, out bool _))
                        {
                            try
                            {
                                MailMessage mm = new MailMessage("wmsystemsp24@gmail.com", email);
                                mm.Subject = "Cảnh báo hàng tồn kho";
                                mm.Body = emailBody;
                                mm.IsBodyHtml = false;

                                SmtpClient smtp = new SmtpClient();
                                smtp.Host = "smtp.gmail.com";
                                smtp.EnableSsl = true;
                                NetworkCredential NetworkCred = new NetworkCredential();
                                NetworkCred.UserName = "wmsystemsp24@gmail.com";
                                NetworkCred.Password = "jxpd wccm kits gona";
                                smtp.UseDefaultCredentials = false;
                                smtp.Credentials = NetworkCred;
                                smtp.Port = 587;
                                smtp.Send(mm);

                                _cache.Set(cacheKey, true, new MemoryCacheEntryOptions
                                {
                                    AbsoluteExpiration = DateTimeOffset.Now.AddDays(1)
                                });
                            }
                            catch (FormatException ex)
                            {
                                // Log lỗi hoặc xử lý ngoại lệ khi email không hợp lệ
                            }
                        }
                    }
                }
            }
            return alertGoods;
        }



        bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
    public class GoodAlert
    {
        public string GoodCode { get; set; }
        public string GoodName { get; set; }
        public string? BatchCode { get; set; }
        public DateTime? ManufactureDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? MaxStock { get; set; }
        public int? MinStock { get; set; }
        public int? Quantity { get; set; }
        public string AlertType { get; set; }
        public string Message { get; set; }
    }
}
