using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs;

using iSmart.Entity.Models;

namespace iSmart.Service
{
    public interface IStatusService
    {
        List<Status> GetAllStatus();
    }
    public class StatusService : IStatusService
    {
        private readonly iSmartContext _context;

        public StatusService(iSmartContext context)
        {
            _context = context;
        }
        public List<Status> GetAllStatus()
        {
            try
            {
                var status = _context.Statuses.ToList();
                return status;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
