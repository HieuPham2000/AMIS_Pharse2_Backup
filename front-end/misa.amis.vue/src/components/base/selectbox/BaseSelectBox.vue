<template>
  <div
    :class="['ms-selectbox', ...extraClass, { 'disabled': isDisabled, 'open': isOpen }]"
    @keydown="moveAway($event)"
  >
    <!-- selectbox main: content + button -->
    <div
      class="ms-selectbox-main"
      tabindex="-1"
      @click="toggleDropdown"
      @keydown="pressKeyInSelectBox($event)"
    >
      <!-- selectbox content -->
      <div class="ms-selectbox-content" tabindex="-1">
        {{ text }}
      </div>

      <!-- selectbox button -->
      <div class="ms-selectbox-btn" tabindex="-1">
          <div class="ms-icon ms-icon-16 ms-icon-arrow-dropdown"></div>
      </div>
    </div>

    <!-- selectbox dropdown
      - class "up" => dropdown hiển thị ngược lên trên
      - Chứa các dropdown items
     -->
    <ul :class="['ms-selectbox-dropdown', { up: showAbove }]">
      <!-- Dropdown items
        - Trạng thái active: khi hover/khi di chuyển đến (bằng bàn phím)
        - Trạng thái selected: khi click/chọn bằng cách nhấn enter khi item đang active
       -->
      <li
        v-for="(item, index) in selectItems"
        :class="[
          'ms-selectbox-dropdown-item',
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
@import "../../../css/common/selectbox.css";
@import "../../../css/common/icon.css";
</style>

<script>
export default {
  props: {
    extraClass: Array, // mảng tên các class thêm cho selecbox
    dataName: { // tên trường text
      type: String,
      default: "text",
    },
    dataId: { // tên trường value(id)
      type: String,
      default: "id",
    },
    showAbove: { // cờ trạng thái hiển thị phía trên/phía dưới của dropdown
      type: Boolean,
      default: false,
    },
    fixedData: { // dữ liệu fix cho selectbox
      type: Array,
      default: () => [],
    },
    value: { // giá trị v-model
      type: [Number, String],
    },
    // trạng thái disabled (khi trang loading)
    isDisabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      selectItems: [], // dữ liệu (tất cả items) của selectbox
      isOpen: false, // cờ trạng thái ẩn/hiện dropdown
      text: null, // giá trị content
      currentItem: 0, // chỉ số của dropdown item đang active hiện tại
    };
  },
  created() {
    // Load dữ liệu
    this.loadSelectBoxData();

    // lấy text từ giá trị value ban đầu truyền vào
    this.text = this.selectItems.find((i) => i[this.dataId] == this.value)[
      this.dataName
    ];
  },

  // Xử lý sự kiện click ra ngoài selectbox => đóng dropdown
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    /**
     * Xử lý khi click ra ngoài selectbox
     * @param {event} event sự kiện click
     */
    handleClickOutside: function (event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    },

     /**
     * Xử lý sự kiện tab/shift tab khỏi selectbox => ẩn dropdown
     * @param {event} $event sự kiện
     * @author pthieu (22-07-2021)
     */
    moveAway: function ($event) {
      if ($event.keyCode == 9) {
        this.closeDropdown();
      }
    },

     /**
     * Load dữ liệu 
     * @author pthieu (22-07-2021)
     */
    loadSelectBoxData: function () {
      this.selectItems = this.fixedData;
    },

    /**
     * Chuyển trạng thái đóng/mở của dropdown
     * @author pthieu (22-07-2021)
     */
    toggleDropdown: function () {
      if (this.isOpen) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    },

    /**
     * Đóng dropdown
     * @author pthieu (22-07-2021)
     */
    closeDropdown: function () {
      this.isOpen = false;
    },

    /**
     * Mở dropdown
     * @author pthieu (22-07-2021)
     */
    openDropdown: function () {
      // this.currentItem = 0;
      var index = this.selectItems.findIndex((item) => item[this.dataName] == this.text);
      if(index > -1) {
        this.currentItem = index;
      } else {
        this.currentItem = 0;
      }
      this.isOpen = true;
    },

    /**
     * Thay đổi giá trị của value (tham số v-model)
     * @param {*} value giá trị mới của value
     * @author pthieu (22-07-2021)
     */
    changeValue(value) {
      this.$emit("input", value);
    },

    
    /**
     * Chọn item trong dropdown (click, press enter)
     * @param {String} text giá trị text
     * @param {*} value giá trị value (id)
     * @author pthieu (22-07-2021)
     */
    selectDropdownItem: function (text, value) {
      this.text = text;
      this.changeValue(value);
      this.closeDropdown();
    },

      /**
     * Xử lý các sự kiện nhấn bàn phím
     * @param {event} $event sự kiện
     * @author pthieu (22-07-2021)
     */
    pressKeyInSelectBox($event) {
      // Khi dropdown đóng => Nhấn Enter hoặc Alt + Arrow Down để mở
      if (
        !this.isOpen &&
        ($event.key == "Enter" || ($event.altKey && $event.keyCode == 40))
      ) {
        this.openDropdown();
      } else if ($event.altKey && $event.keyCode == 38) { // Alt + Arrow Up để đóng dropdown
        this.closeDropdown();
      } else if ($event.keyCode == 40) { // Arrow Down để di chuyển xuống item bên dưới
        this.currentItem++;
        if (this.currentItem >= this.selectItems.length) {
          this.currentItem = 0;
        }
      } else if ($event.keyCode == 38) { // Arrow Up để di chuyển lên item bên trên
        this.currentItem--;
        if (this.currentItem < 0) {
          this.currentItem = this.selectItems.length - 1;
        }
      } else if ($event.key == "Enter") { // Enter để chọn item hiện tại (đang active)
        var item = this.selectItems[this.currentItem];
        this.selectDropdownItem(item[this.dataName], item[this.dataId]);
      }
    },
  },
};
</script>