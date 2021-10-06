using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMIS.Core.Constants
{
    /// <summary>
    /// Chứa các mã lỗi
    /// </summary>
    /// CreatedBy: PTHIEU (17/08/2021)
    public static class MISAErrorCode
    {
        /// <summary>
        /// Mã lỗi khi xảy ra exception
        /// </summary>
        public const string ErrorCodeException = "MISA_001";

        /// <summary>
        /// Mã lỗi khi validate trường bắt buộc thất bại
        /// </summary>
        public const string ErrorCodeValidateRequired = "MISA_002";

        /// <summary>
        /// Mã lỗi khi validate trường duy nhất thất bại
        /// </summary>
        public const string ErrorCodeValidateUnique = "MISA_003";

        /// <summary>
        /// Mã lỗi khi validate định dạng thất bại
        /// </summary>
        public const string ErrorCodeValidateFormat = "MISA_004";

        /// <summary>
        /// Mã lỗi khi validate độ dài tối đa thất bại
        /// </summary>
        public const string ErrorCodeValidateMaxLength = "MISA_005";

        /// <summary>
        /// Mã lỗi khi request không hợp lệ
        /// </summary>
        public const string ErrorCodeBadRequest = "MISA_006";

        /// <summary>
        /// Mã lỗi khi param gửi theo request không hợp lệ
        /// </summary>
        public const string ErrorCodeRequestParam = "MISA_007";

        /// <summary>
        /// Mã lỗi khi validate nghiệp vụ riêng thất bại
        /// </summary>
        public const string ErrorCodeValidateCustom = "MISA_008";
    }
}
