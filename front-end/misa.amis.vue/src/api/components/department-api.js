import BaseAPI from "@/api/base/base-api";

/**
 * Lớp cung cấp các phương thức thao tác dữ liệu Department (Phòng ban)
 */
class DepartmentAPI extends BaseAPI {

  constructor() {
    super();
    this.controller = "api/v1/Departments";
  }

}

export default new DepartmentAPI();