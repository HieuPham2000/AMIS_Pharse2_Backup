<template>
  <div class="ms-checkbox-container">
    <label class="ms-checkbox" :class="{ 'active': isChecked }">
      <input
        type="checkbox"
        class="ms-checkbox-input"
        :id="inputId"
        :value="checkboxValue"
        :tabindex="tabindex"
        v-model="modelValue"
        ref="CheckboxInput"
        @change="toggleChecked"
      />
      <div class="ms-checkbox-icon ms-icon ms-icon-16 ms-icon-checked"></div>
    </label>
    <label v-if="checkboxLabel" :for="inputId" class="ms-checkbox-label">
      {{ checkboxLabel }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    checkboxValue: null,
    checkboxId: null,
    checkboxLabel: null,
    tabindex: {
      type: String,
      required: false,
      default: '0'
    }
  },
  data() {
    return {
      isChecked: false,
    };
  },
  computed: {
    modelValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    inputId() {
      return this.checkboxId || this.checkboxValue || this.checkboxLabel;
    },
  },
  updated() {
    this.isChecked = this.$refs.CheckboxInput.checked;
  },
  methods: {
    toggleChecked() {
      this.isChecked = ! this.isChecked;
    }
  }
};
</script>

<style scoped>
@import "../../../css/common/icon.css";
@import "../../../css/common/input.css";
</style>