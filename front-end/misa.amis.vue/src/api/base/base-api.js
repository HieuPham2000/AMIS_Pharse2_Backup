import BaseAPIConfig from "@/api/base/base-api-config";

/**
 * Lớp cung cấp các phương thức thao tác dữ liệu
 */
export default class BaseAPI {

  constructor() {
    this.controller = null;
  }

  /**
   * Phương thức lấy tất cả dữ liệu
   * @returns {promise} kết quả thực hiện
   */
  getAllEntities() {
    return BaseAPIConfig.get(`${this.controller}`);
  }

  /**
   * Phương thức lấy dữ liệu theo khóa chính
   * @param {String} id Khóa chính
   * @returns {Promise} kết quả thực hiện
   */
  getEntityById(id) {
    return BaseAPIConfig.get(`${this.controller}/${id}`);
  }

  /**
   * Phương thức thêm mới dữ liệu
   * @param {*} data Dữ liệu thêm mới
   * @returns {Promise} kết quả thực hiện
   */
  postEntity(data) {
    return BaseAPIConfig.post(`${this.controller}`, data);
  }


  /**
   * Phương thức cập nhật dữ liệu
   * @param {String} id Khóa chính (id)
   * @param {*} data Dữ liệu cập nhật
   * @returns {promise} kết quả thực hiện
   */
  putEntity(id, data) {
    return BaseAPIConfig.put(`${this.controller}/${id}`, data);
  }

  /**
   * Phương thức xóa dữ liệu theo khóa chính
   * @param {String} id Khóa chính
   * @returns {Promise} kết quả thực hiện
   */
  deleteEntity(id) {
    return BaseAPIConfig.delete(`${this.controller}/${id}`);
  }

  /**
  * Phương thức xóa nhiều bản ghi
  * @param {Array} entityIds danh sách khóa chính
  * @returns {Promise} kết quả thực hiện
  */
  deleteManyEntities(entityIds) {
    return BaseAPIConfig.delete(`${this.controller}`, { data: entityIds });
  }

}