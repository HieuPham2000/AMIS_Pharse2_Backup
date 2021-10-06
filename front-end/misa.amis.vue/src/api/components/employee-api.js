import BaseAPI from "@/api/base/base-api";
import BaseAPIConfig from "@/api/base/base-api-config";

/**
 * Lớp cung cấp các phương thức thao tác dữ liệu Employee (Nhân viên)
 */
class EmployeeAPI extends BaseAPI {

  constructor() {
    super();
    this.controller = "api/v1/Employees";
    this.newEmployeeCodeAPI = "NewEmployeeCode"
    this.employeeFilterAPI = "EmployeeFilter"
    this.employeeCloneAPI = "EmployeeClone"
  }

  /**
   * Phương thức lấy mã nhân viên mới
   * @returns {promise} kết quả thực hiện
   * @author pthieu (28-07-2021)
   */
  getNewEmployeeCode() {
    return BaseAPIConfig.get(`${this.controller}/${this.newEmployeeCodeAPI}`);
  }

  /**
   * Phương thức lấy dữ liệu nhân viên theo các tiêu chí lọc/phân trang
   * @param {Number} pageSize số bản ghi/trang
   * @param {Number} pageIndex offset/index bản ghi đầu tiên của trang 
   * @param {string} employeeFilter xâu tìm kiếm 
   * @returns {promise} kết quả thực hiện
   * @author pthieu (28-07-2021)
   */
  getEmployeesFilterPaging(pageSize, pageIndex, employeeFilter = null) {
    var parameters = {
      pageSize,
      pageIndex,
    }

    if(typeof employeeFilter !== "undefined" && employeeFilter !== null && employeeFilter.trim() !== "") {
      parameters.employeeFilter = employeeFilter.trim();
    }
    return BaseAPIConfig.get(`${this.controller}/${this.employeeFilterAPI}`, {params: parameters});
  }

  /**
   * Phương thức lấy bản sao dữ liệu nhân viên theo khóa chính (nhân bản)
   * Mã nhân viên được thay bằng mã mới
   * @param {String} employeeId Khóa chính
   * @returns {Promise} kết quả thực hiện
   */
   getCloneEmployeeById(employeeId) {
    return BaseAPIConfig.get(`${this.controller}/${this.employeeCloneAPI}/${employeeId}`);
  }
}

export default new EmployeeAPI();