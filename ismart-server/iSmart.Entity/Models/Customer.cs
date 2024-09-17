using System;
using System.Collections.Generic;
using iSmart.Entity.Models;
using Microsoft.EntityFrameworkCore;

public class Customer
{
    public int CustomerId { get; set; }
    public string CustomerName { get; set; }
    public string CustomerAddress { get; set; }
    public string CustomerPhone { get; set; }
    public string CustomerEmail { get; set; }

    public virtual ICollection<ExportOrder> ExportOrders { get; set; }
}

