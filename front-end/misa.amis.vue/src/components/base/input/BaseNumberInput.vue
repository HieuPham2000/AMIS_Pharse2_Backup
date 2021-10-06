<template>
  <div>
    <input
      class="ms-input"
      type="text"
      ref="input"
      v-tooltip.top="{
        content: errorMsg,
        classes: 'ms-input-tooltip',
      }"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :tabindex="tabindex"
      :class="{ 'ms-input-validate-error': isError }"
      :disabled="isDisabled"
      @paste.prevent
      @keydown="isNumber($event)"
      @input="changeInputValue($event.target.value)"
      @blur="validateInput"
    />
  </div>
</template>

<script>
import { baseInputMixin } from '../../../mixins/input/base-input-mixin';
export default {
  mixins: [baseInputMixin],
  methods: {
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
    }
  }
};
</script>

<style>
@import "../../../css/common/input.css";
</style>