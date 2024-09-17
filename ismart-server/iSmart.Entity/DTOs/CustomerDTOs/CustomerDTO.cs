using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.CustomerDTOs
{
    public class CustomerDTO
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerEmail { get; set; }
    }

    public class CreateCustomerRequest
    {
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerEmail { get; set; }
    }

    public class CreateCustomerResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

    public class UpdateCustomerRequest
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerEmail { get; set; }
    }

    public class UpdateCustomerResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

    public class CustomerFilterPaging
    {
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public List<CustomerDTO> Data { get; set; }
    }
}
