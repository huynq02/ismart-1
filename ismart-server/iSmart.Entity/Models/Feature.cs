using System;
using System.Collections.Generic;

namespace iSmart.Entity.Models
{
    public partial class Feature
    {
        public Feature()
        {
            Roles = new HashSet<Role>();
        }

        public int FeatureId { get; set; }
        public string Featurename { get; set; }
        public string? Url { get; set; }

        public virtual ICollection<Role> Roles { get; set; }
    }
}
