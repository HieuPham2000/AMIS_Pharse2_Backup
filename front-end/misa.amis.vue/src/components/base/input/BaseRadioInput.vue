<template>
  <div class="ms-radio-container" tabindex="-1">
    <label class="ms-radio" :class="{ active: isChecked }">
      <input
        type="radio"
        class="ms-radio-input"
        :tabindex="tabindex"
        :id="inputLabel"
        :value="inputValue"
        :name="name"
        :disabled="isDisabled"
        v-model="checked"
      />
      <div class="ms-radio-icon"></div>
    </label>
    <label :for="inputLabel" class="ms-radio-label" @click="onClickLabel">{{ inputLabel }}</label>
  </div>
  
</template>

<script>
export default {
  props: {
    name: String,
    inputLabel: String,
    inputValue: null,
    value: null,
    tabindex: {
      type: String,
      required: false,
      default: '0'
    },
    isDisabled: {
      type: Boolean,
      default: false,
      required: false
    },
  },
  computed: {
    checked: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    isChecked() {
      return this.value == this.inputValue;
    }
  },
  methods: {
    /**
     * Phương thức xử lý khi click vào label
     * @author pthieu (19-08-2021)
     */
    onClickLabel() {
      this.$emit('input', this.inputValue);
    }
  },
};
</script>

<style scoped>
@import "../../../css/common/icon.css";
@import "../../../css/common/input.css";
</style>