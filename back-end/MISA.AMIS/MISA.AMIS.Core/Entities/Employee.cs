using MISA.AMIS.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Core.Entities
{
    /// <summary>
    /// Thông tin nhân viên
    /// </summary>
    /// CreatedBy: PTHIEU (17/08/2021)
    public class Employee : BaseEntity
    {
        #region Properties

        /// <summary>
        /// Khóa chính
        /// </summary>
        public Guid EmployeeId { get; set; }

        /// <summary>
        /// Mã nhân viên
        /// </summary>
        [MISARequired]
        [MISAUnique]
        [MISAMaxLength(20)]
        [MISADisplayName("Mã nhân viên")]
        public string EmployeeCode { get; set; }

        /// <summary>
        /// Họ và tên
        /// </summary>
        [MISARequired]
        [MISADisplayName("Tên nhân viên")]
        public string EmployeeName { get; set; }

        /// <summary>
        /// Ngày sinh
        /// </summary>
        public DateTime? DateOfBirth { get; set; }

        /// <summary>
        /// Giới tính (đại diện bằng số nguyên)
        /// </summary>
        public Gender? Gender { get; set; }

        /// <summary>
        /// Giới tính
        /// </summary>
        public string GenderName
        {
            get
            {
                switch (this.Gender)
                {
                    case Enums.Gender.Male:
                        return Properties.Resources.Enum_Gender_Male;
                    case Enums.Gender.Female:
                        return Properties.Resources.Enum_Gender_Female;
                    case Enums.Gender.Other:
                        return Properties.Resources.Enum_Gender_Other;
                    default:
                        return null;
                }
            }

            set { }
        }

        /// <summary>
        /// Khóa/id đơn vị/phòng ban
        /// </summary>
        [MISARequired]
        [MISADisplayName("Đơn vị")]
        public Guid DepartmentId { get; set; }

        /// <summary>
        /// Tên đơn vị/phòng ban
        /// </summary>
        public string DepartmentName { get; set; }

        /// <summary>
        /// Số CMND/Căn cước công dân
        /// </summary>
        [MISADisplayName("Số CMTND/Căn cước")]
        public string IdentityNumber { get; set; }

        /// <summary>
        /// Thời điểm cấp CMND/CCCD
        /// </summary>
        public DateTime? IdentityDate { get; set; }

        /// <summary>
        /// Nơi cấp CMND/CCCD
        /// </summary>
        public string IdentityPlace { get; set; }

        /// <summary>
        /// Chức vụ/chức danh
        /// </summary>
        public string EmployeePosition { get; set; }

        /// <summary>
        /// Địa chỉ nơi ở
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Số tài khoản ngân hàng
        /// </summary>
        public string BankAccountNumber { get; set; }
        
        /// <summary>
        /// Tên ngân hàng
        /// </summary>
        public string BankName { get; set; }

        /// <summary>
        /// Tên chi nhánh ngân hàng
        /// </summary>
        public string BankBranchName { get; set; }

        /// <summary>
        /// Tên tỉnh địa chỉ ngân hàng 
        /// </summary>
        public string BankProvinceName { get; set; }


        /// <summary>
        /// Số điện thoại di động
        /// </summary>
        [MISAPhoneNumber]
        [MISADisplayName("ĐT di động")]
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Số điện thoại cố định
        /// </summary>
        [MISAPhoneNumber]
        [MISADisplayName("ĐT cố định")]
        public string TelephoneNumber { get; set; }

        /// <summary>
        /// Địa chỉ email
        /// </summary>
        [MISAEmail]
        [MISADisplayName("Email")]
        public string Email { get; set; }

        #endregion
    }
}
