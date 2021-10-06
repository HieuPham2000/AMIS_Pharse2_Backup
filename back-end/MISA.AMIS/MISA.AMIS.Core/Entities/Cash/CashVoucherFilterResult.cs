using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Core.Entities.Cash
{
    /// <summary>
    /// Kết quả lọc/phân trang dữ liệu chứng từ tiền mặt
    /// </summary>
    /// CreatedBy: PTHIEU (24/09/2021)
    public class CashVoucherFilterResult : FilterResult<ReceiptPayment>
    {
        /// <summary>
        /// Tổng số tiền
        /// </summary>
        public decimal? TotalAmount { get; set; }
    }
}
