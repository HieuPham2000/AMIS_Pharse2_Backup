<template>
  <div :class="['toast', type]">
      <!-- icon -->
      <div class="toast-icon">
        <div v-if="type == 'error'" class="ms-icon ms-icon-32 ms-icon-error-circle-32"></div>
        <div v-else-if="type == 'success'" class="ms-icon ms-icon-32 ms-icon-success-circle-32"></div>
      </div>
      <!-- nội dung -->
      <div class="toast-content">{{ message }}</div>
  </div>
</template>

<style>
  @import '../../../css/common/icon.css';
  @import '../../../css/common/toast.css';
</style>

<script>
export default {
  props: {
    message: String,
    type: {
      type: String,
      validator: function(value) {
        return ['success', 'error', 'warning', 'info'].indexOf(value) !== -1;
      }
    }
  },
}
</script>