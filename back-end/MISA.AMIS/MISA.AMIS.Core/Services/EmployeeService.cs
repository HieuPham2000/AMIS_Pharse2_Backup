using MISA.AMIS.Core.Constants;
using MISA.AMIS.Core.Entities;
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
    /// Lớp xử lý nghiệp vụ khi thao tác với dữ liệu Nhân viên (Employee)
    /// </summary>
    /// CreatedBy: PTHIEU (17/08/2021) 
    public class EmployeeService : BaseService<Employee>, IEmployeeService
    {
        #region Fields

        IEmployeeRepository _employeeRepository;

        #endregion

        #region Constructors

        public EmployeeService(IEmployeeRepository employeeRepository) : base(employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        #endregion

        #region Methods

        /// <summary>
        /// Service xử lý khi lấy danh sách nhân viên theo các tiêu chí (lọc)
        /// </summary>
        /// <param name="employeeFilter">Thông tin tìm kiếm</param>
        /// <param name="pageIndex">Chỉ số của bản ghi đầu tiên muốn lấy</param>
        /// <param name="pageSize">Kích thước trang, hay số lượng bản ghi/trang</param>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (17/08/2021) 
        public ServiceResult GetEmployeeByFilter(string employeeFilter, int pageIndex, int pageSize)
        {
            if (employeeFilter != null)
            {
                employeeFilter = employeeFilter.Trim();
            }

            ServiceResult.IsSuccess = true;
            ServiceResult.Data = _employeeRepository.GetEmployeeByFilter(
                employeeFilter: employeeFilter,
                pageIndex: pageIndex,
                pageSize: pageSize);

            return ServiceResult;
        }

        /// <summary>
        /// Service xử lý khi lấy mã nhân viên mới
        /// </summary>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (17/08/2021) 
        public ServiceResult GetNewEmployeeCode()
        {
            ServiceResult.IsSuccess = true;
            ServiceResult.Data = _employeeRepository.GetNewEmployeeCode();
            return ServiceResult;
        }


        /// <summary>
        /// Service xử lý khi nhân bản thông tin nhân viên
        /// </summary>
        /// <param name="employeeId">Khóa chính (id)</param>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (19/08/2021)
        public ServiceResult GetCloneEmployeeById(Guid employeeId)
        {
            ServiceResult.IsSuccess = true;
            // Thực hiện lấy dữ liệu 
            ServiceResult.Data = _employeeRepository.GetCloneEmployeeById(employeeId);
            // Trường hợp dữ liệu trống
            if (ServiceResult.Data == null)
            {
                ServiceResult.UserMsg = Properties.Resources.Msg_GetCloneNoData;
            }
            return ServiceResult;
        }
        #endregion

    }
}
