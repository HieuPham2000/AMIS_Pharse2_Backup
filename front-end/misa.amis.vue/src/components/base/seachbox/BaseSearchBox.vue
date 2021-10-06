<template>
    <div class="ms-search">
      <input 
      type="text" 
      class="ms-input" 
      ref="input"
      v-model="searchValue"
      spellcheck="false"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :maxlength="maxlength"
      @input="typingSearchValue"
      @change="changeInputValue(searchValue)"
      @keydown="pressKeyInInput($event)">
      <div class="ms-icon ms-icon-16 ms-icon-search"></div>
    </div>
</template>

<style scoped>
@import url("../../../css/common/input.css");
</style>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "Tìm kiếm theo Mã, Tên hoặc Số điện thoại",
    },
    maxlength: String,
    // giá trị v-model ở phía parent
    value: String,
    // trạng thái disabled (khi trang loading)
    isDisabled: {
      type: Boolean,
      default: false,
      required: false
    },
    duration: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      // giá trị v-model trong component
      searchValue: this.value,
      timeOut: null,
      // function thực hiện việc search khi có sự kiện input
      // trong TH
      doSearchWhenInput: () => {}
    }
  },
  created() {
    if(typeof this.duration !== "undefined" && this.duration !== null) {
      this.doSearchWhenInput = this.debounceSearch;
    }
  },
  watch: {
    /**
     * Theo dõi sự thay đổi của prop value (giá trị v-model phía parent)
     * Và gán lại chô biến data searchValue (giá trị v-model trong component)
     * Mục đích là để 2 biến này luôn map với nhau
     */
    value: function() {
      this.searchValue = this.value;
    }
  },
  methods: {
    /**
     * Phương thức thay đổi value (giá trị v-modelvở phía parent)
     * @param {string} newValue giá trị mới của input
     * @author pthieu (31-07-2021)
     */
    changeInputValue: function (newValue) {
      this.$emit("input", newValue);
    },
    /**
     * Phương thức xử lý Sự kiện keydown
     * @param {event} $event sự kiện kích hoạt
     * @author pthieu (31-07-2021)
     */
    pressKeyInInput: function ($event) {
      if ($event.key == "Enter") {
        this.changeInputValue(this.searchValue);
      }
    },
    /**
     * Phương thức xử lý debounce search
     * @author pthieu (31-07-2021)
     */
    debounceSearch() {
      var vm = this;
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        this.changeInputValue(vm.searchValue)
      }, vm.duration);
    },
    /** 
     * Phương thức xử lý sự kiện oninput
     * @author pthieu (13-09-2021)
     */
    typingSearchValue() {
      if(!this.searchValue) {
        this.changeInputValue(this.searchValue);
        return;
      }
      
      this.doSearchWhenInput();
    },
  }
}
</script>

