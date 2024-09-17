using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class Role
    {
        public Role()
        {
            Users = new HashSet<User>();
            Features = new HashSet<Feature>();
        }

        public int RoleId { get; set; }
        public string RoleName { get; set; }

        public virtual ICollection<User> Users { get; set; }

        public virtual ICollection<Feature> Features { get; set; }
    }
}
