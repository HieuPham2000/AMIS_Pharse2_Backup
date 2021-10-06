import { VALIDATE } from "../../script/common/constant";
import { CommonFunction } from "../../script/common/common";
import { resources } from "../../script/common/resources";

export const baseInputMixin = {
  props: {
    placeholder: String,
    maxlength: {
      type: String,
      default: '255',
      required: false
    },
    tabindex: {
      type: String,
      default: '0',
      required: false
    },
    isRequired: {
      type: Boolean,
      default: false,
      required: false
    },
    format: String,
    // giá trị v-model (phía parent)
    value: null,
    autofocus: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
      required: false
    },
    displayName: {
      type: String,
      default: "Thông tin",
      required: false
    },
    showError: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      errorMsg: null,
      isError: false,
    };
  },
  mounted() {
    // nếu input được chỉ định autofocus:
    if (this.autofocus) {
      // this.focusAndSelectInput();
      this.focusInput();
    }

    var input = this.$refs.input;
    input.addEventListener("mouseover", function() {
      if (input.offsetWidth < input.scrollWidth) {
        input.setAttribute("title", input.value);
      } else {
        input.removeAttribute("title");
      }
    })
  },
  watch: {
    /**
     * Theo dõi sự thay đổi của prop value
     * Và thực hiện validate
     */
    value: function () {
      this.validateInput();
    },
  },
  methods: {
    /**
     * Phương thức Xử lý sự kiện blur input
     * @param {event} $event sự kiện
     * @author pthieu (28-07-2021)
     */
    onBlurInput: function($event) {
      // kiểm tra nếu phần tử vừa focus đến (relatedTarget)
      // nếu không thuộc component này => thực hiện validate
      // vd: với btn clear text, vẫn thuộc component => không thực hiện validate
      if(!this.$el.contains($event.relatedTarget)) {
        this.validateInput();
      }
    },
    /**
     * Phương thức Thay đổi input value (giá trị v-model phía parent)
     * @param {string} newValue giá trị mới của input
     * @author pthieu (22-07-2021)
     */
    changeInputValue: function (newValue) {
      this.$emit("input", newValue);
    },

    /**
     * Phương thức Kiểm tra trường bắt buộc
     * @returns {Boolean} true - thỏa mãn | false - không thỏa mãn
     * @author pthieu (22-07-2021)
     */
    validateRequired: function () {

      // nếu đây không phải trường bắt buộc
      // thì không cần kiểm tra
      if (!this.isRequired) {
        return true;
      }
      
      // kiểm tra giá trị
      if (
        this.value === undefined ||
        this.value === null ||
        this.value.toString().trim() === ""
      ) {
        this.errorMsg = CommonFunction.formatString(resources.vi.errorValidate.required, this.displayName);
        return false;
      }
      return true;
    },
    /**
     * Phương thức Kiểm tra dữ liệu nhập vào có đúng định dạng không
     * @returns {Boolean} true - đúng định dạng | false - sai
     * @author pthieu (22-07-2021)
     */
    validateFormat: function () {
      var format = this.format;
      // kiểm tra xem input này có yêu cầu định dạng không
      // và giá trị phải khác null, undefined, ""
      // nếu không thỏa mãn => true (không cần kiểm tra)
      if (
        !format ||
        this.value == "" ||
        this.value === undefined ||
        this.value === null
      ) {
        return true;
      }

      // sử dụng regex để kiểm tra input có khớp định dạng hay không
      if (!VALIDATE[format].PATTERN.test(String(this.value).toLowerCase())) {
        this.errorMsg = CommonFunction.formatString(resources.vi.errorValidate.format, this.displayName);
        return false;
      }
      return true;
    },
    /**
     * Phương thức Validate dữ liệu khi on input/blur 
     * @returns {Boolean} true - validate thành công | false - thất bại
     * @author pthieu (22-07-2021)
     */
    validateInput: function () {
      // lần lượt validate trường bắt buộc, định dạng, combobox
      if (
        this.validateRequired() &&
        this.validateFormat()
      ) {
        this.removeInputError();
      } else {
        this.addInputError();
      }
      // có error (isError = true) => validate thất bại (trả về false)
      // không có error (isError = false) => thành công (trả về true)
      return !this.isError;
    },
    /**
     * Phương thức hiển thị thông báo lỗi
     * @author pthieu (22-07-2021)
     */
    showErrorNotice() {
      this.showError(this.errorMsg);
    },
    /**
     * Phương thức Xử lý khi input validate false
     * @author pthieu (22-07-2021)
     */
    addInputError: function () {
      // bật cờ trạng thái Lỗi
      this.isError = true;
    },
    /**
     * Phương thức Xử lý khi input validate true
     * @author pthieu (22-07-2021)
     */
    removeInputError: function () {
      // tắt cờ trạng thái Lỗi
      this.isError = false;
      this.errorMsg = null;
    },
    
    /**
     * Phương thức thực hiện focus vào ô input
     * @author pthieu (23-07-2021)
     */
    focusInput: function() {
      // this.$refs.input.focus();
      this.$refs.input.select();
    }
  },
};
