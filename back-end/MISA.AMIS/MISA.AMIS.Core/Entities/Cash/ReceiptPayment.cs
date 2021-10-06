using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Core.Entities.Cash
{
    /// <summary>
    /// Thông tin phiếu thu/chi tiền mặt
    /// </summary>
    /// CreatedBy: PTHIEU (24/09/2021)
    public class ReceiptPayment : BaseEntity
    {
        #region Properties
        /// <summary>
        /// Khóa chính/id phiếu thu/chi tiền mặt
        /// </summary>
        public Guid ReceiptPaymentId { get; set; }

        /// <summary>
        /// Mã số chứng từ (phiếu thu/chi)
        /// </summary>
        [MISARequired]
        [MISAUnique]
        [MISADisplayName("Số chứng từ")]
        public string ReceiptPaymentCode { get; set; }

        /// <summary>
        /// Ngày hạch toán
        /// </summary>
        [MISARequired]
        [MISADisplayName("Ngày hạch toán")]
        public DateTime? AccountingDate { get; set; }

        /// <summary>
        /// Ngày phiếu thu/chi
        /// </summary>
        [MISARequired]
        [MISADisplayName("Ngày chứng từ")]
        public DateTime? RefDate { get; set; }

        /// <summary>
        /// Tổng tiền
        /// </summary>
        public decimal? TotalAmount { get; set; }

        /// <summary>
        /// Lý do thu/chi, mặc định là Chi khác
        /// </summary>
        public string Reason { get; set; }

        /// <summary>
        /// Khóa/id đối tượng
        /// </summary>
        [MISARequired]
        [MISADisplayName("Đối tượng")]
        public Guid? OrganizationUnitId { get; set; }

        /// <summary>
        /// Tên đối tượng
        /// </summary>
        public string OrganizationUnitName { get; set; }

        /// <summary>
        /// Tên người nhân
        /// </summary>
        public string Receiver { get; set; }

        /// <summary>
        /// Địa chỉ
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Diễn giải lý do nộp/chi
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Khóa/id nhân viên
        /// </summary>
        public Guid? EmployeeId { get; set; }

        /// <summary>
        /// Tên nhân viên
        /// </summary>
        public string EmployeeName { get; set; }

        /// <summary>
        /// Kèm theo (số lượng chứng từ gốc)
        /// </summary>
        public int? RefAttach { get; set; }

        /// <summary>
        /// Chi tiết phần thu/chi tiền (bảng detail)
        /// Dữ liệu đã được chuyển dạng JSON
        /// </summary>
        public string ReceiptPaymentDetail { get; set; }

        #endregion
    }
}
