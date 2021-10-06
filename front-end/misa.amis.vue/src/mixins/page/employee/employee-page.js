export default {
  data() {
    return {
      // liên quan đến grid table
      // tên trường khóa chính
      entityId: "EmployeeId",
      // chứa dữ liệu về các cột trong grid table 
      // (tiêu đề cột, độ rộng, style khác)
      // dùng trong component EmployeePage
      tableColumns: [
        {
          header: "Mã nhân viên",
          fieldName: "EmployeeCode",
          style: "width: 150px",
        },
        {
          header: "Tên nhân viên",
          fieldName: "EmployeeName",
          style: "width: 250px",
        },
        {
          header: "Giới tính",
          fieldName: "GenderName",
          style: "width: 120px",
        },
        {
          header: "Ngày sinh",
          fieldName: "DateOfBirth",
          filter: "date",
          style: "width: 150px; text-align: center",
        },
        {
          header: "Số CMND",
          fieldName: "IdentityNumber",
          style: "width: 200px",
        },
        {
          header: "Chức danh",
          fieldName: "EmployeePosition",
          style: "width: 200px",
        },
        {
          header: "Tên đơn vị",
          fieldName: "DepartmentName",
          style: "width: 200px",
        },
        {
          header: "Điện thoại",
          fieldName: "PhoneNumber",
          style: "width: 200px",
        },
        {
          header: "Số tài khoản",
          fieldName: "BankAccountNumber",
          style: "width: 150px",
        },
        {
          header: "Tên ngân hàng",
          fieldName: "BankName",
          style: "width: 200px",
        },
        {
          header: "Chi nhánh TK ngân hàng",
          fieldName: "BankBranchName",
          style: "width: 250px",
        }
      ],
    }
  }
}