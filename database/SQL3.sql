SET @TotalPage = 0;
SET @TotalRecord = 0;
SET @TotalAmount = 0;
CALL Proc_GetReceiptPaymentFilterPaging(NULL, "2021-01-01", "2021-09-29", 0, 20, @TotalRecord, @TotalPage, @TotalAmount);
SELECT * FROM receiptpayment r WHERE r.ReceiptPaymentCode = "PC000022883737373773" OR r.ReceiptPaymentCode = "PC000000002147483648"
AND r.AccountingDate BETWEEN "2021-01-01" AND "2021-11-29";