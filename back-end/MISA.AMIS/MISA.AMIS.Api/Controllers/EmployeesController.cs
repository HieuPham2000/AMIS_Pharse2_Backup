using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using MySqlConnector;
using System.Data;
using MISA.AMIS.Core.Interfaces.Service;
using MISA.AMIS.Core.Entities;
using MISA.AMIS.Core.Constants;

namespace MISA.AMIS.Api.Controllers
{
    /// <summary>
    /// Lớp controller cung cấp api thao tác với dữ liệu Nhân viên (Employee)
    /// </summary>
    /// CreatedBy: PTHIEU (17/8/2021)
    public class EmployeesController : BaseEntitiesController<Employee>
    {
        #region Fields

        IEmployeeService _employeeService;

        #endregion

        #region Constructors
        public EmployeesController(IEmployeeService employeeService) : base(employeeService)
        {
            _employeeService = employeeService;
        }
        #endregion

        #region Methods

        /// <summary>
        /// API lấy ra mã nhân viên mới
        /// </summary>
        /// <returns>
        /// - 200: lấy thành công, hiển thị mã mới
        /// - 204: không có dữ liệu
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (17/8/2021)
        [HttpGet("NewEmployeeCode")]
        public IActionResult GetNewEmployeeCode()
        {
            try
            {
                var newEmployeeCode = (string)_employeeService.GetNewEmployeeCode().Data;

                if (string.IsNullOrEmpty(newEmployeeCode))
                {
                    return NoContent();
                }

                return Ok(newEmployeeCode);
            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }

        /// <summary>
        /// API lấy bản sao thông tin nhân viên
        /// với mã nhân viên được thay bằng mã mới
        /// </summary>
        /// <param name="employeeId">Khóa chính</param>
        /// <returns>
        /// - 200: lấy thành công
        /// - 204: không có dữ liệu
        /// - 400: lỗi request, employeeId không đúng kiểu Guid
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (19/8/2021)
        [HttpGet("EmployeeClone/{employeeId}")]
        public IActionResult GetCloneEmployeeById(string employeeId)
        {
            try
            {
                // parse string sang kiểu Guid
                if (Guid.TryParse(employeeId, out var employeeIdGuid))
                {
                    var serviceResult = _employeeService.GetCloneEmployeeById(employeeIdGuid);
                    var employee = serviceResult.Data;
                    if (employee != null)
                    {
                        return Ok(serviceResult);
                    }
                    return NoContent();
                }

                // trả về mã lỗi 400 nếu không parse được employeeId sang Guid
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


        /// <summary>
        /// API lấy ra danh sách nhân viên theo tiêu chí (lọc)
        /// </summary>
        /// <param name="employeeFilter">Thông tin tìm kiếm</param>
        /// <param name="pageIndex">Chỉ số của bản ghi đầu tiên muốn lấy</param>
        /// <param name="pageSize">Kích thước trang, hay số lượng bản ghi/trang</param>
        /// <returns>
        /// - 200: lấy thành công/ có lỗi nghiệp vụ
        /// - 400: lỗi request params
        /// - 500: xảy ra exception
        /// </returns>
        /// CreatedBy: PTHIEU (17/8/2021)
        [HttpGet("EmployeeFilter")]
        public IActionResult GetEmployeeByFilter(string employeeFilter = null, int pageIndex = 0, int pageSize = 0)
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

                var serviceResult = _employeeService.GetEmployeeByFilter(
                    employeeFilter: employeeFilter,
                    pageIndex: pageIndex,
                    pageSize: pageSize);

                return Ok(serviceResult);
            }
            catch (Exception e)
            {
                return StatusCode(500, new ServiceResult(e));
            }
        }


        #endregion

    }
}
