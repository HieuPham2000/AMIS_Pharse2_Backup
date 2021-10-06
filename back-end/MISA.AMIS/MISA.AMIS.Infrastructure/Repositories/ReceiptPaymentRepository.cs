using Dapper;
using Microsoft.Extensions.Configuration;
using MISA.AMIS.Core.Entities.Cash;
using MISA.AMIS.Core.Interfaces.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Infrastructure.Repositories
{
    public class ReceiptPaymentRepository : BaseRepository<ReceiptPayment>, IReceiptPaymentRepository
    {
        #region Constructors
        public ReceiptPaymentRepository(IConfiguration configuration) : base(configuration)
        {

        }
        #endregion

        #region Methods
        /// <summary>
        /// Hàm lấy mã chứng từ mới
        /// </summary>
        /// <returns>Mã chứng từ mới</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        public string GetNewReceiptPaymentCode()
        {
            return DbConnection.QueryFirstOrDefault<string>(
                sql: "Proc_GetNewReceiptPaymentCode",
                commandType: CommandType.StoredProcedure);
        }

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
        public CashVoucherFilterResult GetReceiptPaymentByFilter(string refFilter, DateTime? dateFrom, DateTime? dateTo, int pageIndex, int pageSize)
        {
            // Thiết lập các tham số
            var parameters = new DynamicParameters();
            // Thiết lập các tham số đầu vào
            parameters.Add("RefFilter", refFilter);
            parameters.Add("DateFrom", dateFrom);
            parameters.Add("DateTo", dateTo);
            parameters.Add("PageIndex", pageIndex);
            parameters.Add("PageSize", pageSize);

            // Kết quả đầu ra
            parameters.Add("TotalRecord", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("TotalPage", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("TotalAmount", dbType: DbType.Decimal, direction: ParameterDirection.Output);

            // Lưu kết quả danh sách bản ghi 
            var result = DbConnection.Query<ReceiptPayment>(
                sql: "Proc_GetReceiptPaymentFilterPaging",
                param: parameters,
                commandType: CommandType.StoredProcedure);

            // Trả về kết quả filter
            return new CashVoucherFilterResult
            {
                TotalPages = parameters.Get<int?>("TotalPage"),
                TotalRecords = parameters.Get<int?>("TotalRecord"),
                TotalAmount = parameters.Get<decimal?>("TotalAmount"),
                Data = result
            };
        }

        /// <summary>
        /// Hàm nhân bản thông tin chứng từ
        /// Lấy thông tin chứng từ theo id
        /// Và thay mã chứng từ bằng mã mới
        /// </summary>
        /// <param name="receiptPaymentId">Khóa chính (id)</param>
        /// <returns>Dữ liệu chứng từ</returns>
        /// CreatedBy: PTHIEU (24/09/2021)
        public ReceiptPayment GetCloneReceiptPaymentById(Guid receiptPaymentId)
        {
            // Lấy thông tin nhân bản
            var receiptPayment = GetById(receiptPaymentId);
            // Lấy mã chứng từ mới
            receiptPayment.ReceiptPaymentCode = GetNewReceiptPaymentCode();
            // Set id khác (không thực sự cần thiết)
            // Đề phòng lỗi xử lý bên front-end
            // receiptPayment.ReceiptPaymentId = Guid.Empty;
            receiptPayment.ReceiptPaymentId = Guid.NewGuid();
            return receiptPayment;
        }
        #endregion
    }
}
