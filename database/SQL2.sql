SELECT r.ReceiptPaymentId,
       r.ReceiptPaymentCode,
       r.AccountingDate,
       r.RefDate,
       r.TotalAmount,
       r.Reason,
       r.OrganizationUnitId,
       o.EmployeeName AS OrganizationUnitName,
       r.Receiver,
       r.Description,
       r.EmployeeId,
       e.EmployeeName AS EmployeeName,
       r.RefAttach,
       r.ReceiptPaymentDetail,
       r.CreatedDate,
       r.CreatedBy,
       r.ModifiedDate,
       r.ModifiedBy 
  FROM receiptpayment r
  LEFT JOIN  employee o ON r.OrganizationUnitId = o.EmployeeId
  LEFT JOIN employee e ON r.EmployeeId = e.EmployeeId;