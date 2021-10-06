<template>
  <div>
    <!-- input -->
    <!-- input type text -->
    <input
      class="ms-input"
      type="text"
      ref="input"
      spellcheck="false"
      v-tooltip.top="{
        content: errorMsg,
        classes: 'ms-input-tooltip',
      }"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :tabindex="tabindex"
      :class="{
        'ms-input-validate-error': isError
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
import { baseInputMixin } from '../../../mixins/input/base-input-mixin';
export default {
  mixins: [baseInputMixin]
};
</script>

<style>
@import "../../../css/common/input.css";
</style>