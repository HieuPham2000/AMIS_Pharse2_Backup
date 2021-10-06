import { resources } from '../../../script/common/resources';
import { PAYMENT_REASON } from '../../../script/common/constant';
export default {
  data() {
    return {
      entityId: "ReceiptPaymentId",
      paymentEmpty: {
        CreatedDate: null, // string (date -> json)
        CreatedBy: null, // string
        ModifiedDate: null, // string (date -> json)
        ModifiedBy: null, // string
        // ReceiptPaymentId: null, // string
        ReceiptPaymentCode: null, // string
        AccountingDate: null,
        RefDate: null,
        TotalAmount: 0,
        Reason: PAYMENT_REASON.OTHER_PAYMENT.REASON,
        OrganizationUnitId: null,
        Receiver: null,
        Address: null,
        Description: PAYMENT_REASON.OTHER_PAYMENT.DESCRIPTION,
        EmployeeId: null,
        RefAttach: null,
        ReceiptPaymentDetail: null,
      },
      tableDetailColumns: [
        {
          header: "Diễn giải",
          fieldName: "Description",
          style: "width: 200px",
          type: "text"
        },
        {
          header: "TK nợ",
          fieldName: "DebitAccount",
          style: "width: 250px",
          title: "Tài khoản nợ",
          type: "cbxTable",
          cbxDataId: "AccountCode",
          cbxDataName: "AccountCode",
          tableColumns: [
            {
              header: "Số tài khoản",
              fieldName: "AccountCode",
              style: "width: 100px",
              filter: true
            },
            {
              header: "Tên tài khoản",
              fieldName: "AccountName",
              style: "width: 200px",
              filter: true
            }
          ],
          required: true
        },
        {
          header: "TK có",
          fieldName: "CreditAccount",
          style: "width: 250px",
          title: "Tài khoản có",
          type: "cbxTable",
          cbxDataId: "AccountCode",
          cbxDataName: "AccountCode",
          tableColumns: [
            {
              header: "Số tài khoản",
              fieldName: "AccountCode",
              style: "width: 100px",
              filter: true
            },
            {
              header: "Tên tài khoản",
              fieldName: "AccountName",
              style: "width: 200px",
              filter: true
            }
          ],
          required: true
        },
        {
          header: "Số tiền",
          fieldName: "Amount",
          style: "width: 250px; text-align: right;",
          type: "decimal",
          filter: "decimal",
          summary: true,
        },
        {
          header: "Đối tượng",
          fieldName: "OrganizationUnitId",
          style: "width: 250px",
          type: "cbxTable",
          cbxDataId: "EmployeeId",
          cbxDataName: "EmployeeCode",
          referenceFieldName: "OrganizationUnitName",
          referenceDataName: "EmployeeName",
          tableColumns: [
            {
              header: "Đối tượng",
              fieldName: "EmployeeCode",
              style: "width: 100px",
              filter: true
            },
            {
              header: "Tên đối tượng",
              fieldName: "EmployeeName",
              style: "width: 150px",
              filter: true
            },
            {
              header: "Địa chỉ",
              fieldName: "Address",
              style: "width: 250px",
            },
            {
              header: "Điện thoại",
              fieldName: "PhoneNumber",
              style: "width: 150px",
              filter: true
            },
          ],
        },
        {
          header: "Tên đối tượng",
          fieldName: "OrganizationUnitName",
          style: "width: 300px",
          type: "text",
          disabled: true,
        }
      ],
      popupType: {
        CLOSE: "CLOSE",
        ERROR: "ERROR"
      },
      popupMsg: null,
      popupCloseMsg: resources.vi.entity.cashVoucher.popUpCloseMsg,
      popupDeleteAllRowsMsg: resources.vi.entity.cashVoucher.popupDeleteAllRows,
      popupErrorMsg: null,
      cbxOrganizationUnitTableColumns: [
        {
          header: "Đối tượng",
          fieldName: "EmployeeCode",
          style: "width: 100px",
          filter: true
        },
        {
          header: "Tên đối tượng",
          fieldName: "EmployeeName",
          style: "width: 200px",
          filter: true
        },
        {
          header: "Địa chỉ",
          fieldName: "Address",
          style: "width: 350px",
        },
        {
          header: "Điện thoại",
          fieldName: "PhoneNumber",
          style: "width: 150px",
          filter: true
        },
      ],
      cbxEmployeeTableColumns: [
        {
          header: "Mã nhân viên",
          fieldName: "EmployeeCode",
          style: "width: 100px",
          filter: true
        },
        {
          header: "Tên nhân viên",
          fieldName: "EmployeeName",
          style: "width: 200px",
          filter: true
        },
        {
          header: "Tên đơn vị",
          fieldName: "DepartmentName",
          style: "width: 200px",
          filter: true
        },
        {
          header: "ĐT di động",
          fieldName: "PhoneNumber",
          style: "width: 150px",
          filter: true
        },
      ],
      paymentDetailEmpty: {
        Description: null,
        DebitAccount: null,
        CreditAccount: null,
        Amount: null,
        OrganizationUnitId: null,
        OrganizationIUnitName: null
      },
      paymentDetailsData: [
        Object.assign({}, this.paymentDetailEmpty)
        // JSON.parse(JSON.stringify(this.paymentDetailEmpty))
      ]
    }
  }
}