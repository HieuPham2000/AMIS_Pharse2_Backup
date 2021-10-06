﻿SELECT e.EmployeeId,
       e.EmployeeCode,
       e.EmployeeName,
       e.DateOfBirth,
       e.Gender,
       e.DepartmentId,
       d.DepartmentName,
       e.IdentityNumber,
       e.IdentityDate,
       e.IdentityPlace,
       e.EmployeePosition,
       e.Address,
       e.BankAccountNumber,
       e.BankName,
       e.BankBranchName,
       e.BankProvinceName,
       e.PhoneNumber,
       e.TelephoneNumber,
       e.Email,
       e.CreatedBy,
       e.CreatedDate,
       e.ModifiedBy,
       e.ModifiedDate  
  FROM Employee e LEFT JOIN Department d ON e.DepartmentId = d.DepartmentId