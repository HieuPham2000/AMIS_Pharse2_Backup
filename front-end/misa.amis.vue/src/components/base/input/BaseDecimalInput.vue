<template>
  <div>
    <input
      class="ms-input ms-input-decimal"
      type="text"
      ref="input"
      v-model="decimalValue"
      v-mask="decimalMask"
      v-tooltip.top="{
        content: errorMsg,
        classes: 'ms-input-tooltip',
      }"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :tabindex="tabindex"
      :class="{ 'ms-input-validate-error': isError }"
      :disabled="isDisabled"
      @focus="focusInput"
      @input="changeInputValue($event.target.value)"
      @blur="validateInput"
    />

  </div>
</template>

<script>
import { CommonFunction } from '../../../script/common/common';
import { DECIMAL_MASK } from '../../../script/common/config';
import { baseInputMixin } from '../../../mixins/input/base-input-mixin';
export default {
  mixins: [baseInputMixin],
  data() {
    return {
      // mask input
      decimalMask: DECIMAL_MASK,
      // giá trị v-model bind cho input
      decimalValue: this.value,
    };
  },
  watch: {
    /**
     * Theo dõi value để cập nhật decimalValue
     */
    value() {
      this.decimalValue = this.value;
    }
  },
  methods: {
    /**
     * Phương thức xử lý sự kiện oninput
     * @param {*} newValue giá trị mới
     * @author pthieu (24-09-2021)
     */
    changeInputValue(newValue) {
      // loại bỏ mask trước khi emit 
      this.$emit("input", CommonFunction.getNumberFromFormatStr(newValue));
    }
  }
};
</script>

<style>
@import "../../../css/common/input.css";
</style>