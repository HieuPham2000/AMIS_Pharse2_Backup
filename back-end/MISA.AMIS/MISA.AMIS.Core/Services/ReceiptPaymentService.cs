using MISA.AMIS.Core.Constants;
using MISA.AMIS.Core.Entities;
using MISA.AMIS.Core.Entities.Cash;
using MISA.AMIS.Core.Interfaces.Infrastructure;
using MISA.AMIS.Core.Interfaces.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Core.Services
{
    /// <summary>
    /// Lớp xử lý nghiệp vụ khi thao tác với dữ liệu ReceiptPayment
    /// </summary>
    /// CreatedBy: PTHIEU (24/09/2021)
    public class ReceiptPaymentService : BaseService<ReceiptPayment>, IReceiptPaymentService
    {
        #region Fields

        IReceiptPaymentRepository _receiptPaymentRepository;

        #endregion

        #region Constructors

        public ReceiptPaymentService(IReceiptPaymentRepository receiptPaymentRepository) : base(receiptPaymentRepository)
        {
            _receiptPaymentRepository = receiptPaymentRepository;
        }

        #endregion

        #region Methods
        /// <summary>
        /// Service xử lý lấy mã chứng từ mới
        /// </summary>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        public ServiceResult GetNewReceiptPaymentCode()
        {
            ServiceResult.IsSuccess = true;
            ServiceResult.Data = _receiptPaymentRepository.GetNewReceiptPaymentCode();
            return ServiceResult;
        }

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
        public ServiceResult GetReceiptPaymentByFilter(string refFilter, DateTime? dateFrom, DateTime? dateTo, int pageIndex, int pageSize)
        {
            if (refFilter != null)
            {
                refFilter = refFilter.Trim();
            }

            ServiceResult.IsSuccess = true;
            ServiceResult.Data = _receiptPaymentRepository.GetReceiptPaymentByFilter(
                refFilter: refFilter,
                dateFrom: dateFrom,
                dateTo: dateTo,
                pageIndex: pageIndex,
                pageSize: pageSize);

            return ServiceResult;
        }

        /// <summary>
        /// Service xử lý khi nhân bản thông tin chứng từ
        /// </summary>
        /// <param name="receiptPaymentId">Khóa chính (id)</param>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        public ServiceResult GetCloneReceiptPaymentById(Guid receiptPaymentId)
        {
            ServiceResult.IsSuccess = true;
            // Thực hiện lấy dữ liệu 
            ServiceResult.Data = _receiptPaymentRepository.GetCloneReceiptPaymentById(receiptPaymentId);
            // Trường hợp dữ liệu trống
            if (ServiceResult.Data == null)
            {
                ServiceResult.UserMsg = Properties.Resources.Msg_GetCloneNoData;
            }
            return ServiceResult;
        }

        /// <summary>
        /// Hàm validate nghiệp vụ riêng
        /// </summary>
        /// <param name="receiptPayment">Đối tượng cần validae</param>
        /// <returns>true - validate thành công, false - validate thất bại</returns>
        /// CreatedBy: PTHIEU (30/09/2021) 
        protected override bool ValidateCustom(ReceiptPayment receiptPayment)
        {
            // validate ngày hạch toán không nhỏ hơn ngày chứng từ
            // Kiểm tra bắt buộc nhập ngày hạch toán, ngày chứng từ
            // Có thể bỏ qua, vì đã check bằng attribute trước đó
            
            if(receiptPayment.AccountingDate.HasValue && receiptPayment.RefDate.HasValue)
            {
                var accountingDate = (DateTime)receiptPayment.AccountingDate;
                var refDate = (DateTime)receiptPayment.RefDate;
                if (DateTime.Compare(accountingDate, refDate) < 0)
                {
                    ServiceResult.IsSuccess = false;
                    ServiceResult.UserMsg = string.Format(Properties.Resources.ErrorValidateCustom_Cash_AccountingDate, refDate.ToString("dd/MM/yyyy"));
                    ServiceResult.ErrorCode = MISAErrorCode.ErrorCodeValidateCustom;
                    ServiceResult.Data = "AccountingDate";
                    return false;
                }
            }
            return true;
        }
        #endregion
    }
}
