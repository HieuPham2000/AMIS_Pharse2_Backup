<template>
  <DatePicker
    v-model="dateValue"
    type="date"
    input-class="ms-input"
    tabindex="-1"
    :value-type="valueType"
    :format="displayFormat"
    :placeholder="displayFormat"
    :title-format="displayFormat"
    :disabled-date="isFutureDate"
    :lang="lang"
    :clearable="false"
    :disabled="isDisabled"
    :input-attr="{'tabindex': tabindex}"
  >
    <!-- Thêm nút "Hôm nay" trong datepicker -->
    <template v-slot:header="{ emit }">
      <button class="mx-btn mx-btn-text" @click="emit(new Date())">
        Hôm nay
      </button>
    </template>

  </DatePicker>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/vi";
import { DATE_DISPLAY_TOKEN } from "../../../script/common/config"

export default {
  components: {
    DatePicker,
  },
  props: {
    value: String, // giá trị value v-model
    displayFormat: { // định dạng hiển thị
      type: String,
      default: DATE_DISPLAY_TOKEN.toUpperCase(),
    },
    valueType: { // định dạng giá trị thực sự (input - output)
      type: String,
      default: "YYYY-MM-DD",
    },
    // trạng thái disabled, khi trang đang loading/processing
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    tabindex: {
      type: String,
      required: false,
      default: '0'
    },
  },
  data() {
    return {
      // lưu giá trị của datepicker (nội bộ trong component này)
      // map với prop value
      dateValue: this.value, 
      lang: {
        // thiết lập hiển thị tháng trước năm trong datepicker
        monthBeforeYear: true, 
      },
    };
  },

  created() {
    this.dateValue = this.value;
  },
  // mounted() {
  //   var vm = this;
  //   var input = this.$el.querySelector("input");
  //   input.maxLength = 10;
  //   input.addEventListener('input', function($event) {
  //     var charCode = $event.which ? $event.which : $event.keyCode;
  //     // kiểm tra charCode xem có phải phím số hay không
  //     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //       $event.preventDefault();
  //     }
  //     if(this.value.length == 2 || this.value.length == 5) {
  //       this.value = this.value + "/";
  //     }
  //     console.log(vm.dateValue);
  //   });
  // },

  watch: {
    /**
     * không cần theo dõi value để gán lại cho dateValue
     * vì trừ khi created
     * còn lại, dateValue luôn thay đổi trước, sau đó mới emit để thay đổi value
     */
    // value: function(newValue) {
    //   this.dateValue = newValue;
    // },

    /**
     * Theo dõi dateValue
     * Khi thay đổi, emit để thay đổi giá trị của prop value
     */
    dateValue: function (newDateValue) {
      this.$emit("input", newDateValue);
    },
  },
  methods: {
    
    // Kiểm tra xem có phải ngày lớn hơn hiện tại không
    /**
     * Phương thức kiểm tra giá trị có lớn hơn ngày hiện tại không
     * @param {Date} date giá trị ngày cần kiểm tra
     * @returns {Boolean} true - lớn hơn ngày hiện tại, false - nhỏ hơn
     * @author pthieu (30-07-2021)
     */
    isFutureDate(date) {
      const currentDate = new Date();
      return date > currentDate;
    },
  },
};
</script>

<style>
@import "../../../css/common/input.css";
.mx-datepicker {
  width: 100%;
  height: var(--ms-input-height);
}

.mx-datepicker-main {
  color: #111;
}

/* các nút điều khiển trong date picker */
.mx-btn {
  color: #2ca01c;
}
.mx-btn:hover {
  border-color: #35bf22;
  color: #35bf22;
}

/* ô ngày hôm nay */
.mx-table-date .today {
  color: #2ca01c;
}

/* ô date đang hover */
.mx-calendar-content .cell:hover {
  color: #111;
  background-color: #f3f8f8;
}

/* ô date được chọn */
.mx-calendar-content .cell.active {
  color: #ffffff;
  background-color: #2ca01c;
}

/* popup date picker */
.mx-datepicker-main.mx-datepicker-popup {
  z-index: 8;
}
</style>