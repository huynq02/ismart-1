using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class ActionType
    {
        public ActionType()
        {
            GoodsHistories = new HashSet<GoodsHistory>();
        }

        public int ActionId { get; set; }
        public string Action { get; set; }
        public string? Description { get; set; }

        public virtual ICollection<GoodsHistory> GoodsHistories { get; set; }
    }
}
