using MISA.AMIS.Core.Entities.Cash;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Core.Interfaces.Infrastructure
{
    /// <summary>
    /// Interface quy định việc lấy dữ liệu liên quan đến ReceiptPayment
    /// (Phiếu thu/chi tiền mặt)
    /// </summary>
    /// CreatedBy: PTHIEU (24/09/2021)
    public interface IReceiptPaymentRepository : IBaseRepository<ReceiptPayment>
    {
        /// <summary>
        /// Hàm lấy danh sách chứng từ theo tiêu chí lọc, phân trang
        /// </summary>
        /// <param name="refFilter">Từ khóa tìm kiếm</param>
        /// <param name="dateFrom">Ngày bắt đầu</param>
        /// <param name="dateTo">Ngày kết thức</param>
        /// <param name="pageIndex">Chỉ số của bản ghi đầu tiên muốn lấy</param>
        /// <param name="pageSize">Kích thước trang, hay số lượng bản ghi/trang</param>
        /// <returns>Đối tượng CashVoucherFilterResult chứa kết quả lọc</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        CashVoucherFilterResult GetReceiptPaymentByFilter(string refFilter, DateTime? dateFrom, DateTime? dateTo, int pageIndex, int pageSize);

        /// <summary>
        /// Hàm lấy mã chứng từ mới
        /// </summary>
        /// <returns>Mã chứng từ mới</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        public string GetNewReceiptPaymentCode();

        /// <summary>
        /// Hàm nhân bản thông tin chứng từ
        /// Lấy thông tin chứng từ theo id
        /// Và thay mã chứng từ bằng mã mới
        /// </summary>
        /// <param name="receiptPaymentId">Khóa chính (id)</param>
        /// <returns>Dữ liệu chứng từ</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        public ReceiptPayment GetCloneReceiptPaymentById(Guid receiptPaymentId);
    }
}
