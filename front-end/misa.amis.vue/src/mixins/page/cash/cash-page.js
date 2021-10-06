import { CASH_REASON_FILTER_DATA, CASH_STATUS_FILTER_DATA, DATE_FILTER_DATA } from "../../../script/common/constant";
export default {
  data() {
    return {
      entityId: "ReceiptPaymentId",
      dateFilterCbxData: DATE_FILTER_DATA,
      reasonFilterCbxData: CASH_REASON_FILTER_DATA,
      statusFilterCbxData: CASH_STATUS_FILTER_DATA,
      tableColumns: [
        {
          header: "Ngày hạch toán",
          fieldName: "AccountingDate",
          style: "width: 120px; text-align: center;",
          filter: "date"
        },
        {
          header: "Số chứng từ",
          fieldName: "ReceiptPaymentCode",
          style: "width: 120px",
        },
        {
          header: "Diễn giải",
          fieldName: "Description",
          style: "width: 300px",
        },
        {
          header: "Số tiền",
          fieldName: "TotalAmount",
          style: "width: 120px; text-align: right",
          filter: "decimal",
          summary: true
        },
        {
          header: "Đối tượng",
          fieldName: "OrganizationUnitName",
          style: "width: 200px",
        },
        {
          header: "Lý do thu/chi",
          fieldName: "Reason",
          style: "width: 100px",
        }
      ],
    }
  }
}