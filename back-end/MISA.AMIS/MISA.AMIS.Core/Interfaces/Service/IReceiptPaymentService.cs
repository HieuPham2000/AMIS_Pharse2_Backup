using MISA.AMIS.Core.Entities;
using MISA.AMIS.Core.Entities.Cash;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Core.Interfaces.Service
{
    /// <summary>
    /// Interface quy định service thao tác lấy dữ liệu ReceiptPayment
    /// </summary>
    /// CreatedBy: PTHIEU (24/09/2021)
    public interface IReceiptPaymentService : IBaseService<ReceiptPayment>
    {
        /// <summary>
        /// Service xử lý lấy danh sách chứng từ theo tiêu chí lọc, phân trang
        /// </summary>
        /// <param name="refFilter">Từ khóa tìm kiếm</param>
        /// <param name="dateFrom">Ngày bắt đầu</param>
        /// <param name="dateTo">Ngày kết thức</param>
        /// <param name="pageIndex">Chỉ số của bản ghi đầu tiên muốn lấy</param>
        /// <param name="pageSize">Kích thước trang, hay số lượng bản ghi/trang</param>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        ServiceResult GetReceiptPaymentByFilter(string refFilter, DateTime? dateFrom, DateTime? dateTo, int pageIndex, int pageSize);

        /// <summary>
        /// Service xử lý lấy mã chứng từ mới
        /// </summary>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        ServiceResult GetNewReceiptPaymentCode();

        /// <summary>
        /// Service xử lý khi nhân bản thông tin chứng từ
        /// </summary>
        /// <param name="receiptPaymentId">Khóa chính (id)</param>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        ServiceResult GetCloneReceiptPaymentById(Guid receiptPaymentId);
    }
}
