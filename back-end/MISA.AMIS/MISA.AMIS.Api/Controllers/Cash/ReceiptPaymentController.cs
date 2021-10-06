using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.AMIS.Core.Constants;
using MISA.AMIS.Core.Entities;
using MISA.AMIS.Core.Entities.Cash;
using MISA.AMIS.Core.Interfaces.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MISA.AMIS.Api.Controllers.Cash
{
    /// <summary>
    /// Lớp controller cung cấp api thao tác với dữ liệu Phiếu thu/chi tiền mặt (ReceiptPayment)
    /// </summary>
    /// CreatedBy: PTHIEU (24/9/2021)
    public class ReceiptPaymentController : BaseEntitiesController<ReceiptPayment>
    {
        #region Fields

        IReceiptPaymentService _receiptPaymentService;

        #endregion

        #region Constructors
        public ReceiptPaymentController(IReceiptPaymentService receiptPaymentService) : base(receiptPaymentService)
        {
            _receiptPaymentService = receiptPaymentService;
        }
        #endregion

        #region Methods

        /// <summary>
        /// API lấy ra mã chứng từ mới
        /// </summary>
        /// <returns>
        /// - 200: lấy thành công, hiển thị mã mới
        /// - 204: không có dữ liệu
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (24/9/2021)
        [HttpGet("NewReceiptPaymentCode")]
        public IActionResult GetNewReceiptPaymentCode()
        {
            try
            {
                var newReceiptPaymentCode = (string)_receiptPaymentService.GetNewReceiptPaymentCode().Data;

                if (string.IsNullOrEmpty(newReceiptPaymentCode))
                {
                    return NoContent();
                }

                return Ok(newReceiptPaymentCode);
            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }

        /// <summary>
        /// API lấy ra danh sách chứng từ theo tiêu chí (lọc)
        /// </summary>
        /// <param name="refFilter">Từ khóa tìm kiếm</param>
        /// <param name="dateFrom">Ngày bắt đầu</param>
        /// <param name="dateTo">Ngày kết thức</param>
        /// <param name="pageIndex">Chỉ số của bản ghi đầu tiên muốn lấy</param>
        /// <param name="pageSize">Kích thước trang, hay số lượng bản ghi/trang</param>
        /// <returns>
        /// - 200: lấy thành công/ có lỗi nghiệp vụ
        /// - 400: lỗi request params
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (24/9/2021)
        [HttpGet("ReceiptPaymentFilter")]
        public IActionResult GetReceiptPaymentByFilter(string refFilter = null, DateTime? dateFrom = null, DateTime? dateTo = null, int pageIndex = 0, int pageSize = 0)
        {   
            try
            {
                if (pageIndex < 0 || pageSize < 0)
                {
                    return BadRequest(new ServiceResult
                    {
                        IsSuccess = false,
                        UserMsg = Core.Properties.Resources.Error,
                        DevMsg = Core.Properties.Resources.ErrorRequest_Param,
                        ErrorCode = MISAErrorCode.ErrorCodeRequestParam,
                    });
                }

                var serviceResult = _receiptPaymentService.GetReceiptPaymentByFilter(
                    refFilter: refFilter,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    pageIndex: pageIndex,
                    pageSize: pageSize);

                return Ok(serviceResult);
            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }

        /// <summary>
        /// API nhân bản thông tin chứng từ
        /// với mã chứng từ được thay bằng mã mới
        /// </summary>
        /// <param name="receiptPaymentId">Khóa chính</param>
        /// <returns>
        /// - 200: lấy thành công
        /// - 204: không có dữ liệu
        /// - 400: lỗi request, receiptPaymentId không đúng kiểu Guid
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (19/8/2021)
        [HttpGet("ReceiptPaymentClone/{receiptPaymentId}")]
        public IActionResult GetCloneReceiptPaymentById(string receiptPaymentId)
        {
            try
            {
                // parse string sang kiểu Guid
                if (Guid.TryParse(receiptPaymentId, out var receiptPaymentIdGuid))
                {
                    var serviceResult = _receiptPaymentService.GetCloneReceiptPaymentById(receiptPaymentIdGuid);
                    var receiptPayment = serviceResult.Data;
                    if (receiptPayment != null)
                    {
                        return Ok(serviceResult);
                    }
                    return NoContent();
                }

                // trả về mã lỗi 400 nếu không parse được receiptPaymentId sang Guid
                return BadRequest(new ServiceResult
                {
                    IsSuccess = false,
                    UserMsg = Core.Properties.Resources.Error,
                    DevMsg = Core.Properties.Resources.ErrorRequest,
                    ErrorCode = MISAErrorCode.ErrorCodeBadRequest
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }
        #endregion
    }
}
