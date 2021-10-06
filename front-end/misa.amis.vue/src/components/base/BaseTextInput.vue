<template>
  <div class="input-wrapper" 
  v-tooltip.top="{
        content: errorMsg,
        classes: 'ms-input-tooltip',
      }">
    <div class="error-icon" v-if="isError && showErrorIcon">
      <div class="ms-icon ms-icon-16 ms-icon-error-input"></div>
    </div>
    <!-- input -->
    <!-- input type text -->
    <input
      class="ms-input"
      v-if="type === 'text'"
      type="text"
      ref="input"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :tabindex="tabindex"
      spellcheck="false"
      :class="{
        'ms-input-validate-error': isError && !isComboboxInput,
      }"
      :disabled="isDisabled"
      @mouseover="onMouseOver"
      @focus="onFocusCbxInput"
      @keydown="pressKeyInInput($event)"
      @input="changeInputValue($event.target.value)"
      @blur="onBlurInput"
    />
    <!-- input type number -->
    <input
      class="ms-input"
      v-else-if="type === 'number'"
      type="text"
      ref="input"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :tabindex="tabindex"
      :class="{ 'ms-input-validate-error': isError }"
      :disabled="isDisabled"
      @mouseover="onMouseOver"
      @paste.prevent
      @keydown="isNumber($event)"
      @input="changeInputValue($event.target.value)"
      @blur="validateInput"
    />
  </div>
</template>

<script>
import { VALIDATE } from "../../script/common/constant";
import { CommonFunction } from "../../script/common/common";
import { resources } from "../../script/common/resources";
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    placeholder: String,
    maxlength: {
      type: String,
      default: '255'
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
    isComboboxInput: Boolean,
    // mảng giá trị (text) của các options combobox
    // dùng để đối chiếu/validate
    comboboxInputItems: Array,
    // kiểu định dạng (vd email, phone number)
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
    },
    showErrorIcon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      /**
       * thông báo lỗi
       */
      errorMsg: null,

      /**
       * cờ xác định trạng thái có lỗi/không có lỗi của input:
       * true - có lỗi, false - không có lỗi
       */
      isError: false,
    };
  },
  mounted() {
    // nếu input được chỉ định autofocus:
    if (this.autofocus) {
      // this.focusAndSelectInput();
      this.focusInput();
    }

    // var input = this.$refs.input;
    // input.addEventListener("mouseover", function() {
    //   if (input.offsetWidth < input.scrollWidth) {
    //     input.setAttribute("title", input.value);
    //   } else {
    //     input.removeAttribute("title");
    //   }
    // })
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
    onMouseOver: function() {
      var input = this.$refs.input;
      if (input.offsetWidth < input.scrollWidth && !this.isError) {
        input.setAttribute("title", input.value);
      } else {
        input.removeAttribute("title");
      }
    },
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
     * Phương thức chuẩn hóa giá trị tiền (bỏ tất cả display format)
     * @param {*} value giá trị tiền có dấu phân tách
     * @returns giá trị tiền đã chuẩn hóa
     * @author pthieu (22-07-2021)
     */
    normalizeMoney: function(value) {
      return CommonFunction.normalizeMoney(value);
    },
    /**
     * Phương thức xử lý Sự kiện focus 
     * (với input nằm trong combobox)
     * @author pthieu (22-07-2021)
     */
    onFocusCbxInput: function () {
      this.focusInput();
      if (this.isComboboxInput) {
        this.$emit("focus");
      }
    },
    /**
     * Phương thức xử lý Sự kiện keydown 
     * (với input nằm trong combobox)
     * @param {event} $event sự kiện kích hoạt
     * @author pthieu (22-07-2021)
     */
    pressKeyInInput: function ($event) {
      if (this.isComboboxInput) {
        this.$emit("keydown", $event);
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
     * Phương thức Kiểm tra input có khớp với option trong combobox không
     * @returns {Boolean} true - khớp | false - không
     * @author pthieu (22-07-2021)
     */
    validateComboboxInput: function () {
      // kiểm tra xem đây có phải input nằm trong combobox không
      // và giá trị phải khác null, undefined, ""
      // nếu không thỏa mãn => true (không cần kiểm tra)
      if (
        !this.isComboboxInput ||
        this.value == "" ||
        this.value === undefined ||
        this.value === null
      ) {
        return true;
      }
      var index = this.comboboxInputItems.findIndex((item) => item == this.value);
      if (index == -1) {
        this.errorMsg = CommonFunction.formatString(resources.vi.errorValidate.combobox, this.displayName);
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
        this.validateFormat() &&
        this.validateComboboxInput()
      ) {
        this.removeInputError();
      } else {
        this.addInputError();
      }
      // nếu input này thuộc combobox
      // thì emit để set error cho combobox
      if (this.isComboboxInput) {
        this.$emit("setError", this.isError);
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
     * Phương thức Kiểm tra phím vừa ấn có phải phím số hay không
     * @param {event} $event sự kiện kích hoạt
     * @returns {Boolean} true - là số | false - không phải số
     * @author pthieu (22-07-2021)
     */
    isNumber($event) {
      var charCode = $event.which ? $event.which : $event.keyCode;
      // kiểm tra charCode xem có phải phím số hay không
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        $event.preventDefault();
        return false;
      }
      return true;
    },
    
    /**
     * Phương thức thực hiện focus vào ô input
     * @author pthieu (23-07-2021)
     */
    focusInput: function() {
      // this.$refs.input.focus();
      this.$refs.input.select();
    },

    /**
     * Phương thức thực hiện focus vào ô input 
     * và select toàn bộ dữ liệu bên trong
     * @author pthieu (23-07-2021)
     */
    // focusAndSelectInput: function() {
    //   this.$refs.input.focus();
    //   this.$refs.input.select();
    // }
  },
};
</script>

<style>
@import "../../css/common/input.css";
</style>