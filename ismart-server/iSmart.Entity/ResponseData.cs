using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.Models;
namespace iSmart.Entity
{
    public class ResponseData<T>
    {
        public List<T> Data { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
