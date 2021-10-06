using MISA.AMIS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Core.Interfaces.Service
{
    /// <summary>
    /// Interface quy định service xử lý nghiệp vụ lấy dữ liệu Employee
    /// </summary>
    /// CreatedBy: PTHIEU (17/08/2021)
    public interface IEmployeeService: IBaseService<Employee>
    {
        /// <summary>
        /// Service xử lý khi lấy danh sách nhân viên theo các tiêu chí (lọc)
        /// </summary>
        /// <param name="employeeFilter">Thông tin tìm kiếm</param>
        /// <param name="pageIndex">Chỉ số của bản ghi đầu tiên muốn lấy</param>
        /// <param name="pageSize">Kích thước trang, hay số lượng bản ghi/trang</param>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (17/08/2021)
        ServiceResult GetEmployeeByFilter(string employeeFilter, int pageIndex, int pageSize);

        /// <summary>
        /// Service xử lý khi lấy mã nhân viên mới
        /// </summary>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (17/08/2021)
        ServiceResult GetNewEmployeeCode();

        /// <summary>
        /// Service xử lý khi nhân bản thông tin nhân viên
        /// </summary>
        /// <param name="employeeId">Khóa chính (id)</param>
        /// <returns>Đối tượng ServiceResult chứa kết quả thực hiện</returns>
        /// CreatedBy: PTHIEU (19/08/2021)
        ServiceResult GetCloneEmployeeById(Guid employeeId);
    }
}
