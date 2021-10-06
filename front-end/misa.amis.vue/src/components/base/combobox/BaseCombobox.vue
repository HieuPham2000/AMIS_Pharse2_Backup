<template>
  <div
    class="ms-combobox"
    tabindex="-1"
    :class="{ open: isOpen, 'border-red': isError, 'disabled': isDisabled }"
    :id="id"
    @keydown="moveAway($event)"
  >
    <!-- 
      combobox input 
      - Hiển thị giá trị text (và cho phép nhập như ô input bình thường)
      - Khi focus có thể dùng bàn phím để điều khiển: đóng/mở dropdown, di chuyển lên/xuống chọn option
      - Validate khi nhập text không khớp với các option
    -->
    <BaseTextInput
      ref="Input"
      class="ms-combobox-input"
      v-model="text"
      :placeholder="placeholder"
      :displayName="displayName"
      :isComboboxInput="true"
      :comboboxInputItems="comboboxInputItems"
      :isRequired="isRequired"
      :isDisabled="isDisabled"
      :tabindex="tabindex"
      :showError="showError"
      :showErrorIcon="showErrorIcon"
      @focus="openDropdown(true)"
      @input="openDropdown"
      @keydown="pressKeyInCombobox($event)"
      @setError="isError = $event"
    />

    <!-- 
      combobox button
      - Điều khiển đóng/mở dropdown
      - Khi focus, có thể điều khiển di chuyển lên/xuống chọn option
     -->
    <button
      type="button"
      class="ms-combobox-btn"
      tabindex="-1"
      :disabled="isDisabled"
      @click="toggleDropdown"
      @keydown="pressKeyInCombobox($event)"
    >
      <div class="ms-icon ms-icon-16 ms-icon-arrow-dropdown"></div>
    </button>

    <!-- 
      Combobox dropdown chứa các options
     -->
    <ul
      :class="[
        'ms-combobox-dropdown',
        { up: showAbove },
      ]"
    >
      <li v-if="isNoData" 
      class="ms-combobox-dropdown-item item-notice">Không có dữ liệu</li>
      <li v-if="isNoOptionMatch" 
      class="ms-combobox-dropdown-item item-notice">Không có kết quả phù hợp</li>
      <!-- Dropdown items/options
        - Trạng thái active: khi hover bằng chuột, hoặc khi di chuyển đến bằng bàn phím
        - Trạng thái selected: khi click chuột chọn, hoặc chọn bằng bàn phím
       -->
      <li
        v-for="(item, index) in dropdownItems"
        :class="[
          'ms-combobox-dropdown-item',
          { active: currentItem == index, selected: item[dataName] == text },
        ]"
        :key="index"
        @click="selectDropdownItem(item[dataName], item[dataId])"
      >
        {{ item[dataName] }}
      </li>
    </ul>
  </div>
</template>

<style>
@import "../../../css/common/combobox.css";
@import "../../../css/common/icon.css";
</style>

<script>
import { CommonFunction } from "../../../script/common/common";
import eventBus from "../../../script/common/event-bus";
import BaseTextInput from "../BaseTextInput.vue";
export default {
  components: { BaseTextInput },
  props: {
    id: String, // id gán cho component
    // tên trường text, vd: PositionName
    dataName: {
      type: String,
      default: "text"
    },
    // tên trường id, vd: PositionId
    dataId: {
      type: String, 
      default: "id"
    },
    // dữ liệu combobox (các options)
    // Modified: pthieu (24/09/2021)
    comboboxData: {
      type: Array,
      default: () => []
    }, 
    showAbove: Boolean, // cờ xác định dropdown hiển thị xuống dưới hay lên trên (true)
    placeholder: String, // placeholder gán cho compobox input
    extraItems: {
      // các options đặc biệt không có trong comboboxData (VD: option "Tất cả...")
      type: Array,
      default: () => [],
    },
    value: {
      // giá trị v-model gán cho combobox
      type: [Number, String],
    },
    isRequired: {
      type: Boolean,
      default: false,
      required: false,
    },
    isDisabled: {
      // cờ set disable các thẻ input, button (khi trang web loading)
      type: Boolean,
      default: false,
      required: false,
    },
    tabindex: {
      type: String,
      required: false,
      default: '0'
    },
    displayName: {
      type: String,
      required: false,
      default: ""
    },
    showError: Function,
    showErrorIcon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      comboboxItems: [], // tất cả các options
      showItems: [], // các options khớp với input
      dropdownItems: [], // các options xuất hiện trong dropdown
      isOpen: false, // cờ trạng thái đóng/mở dropdown (set class "open" cho "ms-combobox")
      currentItem: 0, // chỉ số của dropdown item đang active hiện tại
      isError: false, // cờ báo lỗi validate
      text: null, // giá trị dữ liệu input
    };
  },
  created() {
    // Load dữ liệu cho combobox (load các options)
    this.loadComboboxData();
    // Dựa vào value => gán text tương ứng
    this.setTextByValue();

    eventBus.$on("scroll", this.closeDropdown);
  },
  computed: {
    /**
     * Mảng chứa các giá trị text của options
     * dùng để truyền vào combobox-input
     * phục vụ việc validate (kiểm tra text nhập vào có khớp với option của combobox hay không)
     */
    comboboxInputItems: function () {
      return this.comboboxItems.map((i) => i[this.dataName]);
    },
    /**
     * Cờ xác định không có option nào match input
     */
    isNoOptionMatch: function () {
      return this.comboboxData.length > 0 && this.dropdownItems.length == 0;
    },
     /**
     * Cờ xác định không có dữ liệu
     */
    isNoData: function () {
      return this.comboboxData.length == 0;
    },
  },
  watch: {
    value: function() {
      // Dựa vào value => gán text tương ứng
      this.setTextByValue();
    },
    /**
     * Theo dõi giá trị của prop comboboxData.
     * Khi giá trị thay đổi sẽ gọi hàm load options cho combobox.
     * Lý do: comboboxData là dữ liệu lấy từ api (bất đồng bộ).
     * Nên sẽ xảy ra việc parent truyền prop comboboxData trước khi dữ liệu lấy về hoàn tất.
     * Vì vậy cần watch để load lại options.
     */
    comboboxData: function () {
      this.loadComboboxData();
      // Dựa vào value => gán text tương ứng
      this.setTextByValue();
    },

    /**
     * Theo dõi giá trị của biến data: text.
     * Tính lại xem các options khớp với text input.
     * Các options không khớp text input sẽ bị ẩn đi.
     */
    text: function (newText) {
      if (newText == "" || newText == undefined || newText == null) {
        this.dropdownItems = this.comboboxItems;
        this.changeValue(null);
        return;
      }
      // var len = newText.length;

      // Loại bỏ dấu Tiếng Việt
      var textNonAccent = CommonFunction.nonAccentVietnamese(newText);

      // filter trên mảng chứa tất cả options (comboboxItems)
      // showItems là mảng chứa các option khớp với input
      this.showItems = this.comboboxItems.filter((item) => {
        // Cắt giá trị text của option theo độ dài text của combobox-input
        // Và loại bỏ dấu Tiếng Việt
        // var itemTextSliceNonAccent = CommonFunction.nonAccentVietnamese(
        //   item[this.dataName].slice(0, len)
        // );

        // Kiểm tra xem có khớp nhau không
        // return textNonAccent == itemTextSliceNonAccent;
        var itemTextSliceNonAccent = CommonFunction.nonAccentVietnamese(
          item[this.dataName]
        );
        return itemTextSliceNonAccent.toLowerCase().indexOf(textNonAccent.toLowerCase()) > -1;
      });

      // gán lại mảng các options xuất hiện trong dropdown
      // các options xuất hiện chính là các options khớp với text input
      this.dropdownItems = this.showItems;
    },

    /**
     * Tính toán currentItem
     */
    dropdownItems: function () {
      var index = this.dropdownItems.findIndex(
        (item) => item[this.dataName] === this.text
      );
      if (index > -1) {
        this.currentItem = index;
      } else {
        this.currentItem = 0;
      }
    },
  },

  mounted() {
    // Xử lý sự kiện click ra ngoài combobox => đóng dropdown
    document.addEventListener("click", this.handleClickOutside);
  },
  updated() {
    // Modified: 24/09/2021
    // Thêm title cho tất cả các dropdown item có text overflow
    // Lấy ra tất cả item
    var items = this.$el.querySelectorAll(".ms-combobox-dropdown-item");
    // Duyệt từng item
    items.forEach((item) => {
      // kiểm tra điều kiện overflow
      if(item.offsetWidth < item.scrollWidth) {
        // nếu overflow thì set title
        item.setAttribute("title", item.innerText);
      } else {
        // không overflow thì bỏ title
        item.removeAttribute("title");
      }
    });
  },
  beforeDestroy() {
    eventBus.$off("scroll", this.closeDropdown);
  },
  destroyed() {
    // Bỏ lắng nghe sự kiện
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    /**
     * Phương thức xử lý đóng combobox khi click ra ngoài
     * @param {event} event sự kiện click
     * @author pthieu (21-07-2021)
     */
    handleClickOutside: function (event) {
      // kiểm tra element mục tiêu có thuộc combobox hay không
      // Nếu không thuộc => đóng combobox
      if (!this.$el.contains(event.target)) {
        this.closeDropdown();
      }
    },

    /**
     * Phương thức xử lý sự kiện tab/shift + tab khỏi combobox
     * => Đóng combobox
     * @param {event} $event sự kiện nhấn phím
     * @author pthieu (21-07-2021)
     */
    moveAway: function ($event) {
      // key code của phím tab
      if ($event.keyCode == 9) {
        this.closeDropdown();
      }
    },

    /**
     * Phương thức load các options cho combobox
     * @author pthieu (20-07-2021)
     */
    loadComboboxData: function () {
      // comboboxItems chứa tất cả các options
      // bao gồm: dữ liệu từ prop comboboxData
      // và các options khác (từ prop extraItems)
      this.comboboxItems = [...this.extraItems, ...this.comboboxData];

      // this.showItems = this.comboboxItems;

      // Khởi tạo các options hiển thị trong dropdown
      this.dropdownItems = this.comboboxItems;
    },

    /**
     * Phương thức chuyển trạng thái đóng/mở của dropdown
     * @author pthieu (20-07-2021)
     */
    toggleDropdown: function () {
      // kiểm tra trạng thái mở của dropdown
      if (this.isOpen) {
        // nếu đang mở => đóng dropdown
        this.closeDropdown();
      } else {
        // nếu đang đóng => mở dropdown
        // truyền true => hiển thị toàn bộ options (kể cả không khớp text input hiện tại)
        this.openDropdown(true);
      }
    },

    /**
     * Phương thức đóng dropdown
     * @author pthieu (20-07-2021)
     */
    closeDropdown: function () {
      this.isOpen = false;
    },

    /**
     * Phương thức mở dropdown
     * @param {boolean} showAll cờ:
     * true - hiển thị tất cả options,
     * false (mặc định) - chỉ hiển thị các options khớp với input
     * @author pthieu (20-07-2021)
     */
    openDropdown: function (showAll = false) {
      // dựa trên cờ showAll
      // để gán giá trị cho mảng options hiển thị trong dropdown
      if (showAll) {
        this.dropdownItems = this.comboboxItems;
      } else {
        this.dropdownItems = this.showItems;
      }

      // reset chỉ số currentItem
      // this.currentItem = 0;

      // mở dropdown
      this.isOpen = true;
      // scroll dropdown đến current item
      this.$nextTick(() => {
        var el = this.$el.querySelectorAll(".ms-combobox-dropdown-item")[this.currentItem];
        el.scrollIntoView({block: "nearest", inline: "nearest"});
      });
    },

    /**
     * Phương thức thay đổi giá trị của value (tham số v-model)
     * emit giá trị cho phía parent
     * @param {*} value giá trị mới của value
     * @author pthieu (20-07-2021)
     */
    changeValue: function (value) {
      this.$emit("input", value);
    },

    /**
     * Phương thức validate giá trị combobox input 
     * @returns {Boolean} true - validate thành công, false - thất bại
     * @author pthieu (22-07-2021)
     */
    validateInput: function () {
      return this.$refs["Input"].validateInput();
    },
    /**
     * Phương thức hiện thị thông báo lỗi
     * @author pthieu (22-07-2021)
     */
    showErrorNotice: function () {
      return this.$refs["Input"].showErrorNotice();
    },


    /**
     * Phương thức set trạng thái focus cho combobox-input
     * @author pthieu (23-07-2021)
     */
    focusInput: function () {
      this.$refs["Input"].focusInput();
    },

    /**
     * Phương thức xử lý khi chọn option trong dropdown (click, press enter)
     * @param {String} newText giá trị text mới
     * @param {*} newValue giá trị value (id) mới
     * @author pthieu (20-07-2021)
     */
    selectDropdownItem: function (newText, newValue) {
      // thay đổi text
      this.text = newText;
      // thay đổi value
      this.changeValue(newValue);
      // đóng combobox
      this.closeDropdown();
    },

    /**
     * Phương thức set text khi biết giá trị value
     * @author pthieu (21-07-2021)
     */
    setTextByValue: function () {
      var dataId = this.dataId;
      var value = this.value;

      // tìm item có item[dataId] = value
      var item = this.comboboxItems.find((item) => item[dataId] == value);

      // nếu tìm được
      // gán text
      if (item) {
        this.text = item[this.dataName];
      } else {
        this.text = null;
      }
    },

    /**
     * Phương thức lấy giá trị value khi biết giá trị text
     * @author pthieu (21-07-2021)
     */
    getValueByText: function () {
      var dataName = this.dataName;
      var text = this.text;

      // tìm item có item[dataName] = text
      var item = this.comboboxItems.find((item) => item[dataName] == text);

      // nếu tìm thấy
      // trả về value tương ứng
      if (item) {
        return item[this.dataId];
      }

      // nếu không tìm thấy, trả về null
      return null;
    },

    /**
     * Phương thức xử lý các sự kiện nhấn bàn phím
     * @param {event} $event sự kiện
     * @author pthieu (21-07-2021)
     */
    pressKeyInCombobox: function ($event) {
      // $event.stopPropagation();
      // $event.stopImmediatePropagation();
      // Khi dropdown đóng => Nhấn Enter hoặc Alt + Arrow Down để mở
      if (
        !this.isOpen &&
        ($event.key == "Enter" || ($event.altKey && $event.keyCode == 40))
      ) {
        // Mở combobox
        // và hiển thị tất cả các options
        this.openDropdown(true);
      }
      // Alt + Arrow Up để đóng dropdown
      else if ($event.altKey && $event.keyCode == 38) {
        this.closeDropdown();
      }
      // Arrow Down để di chuyển xuống item bên dưới
      else if ($event.keyCode == 40) {
        this.currentItem++;
        if (this.currentItem >= this.dropdownItems.length) {
          this.currentItem = 0;
        }
        $event.preventDefault();
        // scroll đến currentItem
        // currentItem nằm ở cuối
        // this.$el.querySelectorAll(".ms-combobox-dropdown-item")[this.currentItem].scrollIntoView(false);
        var el = this.$el.querySelectorAll(".ms-combobox-dropdown-item")[this.currentItem];
        el.scrollIntoView({block: "nearest", inline: "nearest"});
      }
      // Arrow Up để di chuyển lên item bên trên
      else if ($event.keyCode == 38) {
        this.currentItem--;
        if (this.currentItem < 0) {
          this.currentItem = this.dropdownItems.length - 1;
        }
        $event.preventDefault();
        // scroll đến currentItem
        // currentItem nằm ở cuối
        // this.$el.querySelectorAll(".ms-combobox-dropdown-item")[this.currentItem].scrollIntoView(false);
        el = this.$el.querySelectorAll(".ms-combobox-dropdown-item")[this.currentItem];
        el.scrollIntoView({block: "nearest", inline: "nearest"});
      }
      // Enter để chọn item hiện tại (đang active)
      else if ($event.key == "Enter") {
        // lấy ra option tương ứng với chỉ số currentItem hiện tại
        var item = this.dropdownItems[this.currentItem];
        if(item) {
          // xử lý việc chọn option
          this.selectDropdownItem(item[this.dataName], item[this.dataId]);
        }
        // $event.preventDefault();
      }
    },
  },
};
</script>