<template>
  <button
    type="button"
    :tabindex="tabindex"
    :class="['ms-btn', {'ms-btn-text': type === 'text'}, classAttr]"
    :id="id"
    :disabled="isDisabled"
    @click="clickBtn"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "text",
      required: false
    },
    id: String,
    classAttr: String,
    isDisabled: {
      type: Boolean,
      default: false,
      required: false
    },
    tabindex: {
      type: String,
      default: '0',
      required: false
    }
  },
  methods: {
    clickBtn: function() {
      this.$emit("clickBtn");
      // test
      this.$el.blur();
    }
  }
}
</script>

<style scoped>
@import '../../../css/common/button.css';
</style>