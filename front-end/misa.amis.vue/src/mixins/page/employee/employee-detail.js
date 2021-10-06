import { resources } from '../../../script/common/resources';
export default {
  data() {
    return {
      // chứa tất cả các trường thông tin về nhân viên
      // dùng trong component EmployeeDetail
      employeeEmpty: {
        CreatedDate: null, // string (date -> json)
        CreatedBy: null, // string
        ModifiedDate: null, // string (date -> json)
        ModifiedBy: null, // string
        // EmployeeId: null, // string
        EmployeeCode: null, // string
        EmployeeName: null, // string
        DepartmentId: null, // string
        EmployeePosition: null, // string
        DateOfBirth: null, // string (date -> json)
        Gender: 0, // number
        IdentityNumber: null, // string
        IdentityDate: null, // string (date -> json)
        IdentityPlace: null,
        Address: null, // string
        PhoneNumber: null, // string
        TelephoneNumber: null, // string
        Email: null, // string
        BankAccountNumber: null, // string
        BankName: null, // string
        BankBranchName: null,
        BankProvinceName: null,
      },
      popupType: {
        CLOSE: "CLOSE",
        ERROR: "ERROR"
      },
      popupMsg: null,
      popupCloseMsg: resources.vi.entity.employee.popUpCloseMsg,
      popupErrorMsg: null,

    };
  }
}