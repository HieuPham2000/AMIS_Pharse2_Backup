using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Core.Entities
{

    /// <summary>
    /// Thông tin đơn vị/phòng ban
    /// </summary>
    /// CreadtedBy: PTHIEU (17/08/2021)
    public class Department : BaseEntity
    {
        #region Properties
        /// <summary>
        /// Khóa chính
        /// </summary>
        public Guid DepartmentId { get; set; }

        /// <summary>
        /// Tên đơn vị/phòng ban
        /// </summary>
        [MISARequired]
        [MISADisplayName("Tên phòng ban")]
        public string DepartmentName { get; set; }

        /// <summary>
        /// Mô tả đơn vị/phòng ban
        /// </summary>
        public string Description { get; set; }
        #endregion
    }
}
