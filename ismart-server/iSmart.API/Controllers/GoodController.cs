using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using iSmart.Entity.DTOs.GoodsDTO;
using iSmart.Service;
using iSmart.Entity.Models;

namespace iSmart.API.Controllers
{
    [Route("api/goods")]
    [ApiController]
    //[Authorize]
    public class GoodController : ControllerBase
    {
        private readonly IGoodsService _goodsService;

        public GoodController(IGoodsService goodsService)
        {
            _goodsService = goodsService;
        }

        // GET: GoodsController
        [AllowAnonymous]
        [HttpGet("get-all-goods")]
        public async Task <IActionResult> GetAllGoods()
        {
            var result = await _goodsService.GetAllGoods();
          
            return Ok(result);
        }

        [HttpPost("add-goods")]
        public async Task<IActionResult> AddGoods(CreateGoodsRequest goods, int userId)
        {
            var result = _goodsService.AddGoods(goods, userId);
            return Ok(result);
        }

        [HttpPost("add-goods-by-admin")]
        public async Task<IActionResult> AddGoodsByAdmin(CreateGoodsRequest goods, int warehouseId)
        {
            var result = _goodsService.AddGoodsByAdmin(goods, warehouseId);
            return Ok(result);
        }

        [HttpGet("get-goods")]
        public IActionResult GetGoodsByKeyword(int pageSize, int page, int? warehouseId, int? categoryId, int? supplierId, int? sortPrice, string? keyword = "")
        {
            var result = _goodsService.GetGoodsByKeyword(pageSize, page, warehouseId, categoryId, supplierId, sortPrice, keyword);
            return Ok(result);
        }

        [HttpGet("get-good-by-id")]
        public IActionResult GetGoodById(int id)
        {
            var result = _goodsService.GetGoodsById(id);
            return Ok(result);
        }

        [HttpGet("get-good-in-warehouse-by-id")]
        public IActionResult GetGoodsInWarehouse(int warehouseId, int goodId)
        {
            var result = _goodsService.GetGoodsInWarehouseById(warehouseId, goodId);
            return Ok(result);
        }

        [HttpGet("get-goods-with-warehouse-supplier")]
        public async Task<IActionResult> GetAllGoodsWithStorageAndSupplier(int warehouseId, int supplierId)
        {
            var result = await _goodsService.GetAllGoodsWithStorageAndSupplier(warehouseId, supplierId);

            return Ok(result);
        }
        [HttpGet("get-goods-of-supplier")]
        public async Task<IActionResult> GetAllGoodsOfSupplier(int supplierId)
        {
            var result = await _goodsService.GetAllGoodsOfSupplier(supplierId);

            return Ok(result);
        }

        [HttpPut("update-goods")]
        public async Task<IActionResult> UpdateGoods(UpdateGoodsRequest goods)
        {
            var result = _goodsService.UpdateGoods(goods);
            return Ok(result);
        }

        [HttpPut("update-goods-status")]
        public async Task<IActionResult> UpdateStatus(int id, int status)
        {
            var user = _goodsService.UpdateStatusGoods(id, status);
            return Ok(user);
        }

        [HttpGet("get-goods-in-warehouse")]
        public async Task<IActionResult> GetGoodsInWarehouse(int warehouseId)
        {
            var result = await _goodsService.GetGoodsInWarehouse(warehouseId);
            return Ok(result);
        }

        [HttpGet("get-goods-in-warehouse-by-supplier")]
        public async Task<IActionResult> GetGoodsInWarehouseBySupplier(int warehouseId, int supplierId)
        {
            var result = await _goodsService.GetGoodsInWarehouseBySupplier(warehouseId, supplierId);
            return Ok(result);
        }

        [HttpGet("alerts")]
        public IActionResult GetAlerts(int warehouseId)
        {
            var alerts = _goodsService.Alert(warehouseId);
            return Ok(alerts);
        }
    }
}
