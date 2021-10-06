import BaseAPI from "@/api/base/base-api";
import BaseAPIConfig from "@/api/base/base-api-config";

/**
 * Lớp cung cấp các phương thức thao tác dữ liệu ReceiptPayment 
 * (phiếu thu/chi tiền mặt)
 */
class ReceiptPaymentAPI extends BaseAPI {

  constructor() {
    super();
    this.controller = "api/v1/ReceiptPayment";
    this.newCodeAPI = "NewReceiptPaymentCode"
    this.filterAPI = "ReceiptPaymentFilter";
    this.cloneAPI = "ReceiptPaymentClone";
  }

  /**
   * Phương thức lấy mã chứng từ mới
   * @returns {promise} kết quả thực hiện
   * @author pthieu (24-09-2021)
   */
  getNewReceiptPaymentCode() {
    return BaseAPIConfig.get(`${this.controller}/${this.newCodeAPI}`);
  }

  /**
   * Phương thức lấy dữ liệu phiếu thu/chi tiền mặt theo các tiêu chí lọc/phân trang
   * @param {Number} pageSize số bản ghi/trang
   * @param {Number} pageIndex offset/index bản ghi đầu tiên của trang 
   * @param {string} refFilter từ khóa tìm kiếm 
   * @param {*} dateFrom ngày bắt đầu
   * @param {*} dateTo ngày kết thúc
   * @returns {promise} kết quả thực hiện
   * @author pthieu (24-09-2021)
   */
  getReceiptPaymentFilterPaging(pageSize, pageIndex, dateFrom, dateTo, refFilter = null) {
    var parameters = {
      pageSize,
      pageIndex,
      dateFrom,
      dateTo
    }

    if(typeof refFilter !== "undefined" && refFilter !== null) {
      parameters.refFilter = refFilter.trim();
    }
    return BaseAPIConfig.get(`${this.controller}/${this.filterAPI}`, {params: parameters});
  }

  /**
   * Phương thức lấy bản sao dữ liệu theo khóa chính (nhân bản)
   * Mã được thay bằng mã mới
   * @param {String} recordId Khóa chính
   * @returns {Promise} kết quả thực hiện
   * @author pthieu (24-09-2021)
   */
   getCloneReceiptPaymentById(recordId) {
    return BaseAPIConfig.get(`${this.controller}/${this.cloneAPI}/${recordId}`);
  }

}

export default new ReceiptPaymentAPI();