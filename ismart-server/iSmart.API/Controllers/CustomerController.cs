using iSmart.Entity.DTOs.CustomerDTOs;
using iSmart.Entity.DTOs.ExportOrderDTO;
using iSmart.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iSmart.API.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpPost]
        public ActionResult<CreateCustomerResponse> AddCustomer([FromBody] CreateCustomerRequest request)
        {
            var response = _customerService.AddCustomer(request);
            if (response.IsSuccess)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpGet]
        public async Task<ActionResult<List<CustomerDTO>>> GetAllCustomers()
        {
            var customers = await _customerService.GetAllCustomers();
            if (customers == null || customers.Count == 0)
            {
                return NoContent();
            }
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public ActionResult<CustomerDTO> GetCustomerById(int id)
        {
            var customer = _customerService.GetCustomerById(id);
            if (customer == null)
            {
                return NotFound();
            }

            var customerDTO = new CustomerDTO
            {
                CustomerId = customer.CustomerId,
                CustomerName = customer.CustomerName,
                CustomerEmail = customer.CustomerEmail,
                CustomerPhone = customer.CustomerPhone,
                CustomerAddress = customer.CustomerAddress
            };

            return Ok(customerDTO);
        }

        [HttpGet("search")]
        public ActionResult<CustomerFilterPaging> GetCustomerByKeyword(int page, string? keyword)
        {
            var result = _customerService.GetCustomerByKeyword(page, keyword);
            if (result == null || result.Data.Count == 0)
            {
                return NoContent();
            }
            return Ok(result);
        }


        [HttpPut]
        public ActionResult<UpdateCustomerResponse> UpdateCustomer([FromBody] UpdateCustomerRequest request)
        {
            var response = _customerService.UpdateCustomer(request);
            if (response.IsSuccess)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }


        [HttpGet("get-customer-transaction")]
        public ActionResult<List<ExportOrderDTO>>  GetAllHistoryCustomerOrder(int customerId)
        {
            var result = _customerService.GetAllHistoryCustomerOrder(customerId);
            if (result == null || result.Count == 0)
            {
                return NoContent();
            }
            return Ok(result);
        }
    }
}
