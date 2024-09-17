using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class Category
    {
        public Category()
        {
            Goods = new HashSet<Good>();
        }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string? Description { get; set; }

        public virtual ICollection<Good> Goods { get; set; }
    }
}
