namespace iSmart.Entity.DTOs.ReturnOrderDetailDTO
{
    public class ReturnOrderDetailDTO
    {
        public int ReturnOrderDetailId { get; set; }
        public int ReturnOrderId { get; set; }
        public int GoodsId { get; set; }
        public string GoodsCode { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; }
        public string BatchCode { get; set; }
    }
}
