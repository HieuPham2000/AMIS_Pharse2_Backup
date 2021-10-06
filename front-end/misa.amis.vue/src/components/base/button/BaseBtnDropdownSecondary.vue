<template>
  <div class="ms-btn-dropdown-container"  v-click-outside="onClickOutside">
    <button
      type="button"
      :tabindex="tabindex"
      :class="[
        'ms-btn',
        'ms-btn-dropdown',
        'ms-btn-dropdown-secondary',
        classAttr,
      ]"
      :id="id"
      :disabled="isDisabled"
      @keydown.tab="closeDropdown"
      @click="toggleDropdown"
    >
      <div class="text">
        <slot name="btn-name"></slot>
      </div>
      <div class="ms-icon ms-icon-16 ms-icon-arrow-dropdown"></div>
    </button>
    <div class="dropdown" v-show="isOpen">
      <slot name="dropdown-content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    classAttr: String,
    isDisabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    tabindex: {
      type: String,
      default: "0",
      required: false,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    /**
     * Phương thức xử lý việc click btn
     * @author pthieu (24-09-2021)
     */
    clickBtn: function () {
      this.$emit("clickBtn");
      this.$el.blur();
    },
    /**
     * Phương thức xử lý việc mở dropdown
     * @author pthieu (24-09-2021)
     */
    openDropdown: function () {
      this.isOpen = true;
    },
    /**
     * Phương thức xử lý việc đóng dropdown
     * @author pthieu (24-09-2021)
     */
    closeDropdown: function () {
      this.isOpen = false;
    },
    /**
     * Phương thức xử lý việc click ra ngoài
     * @author pthieu (24-09-2021)
     */
    onClickOutside: function ($event) {
      // TODO
      if($event.target && !$event.target.closest(".mx-datepicker-main, .mx-btn, .mx-table .cell")) {
        this.closeDropdown();
      }
    },
    /**
     * Phương thức xử lý toggle dropdown
     * @author pthieu (24-09-2021)
     */
    toggleDropdown: function () {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped>
@import "../../../css/common/button.css";
</style>