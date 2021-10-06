/**
 * fix dữ liệu cho selectbox số bản ghi/trang
 */
export const PAGE_SIZE_SELECT_ITEMS = [
  {id: 10, text: "10 bản ghi trên 1 trang"},
  {id: 20, text: "20 bản ghi trên 1 trang"},
  {id: 30, text: "30 bản ghi trên 1 trang"},
  {id: 50, text: "50 bản ghi trên 1 trang"},
  {id: 100, text: "100 bản ghi trên 1 trang"},
];

/**
 * các kiểu hành động với dữ liệu employee
 */
//  export const EMPLOYEE_ACTION = {
//   ADD: "ADD_EMPLOYEE",
//   EDIT: "EDIT_EMPLOYEE",
//   DELETE: "DELETE_EMPLOYEE",
//   SAVE_AND_ADD: "SAVE_AND_ADD",
// }
 export const DATA_ACTION = {
  ADD: "ADD",
  EDIT: "EDIT",
  DELETE: "DELETE",
  SAVE_AND_ADD: "SAVE_AND_ADD",
}

/**
 * Các dạng validate
 */
export const VALIDATE = {
  REQUIRED: {
    TYPE: "REQUIRED",
  },
  EMAIL: {
    TYPE: "EMAIL",
    PATTERN: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  PHONE_NUMBER: {
    TYPE: "PHONE_NUMBER",
    PATTERN: /^[+\d]?(?:[\d-.\s()]*)$/
  },
  TELEPHONE_NUMBER: {
    TYPE: "TELEPHONE_NUMBER",
    PATTERN: /^[+\d]?(?:[\d-.\s()]*)$/
  },
  COMBO_BOX: {
    TYPE: "COMBO_BOX",
  }
}

// Hằng số về date
export const DATE_CONST = {
  ALL: "Tất cả",
  TODAY: "Hôm nay",
  THIS_WEEK: "Tuần này",
  BEGINNING_WEEK_TO_PRESENT: "Đầu tuần tới hiện tại",
  THIS_MONTH: "Tháng này",
  BEGINNING_MONTH_TO_PRESENT: "Đầu tháng tới hiện tại",
  THIS_QUARTER: "Quý này",
  BEGINNING_QUARTER_TO_PRESENT: "Đầu quý tới hiện tại",
  THIS_YEAR: "Năm nay",
  BEGINNING_YEAR_TO_PRESENT: "Đầu năm tới hiện tại",
  SIX_MONTH_1: "Sáu tháng đầu năm",
  SIX_MONTH_2: "Sáu tháng cuối năm",
  MONTH_1: "Tháng 1",
  MONTH_2: "Tháng 2",
  MONTH_3: "Tháng 3",
  MONTH_4: "Tháng 4",
  MONTH_5: "Tháng 5",
  MONTH_6: "Tháng 6",
  MONTH_7: "Tháng 7",
  MONTH_8: "Tháng 8",
  MONTH_9: "Tháng 9",
  MONTH_10: "Tháng 10",
  MONTH_11: "Tháng 11",
  MONTH_12: "Tháng 12",
  QUARTER_1: "Quý 1",
  QUARTER_2: "Quý 2",
  QUARTER_3: "Quý 3",
  QUARTER_4: "Quý 4",
  YESTERDAY: "Hôm qua",
  LAST_WEEK: "Tuần trước",
  LAST_MONTH: "Tháng trước",
  LAST_QUARTER: "Quý trước",
  LAST_YEAR: "Năm trước",
  TOMORROW: "Ngày mai",
  NEXT_WEEK: "Tuần sau",
  NEXT_MONTH: "Tháng sau",
  NEXT_QUARTER: "Quý sau",
  NEXT_YEAR: "Năm sau",
  OPTION: "Tùy chọn",
};

// dữ liệu filter date cho cbx
export const DATE_FILTER_DATA = Object.keys(DATE_CONST).map((k) => {
 return {id: DATE_CONST[k], text: DATE_CONST[k]};
});

// dữ liệu filter Lý do thu/chi tiền mặt (cash)  cho cbx
export const CASH_REASON_FILTER_DATA = [
  {id: null, text: "Tất cả"}
];

// dữ liệu filter Trạng thái ghi sổ (cash) cho cbx
export const CASH_STATUS_FILTER_DATA = [
  {id: null, text: "Tất cả"}
];
// dữ liệu lý do chi tiền mặt
export const PAYMENT_REASON = {
  OTHER_PAYMENT: {
    REASON: "Chi khác",
    DESCRIPTION: "Chi tiền cho "
  }
}
// Dữ liệu tài khoản nợ
export const DEBIT_ACCOUNT_CBX = [
  {AccountCode: "3334", AccountName: "Thuế thu nhập doanh nghiệp"},
  {AccountCode: "3382", AccountName: "Kinh phí công đoàn"},
  {AccountCode: "3383", AccountName: "Bảo hiểm xã hội"},
  {AccountCode: "3384", AccountName: "Bảo hiểm y tế"},
  {AccountCode: "3386", AccountName: "Bảo hiểm thất nghiệp"},
  {AccountCode: "6411", AccountName: "Chi phí Marketing"},
  {AccountCode: "6416", AccountName: "Chi phí cơm trưa"},
  {AccountCode: "6417", AccountName: "Chi phí lương nhân viên"},
];
// Dữ liệu tài khoản có
export const CREDIT_ACCOUNT_CBX = [
  {AccountCode: "1111HAD", AccountName: "Tiền mặt doanh thu - Hà Đông"},
  {AccountCode: "1111CAG", AccountName: "Tiền mặt doanh thu - Cầu Giấy"},
  {AccountCode: "1111HBT", AccountName: "Tiền mặt doanh thu - Hai Bà Trưng"},
  {AccountCode: "1112", AccountName: "Ngoại tệ"},
  {AccountCode: "1113", AccountName: "Vàng tiền tệ"},
]
