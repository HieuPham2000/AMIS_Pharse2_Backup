export const resources = {
  vi: {
    errorValidate: {
      required: "{0} không được để trống.",
      format: "{0} không đúng định dạng.",
      combobox: "Dữ liệu {0} không có trong danh mục."
    },
    toastMsg: {
      getNoData: "Dữ liệu không còn tồn tại trong hệ thống.",
      deleteNoSelectedRecord: "Vui lòng chọn bản ghi cần xóa.",
      deleteNoData: "Dữ liệu không còn tồn tại trong hệ thống.",
      insertNoData: "Thêm mới không thành công.",
      updateNoData: "Chỉnh sửa không thành công.",
      errorGeneral: "Có lỗi xảy ra, vui lòng liên hệ MISA để được trợ giúp.",
      errorNetworkError: "Vui lòng kiểm tra lại kết nối hoặc liên hệ MISA để được trợ giúp."
    },
    entity: {
      employee: {
        popUpDeleteMsg: `Bạn có thực sự muốn xóa Nhân viên "{0} - {1}" không?`,
        popUpDeleteManyMsg: `Bạn có thực sự muốn xóa {0} nhân viên không?`,
        popUpCloseMsg: `Dữ liệu đã bị thay đổi. Bạn có muốn cất không?`
      },
      cashVoucher: {
        popUpDeleteMsg: `Bạn có thực sự muốn xóa Chứng từ "{0}" không?`,
        popUpDeleteManyMsg: `Bạn có thực sự muốn xóa {0} chứng từ không?`,
        popUpCloseMsg: `Dữ liệu đã bị thay đổi. Bạn có muốn cất không?`,
        popupDeleteAllRows: `Bạn có thực sự muốn xóa tất cả các dòng đã nhập không?`,
        errorValidateCustomAccountingDate: `Ngày hạch toán phải lớn hơn hoặc bằng Ngày chứng từ <{0}>.`
      }
    }
  }
};
