<template>
  <DatePicker
    v-model="dateValue"
    type="date"
    tabindex="-1"
    :open.sync="open"
    :value-type="valueType"
    :format="displayFormat"
    :placeholder="displayFormat"
    :title-format="displayFormat"
    :disabled-date="isDisabledDate"
    :lang="lang"
    :clearable="false"
    :disabled="isDisabled"
  >
    <!-- Thêm nút "Hôm nay" trong datepicker -->
    <template v-slot:header="{ emit }">
      <button class="mx-btn mx-btn-text" @click="emit(new Date())">
        Hôm nay
      </button>
    </template>

    <template v-slot:input>
      <input 
        type="text" 
        name="date" 
        ref="input"
        class="ms-input"
        v-model="inputValue"
        v-mask="mask" 
        autocomplete="off" 
        :disabled="isDisabled"
        :placeholder="displayFormat" 
        :tabindex="tabindex" 
        :class="{'ms-input-validate-error': isError}"
        v-tooltip.top="{
          content: errorMsg,
          classes: 'ms-input-tooltip',
        }"
        @change="changeInput"
        @focusin="openDatePicker(), $event.target.select()"
        @keydown.tab="closeDatePicker"
        @blur="onBlurInput"
      >
    </template>
    <template v-slot:icon-calendar>
      <div class="ms-icon ms-icon-16 ms-icon-calendar"></div>
    </template>

  </DatePicker>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/vi";
import { DATE_DISPLAY_TOKEN, DATE_VALUE_TOKEN } from "../../../script/common/config";
import { CommonFunction } from "../../../script/common/common";
import { resources } from "../../../script/common/resources";
import eventBus from "../../../script/common/event-bus";

export default {
  components: {
    DatePicker,
  },
  props: {
    // giá trị value v-model
    value: {
      type: [String, Date], 
    },
    displayFormat: { // định dạng hiển thị
      type: String,
      default: DATE_DISPLAY_TOKEN.toUpperCase(),
    },
    valueType: { // định dạng giá trị thực sự (input - output)
      type: String,
      default: DATE_VALUE_TOKEN.toUpperCase(),
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
    isRequired: {
      type: Boolean,
      required: false,
      default: false
    },
    isFutureDisabled: {
      type: Boolean,
      required: false,
      default: true
    },
    displayName: {
      type: String,
      default: "Thông tin",
      required: false
    },
    showError: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      // lưu giá trị của datepicker (nội bộ trong component này)
      // map với prop value
      // 2-way binding với component
      dateValue: this.value, 
      // 1 số thiết lập
      lang: {
        // thiết lập hiển thị tháng trước năm trong datepicker
        monthBeforeYear: true, 
      },
      // giá trị đồng bộ với trạng thới mở của date picker
      open: false,
      // giá trị 2-way binding với input
      inputValue: null,
      // thông báo lỗi
      errorMsg: null,
      // cờ trạng thái lỗi
      isError: false,
    };
  },
  computed: {
    /**
     * Sinh mask từ xây displayFormat
     * VD: DD/MM/YYYY -> ##/##/####
     * (quy định về mask là do thư viện v-mask)
     */
    mask() {
      return this.displayFormat.replace(/[dmy]/ig, "#");
    }
  },

  created() {
    // map dateValue với prop value (v-model phía parent)
    this.dateValue = this.value;
    // lấy ra xâu ngày tháng (đã định dạng hiển thị) để gán cho input
    this.inputValue = CommonFunction.formatDate(this.dateValue, this.displayFormat);

    eventBus.$on("scroll", this.closeDatePicker);
  },
  mounted() {
    // this.$el.querySelector(".mx-icon-calendar").addEventListener("mousedown", this.toggleDatePickerByBtn);
  },
  beforeDestroy() {
     eventBus.$off("scroll", this.closeDatePicker);
    // this.$el.querySelector(".mx-icon-calendar").removeEventListener("mousedown", this.toggleDatePickerByBtn);
  },
  watch: {
    /**
     *  theo dõi value để gán lại cho dateValue
     */
    value: function(newValue) {
      this.dateValue = newValue;
      this.validateInput();
    },

    /**
     * Theo dõi dateValue
     * Khi thay đổi, emit để thay đổi giá trị của prop value
     */
    dateValue: function (newDateValue) {
      this.$emit("input", newDateValue);
      this.inputValue = CommonFunction.formatDate(this.dateValue, this.displayFormat);
    },
  },
  methods: {
    /**
     * Phương thức mở date picker (manually)
     * @author pthieu (13-09-2021)
     */
    openDatePicker() {
      // var datePickerElements = document.querySelectorAll(".mx-datepicker-main");
      // for(var i = 0; i < datePickerElements.length; ++i) {
      //   datePickerElements[i].remove();
      // }
      this.open = true;
    },
    /**
     * Phương thức đóng date picker (manually)
     * @author pthieu (13-09-2021)
     */
    closeDatePicker() {
      this.open = false;
    },

    /**
     * Phương thức toggle date picker bằng btn
     * @param {Event} $event sự kiện
     * @author pthieu (24-09-2021)
     */
    toggleDatePickerByBtn($event) {
      // this.open = !this.open;
      if(this.open) {
        this.closeDatePicker();
      } else {
        this.openDatePicker();
      }
      $event.stopImmediatePropagation();
    },

    /**
     * Phương thức kiểm tra xem ngày, tháng, năm có hợp lệ
     * @param {*} day giá trị ngày
     * @param {*} month giá trị tháng
     * @param {*} year giá trị năm
     * @author pthieu (13-09-2021)
     */
    isExistDate(day, month, year) {
      // kiểm tra về kiểu dữ liệu
      for(var i in [day, month, year]) {
        if(i == undefined || i == null || isNaN(i)) {
          return false;
        }
      }
      // chuyển sang kiểu int để kiểm tra
      day = Number.parseInt(day);
      month = Number.parseInt(month);
      year = Number.parseInt(year);
      // kiểm tra 1 số điều kiện cơ bản về khoảng giá trị
      if(year < 0 || month < 1 || month > 12 || day < 1) {
        return false;
      }
      // xác định năm nhuận
      var isLeapYear = (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0));

      switch(month) {
        // TH tháng có 31 ngày
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          if(day > 31) {
            return false;
          }
          break;
        // TH tháng 2
        case 2:
          if(day > 29) {
            return false
          } else if (day === 29) {
            // tháng 2 năm nhuận có 29 ngày
            return isLeapYear;
          }
          break;
        // TH còn lại là các tháng có 30 ngày
        default:
          if(day > 30) {
            return false;
          }
      }
      return true;
    },
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
    /**
     * Phương thức kiểm tra giá trị date có bị disable không
     * @param {Date} date giá trị ngày tháng cần kiểm tra
     * @returns {Boolean} true - bị disable, false - không disabled
     * @author pthieu (13-09-2021)
     */
    isDisabledDate(date) {
      return this.isFutureDisabled && this.isFutureDate(date);
    },
    /**
     * Phương thức kiểm tra giá trị nhập từ input có phải 1 valid date không
     * @param {Date} date giá trị cần kiểm tra
     * @returns {Boolean} true - valid, false - invalid
     * @author pthieu (13-09-2021)
     */
    isValidInputDate(date) {
      return (date instanceof Date && !isNaN(date) && !this.isDisabledDate(date));
    },
    /**
     * Phương thức xử lý sự kiện onchange của input
     * @author pthieu (13-09-2021)
     */
    changeInput() {
      // đóng date picker
      this.open = false;
      
      // lấy ra mảng ngày, tháng, năm
      var dateArr = CommonFunction.splitDateStr(this.inputValue, this.displayFormat);
      // nếu mảng null, undefined, trống, length < 3
      // (inputValue khớp với displayFormat)
      if(!dateArr || dateArr.length !== 3) {
        // rollback inputValue
        this.inputValue = CommonFunction.formatDate(this.dateValue, this.displayFormat);
        return;
      }
      // if(!this.isExistDate(dateArr[0], dateArr[1], dateArr[2])) {
      //   // rollback inputValue
      //   this.inputValue = CommonFunction.formatDate(this.dateValue, this.displayFormat);
      //   return;
      // }

      // parse sang kiểu date
      var date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
      // kiểm tra giá trị date có phải valid date không
      if(this.isValidInputDate(date)) {
        // TH valid: thay đổi dateValue
        this.dateValue = CommonFunction.formatDate(date.toJSON(), this.valueType);
      } else {
        // TH invalid: giữ nguyên dateValue, rollback inputValue
        this.inputValue = CommonFunction.formatDate(this.dateValue, this.displayFormat);
      }
    },

        /**
     * Phương thức Kiểm tra trường bắt buộc
     * @returns {Boolean} true - thỏa mãn | false - không thỏa mãn
     * @author pthieu (22-07-2021)
     */
    validateRequired: function () {

      // nếu đây không phải trường bắt buộc
      // thì không cần kiểm tra
      if (!this.isRequired) {
        return true;
      }
      
      // kiểm tra giá trị
      if (
        this.value === undefined ||
        this.value === null ||
        this.value.toString().trim() === ""
      ) {
        this.errorMsg = CommonFunction.formatString(resources.vi.errorValidate.required, this.displayName);
        return false;
      }
      return true;
    },
    /**
     * Phương thức Xử lý sự kiện blur input
     * @param {event} $event sự kiện
     * @author pthieu (28-07-2021)
     */
    onBlurInput: function($event) {
      // kiểm tra nếu phần tử vừa focus đến (relatedTarget)
      // nếu không thuộc component này => thực hiện validate
      // nếu vẫn thuộc component => không thực hiện validate
      if(!this.$el.contains($event.relatedTarget)) {
        this.validateInput();
      }
    },
    /**
     * Phương thức Validate dữ liệu
     * @returns {Boolean} true - validate thành công | false - thất bại
     * @author pthieu (22-07-2021)
     */
    validateInput: function () {
      if (this.validateRequired()) {
        this.removeInputError();
      } else {
        this.addInputError();
      }
      // có error (isError = true) => validate thất bại (trả về false)
      // không có error (isError = false) => thành công (trả về true)
      return !this.isError;
    },
        /**
     * Phương thức Xử lý khi input validate false
     * @author pthieu (22-07-2021)
     */
    addInputError: function () {
      // bật cờ trạng thái Lỗi
      this.isError = true;
    },
    /**
     * Phương thức Xử lý khi input validate true
     * @author pthieu (22-07-2021)
     */
    removeInputError: function () {
      // tắt cờ trạng thái Lỗi
      this.isError = false;
      this.errorMsg = null;
    },
    /**
     * Phương thức hiển thị thông báo lỗi
     * @author pthieu (22-07-2021)
     */
    showErrorNotice() {
      this.showError(this.errorMsg);
    },
    /**
     * Phương thức thực hiện focus vào ô input
     * @author pthieu (23-07-2021)
     */
    focusInput: function() {
      // this.$refs.input.focus();
      this.$refs.input.select();
    },
  },
  filters: {
    formatDate: function (value, dateToken) {
      return CommonFunction.formatDate(value, dateToken);
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

/* btn */
.mx-icon-calendar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 2px);
  width: calc(var(--ms-input-height) - 2px);
  right: 1px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  background-color: #fff;
  cursor: pointer;
}
.mx-icon-calendar:hover {
  background-color: #e0e0e0;
}
.mx-datepicker.disabled .mx-icon-calendar {
  pointer-events: none;
  background-color: var(--ms-input-disabled-bg-color);
}

</style>