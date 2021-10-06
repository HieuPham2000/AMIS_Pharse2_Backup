<template>
  <div>
    <input
      class="ms-input"
      type="text"
      ref="input"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :tabindex="tabindex"
      spellcheck="false"
      v-tooltip.top="{
        content: errorMsg,
        classes: 'ms-input-tooltip',
      }"
      :disabled="isDisabled"
      @focus="onFocusCbxInput"
      @keydown="pressKeyInInput($event)"
      @input="changeInputValue($event.target.value)"
      @blur="onBlurInput"
    />


  </div>
</template>

<script>
import { CommonFunction } from "../../script/common/common";
import { resources } from "../../script/common/resources";
import { baseInputMixin } from '../../../mixins/input/base-input-mixin';
export default {
  mixins: [baseInputMixin],
  props: {
    // mảng giá trị (text) của các options combobox
    // dùng để đối chiếu/validate
    comboboxInputItems: Array
  },
  methods: {
    /**
     * Phương thức xử lý Sự kiện focus 
     * (với input nằm trong combobox)
     * @author pthieu (22-07-2021)
     */
    onFocusCbxInput: function () {
      this.$emit("focus");
    },
    /**
     * Phương thức xử lý Sự kiện keydown 
     * (với input nằm trong combobox)
     * @param {event} $event sự kiện kích hoạt
     * @author pthieu (22-07-2021)
     */
    pressKeyInInput: function ($event) {
      this.$emit("keydown", $event);
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
      this.$emit("setError", this.isError);
      // có error (isError = true) => validate thất bại (trả về false)
      // không có error (isError = false) => thành công (trả về true)
      return !this.isError;
    }
  }
};
</script>

<style>
@import "../../../css/common/input.css";
</style>