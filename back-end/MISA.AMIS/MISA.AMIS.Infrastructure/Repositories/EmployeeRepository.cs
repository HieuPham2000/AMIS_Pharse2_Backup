using Dapper;
using Microsoft.Extensions.Configuration;
using MISA.AMIS.Core.Entities;
using MISA.AMIS.Core.Interfaces.Infrastructure;
using MISA.AMIS.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Infrastructure.Repositories
{
    /// <summary>
    /// Lớp thao tác với CSDL: truy vấn, thêm, sửa, xóa... với dữ liệu Nhân viên (Employee)
    /// </summary>
    /// CreatedBy: PTHIEU (17/08/2021)
    public class EmployeeRepository : BaseRepository<Employee>, IEmployeeRepository
    {
        #region Constructors
        public EmployeeRepository(IConfiguration configuration) : base(configuration)
        {

        }
        #endregion

        #region Methods

        /// <summary>
        /// Hàm lấy danh sách nhân viên theo các tiêu chí (lọc)
        /// </summary>
        /// <param name="employeeFilter">Thông tin tìm kiếm</param>
        /// <param name="pageIndex">Chỉ số của bản ghi đầu tiên muốn lấy</param>
        /// <param name="pageSize">Kích thước trang, hay số lượng bản ghi/trang</param>
        /// <returns>Đối tượng FilterResult chứa kết quả lọc</returns>
        /// CreatedBy: PTHIEU (17/08/2021)
        public FilterResult<Employee> GetEmployeeByFilter(string employeeFilter, int pageIndex, int pageSize) 
        {
            // Thiết lập các tham số
            var parameters = new DynamicParameters();
            // Thiết lập các tham số đầu vào
            parameters.Add("EmployeeFilter", employeeFilter);
            parameters.Add("PageIndex", pageIndex);
            parameters.Add("PageSize", pageSize);

            // Kết quả đầu ra
            parameters.Add("TotalRecord", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("TotalPage", dbType: DbType.Int32, direction: ParameterDirection.Output);

            // Lưu kết quả danh sách bản ghi 
            var result = DbConnection.Query<Employee>(
                sql: "Proc_GetEmployeesFilterPaging",
                param: parameters,
                commandType: CommandType.StoredProcedure);

            // Trả về kết quả filter
            return new FilterResult<Employee> {
                TotalPages = parameters.Get<int?>("TotalPage"),
                TotalRecords = parameters.Get<int?>("TotalRecord"),
                Data = result
            };
        }

        /// <summary>
        /// Hàm lấy mã nhân viên mới
        /// </summary>
        /// <returns>Mã nhân viên mới</returns>
        /// CreatedBy: PTHIEU (17/08/2021)
        public string GetNewEmployeeCode()
        {
            return DbConnection.QueryFirstOrDefault<string>(
                sql: "Proc_GetNewEmployeeCode",
                commandType: CommandType.StoredProcedure);
        }

        /// <summary>
        /// Hàm nhân bản thông tin nhân viên
        /// Lấy thông tin nhân viên theo id
        /// Và thay mã nhân viên bằng mã mới
        /// </summary>
        /// <param name="employeeId">Khóa chính (id)</param>
        /// <returns>Dữ liệu nhân viên</returns>
        /// CreatedBy: PTHIEU (19/08/2021)
        public Employee GetCloneEmployeeById(Guid employeeId)
        {
            // Cách 1: Sử dụng Proc_GetCloneEmployeeById
            // Thiết lập tham số
            //var parameters = new DynamicParameters();
            //parameters.Add("EmployeeId", employeeId);

            // Thực hiện truy vấn dữ liệu với Dapper
            //return DbConnection.QueryFirstOrDefault<Employee>(
            //    sql: $"Proc_GetCloneEmployeeById",
            //    param: parameters,
            //    commandType: CommandType.StoredProcedure);

            // Cách 2: Tận dụng method GetById và method GetNewEmployeeCode
            // Lấy thông tin nhân bản
            var employee = GetById(employeeId);
            // Lấy mã nhân viên mới
            employee.EmployeeCode = GetNewEmployeeCode();
            // Set id khác (không thực sự cần thiết)
            // Đề phòng lỗi xử lý bên front-end
            //employee.EmployeeId = Guid.Empty;
            employee.EmployeeId = Guid.NewGuid();
            return employee;
        }
        #endregion


    }
}
