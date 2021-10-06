<template>
  <div class="paging-bar">
    <!-- hiển thị range các bản ghi/ tổng số bản ghi -->
    <div class="paging-total">
      <span
        >Tổng số: <b>{{ totalRecords | formatNumber }}</b> bản ghi</span
      >
    </div>

    <div class="ms-flex-space"></div>
    <!-- selectbox select number of records -->
    <BaseSelectBox
      v-show="totalPages"
      :fixedData="pageSizeSelectItems"
      :value="pageSize"
      :extraClass="['paging-limit']"
      :showAbove="true"
      :isDisabled="isDisabled"
      @input="selectPageSize"
    >
    </BaseSelectBox>
    <!-- end selectbox -->

    <!-- button control page -->
    <div  v-show="totalPages" class="paging-button">
      <!-- nút chuyển đến trang trước -->
      <button
        class="ms-btn ms-btn-ctrl-page ms-btn-prev-page"
        :disabled="isInFirstPage || isDisabled"
        @click="clickPreviousPage"
      >
        Trước
      </button>

      <!-- các nút chọn trang cụ thể -->
      <button
        v-show="isShowBtnFistPage"
        :class="['ms-btn', 'ms-btn-num-page', { active: currentPage == 1 }]"
        :disabled="isDisabled"
        @click="clickPage(1)"
      >
        1
      </button>
      <button
        v-show="isShowBtnViewPrevPages"
        :class="['ms-btn', 'ms-btn-num-page']"
        :disabled="isDisabled"
        @click="viewPrevVisibleBtns"
      >
        ...
      </button>
      <button
        v-for="page in pages"
        :key="page.name"
        :class="['ms-btn', 'ms-btn-num-page', { active: page.isCurrentPage }]"
        :disabled="isDisabled"
        @click="clickPage(page.name)"
      >
        {{ page.name }}
      </button>

      <button
        v-show="isShowBtnViewNextPages"
        :class="['ms-btn', 'ms-btn-num-page']"
        :disabled="isDisabled"
        @click="viewNextVisibleBtns"
      >
        ...
      </button>
      <button
        v-show="isShowBtnLastPage"
        :class="[
          'ms-btn',
          'ms-btn-num-page',
          { active: currentPage == totalPages },
        ]"
        :disabled="isDisabled"
        @click="clickPage(totalPages)"
      >
        {{ totalPages }}
      </button>

      <!-- nút chuyển đến trang sau -->
      <button
        class="ms-btn ms-btn-ctrl-page ms-btn-next-page"
        :disabled="isInLastPage || isDisabled"
        @click="clickNextPage"
      >
        Sau
      </button>
    </div>
    <!-- end button control page -->
  </div>
</template>

<style>
@import "../../css/common/common.css";
@import "../../css/layout/pagination.css";
</style>

<script>
import BaseSelectBox from "../base/selectbox/BaseSelectBox.vue";
import { CommonFunction } from '../../script/common/common';
export default {
  components: {
    BaseSelectBox,
  },
  props: {
    /**
     * Số lượng tối đa các btn chọn trang được hiển thị
     * trừ 2 nút: trang đầu, trang cuối (nếu có)
     */
    maxVisiableBtn: {
      type: Number,
      required: false,
      default: 3,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    totalRecords: Number,

    pageSize: Number,
    // các options trong selectbox chọn số bản ghi/trang
    pageSizeSelectItems: Array,
    // trạng thái disabled (khi trang loading)
    isDisabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      /**
       * Chỉ số của nút đầu tiên trong số các btn hiển thị
       */
      startPage: 1,
    };
  },
  created() {
    this.startPage = this.calcStartPage();
  },
  watch: {
    currentPage() {
      this.startPage = this.calcStartPage();
    },
    totalPages() {
      this.startPage = this.calcStartPage();
    },
  },
  computed: {
    /**
     * Danh sách các btn chọn trang được hiển thị
     */
    pages: function () {
      var buttons = [];
      for (
        var i = this.startPage;
        i <=
        Math.min(this.startPage + this.maxVisiableBtn - 1, this.totalPages);
        ++i
      ) {
        buttons.push({
          name: i,
          isCurrentPage: i === this.currentPage,
        });
      }

      return buttons;
    },
    /**
     * Cờ xác định có hiển thị btn trang đầu 
     * và btn chọn viewPrevVisibleBtns hay không
     */
    isShowBtnFistPage() {
      if (this.totalPages == 0) {
        return false;
      }
      var index = this.pages.findIndex((btn) => btn.name === 1);
      /** nếu btn trang đầu đã tồn tại trong mảng pages */
      if (index > -1) {
        return false;
      }
      return true;
    },
    /**
     * Cờ xác định có hiển thị btn trang cuối 
     * và btn chọn viewNextVisibleBtns hay không
     */
    isShowBtnLastPage() {
      if (this.totalPages == 0) {
        return false;
      }
      var index = this.pages.findIndex((btn) => btn.name === this.totalPages);
      /** nếu btn trang cuối đã tồn tại trong mảng pages */
      if (index > -1) {
        return false;
      }
      return true;
    },
    /**
     * Cờ xác định có hiển thị nút xem các trang trước không
     */
    isShowBtnViewPrevPages() {
      return this.startPage > 2;
    },
    /**
     * Cờ xác định có hiển thị nút xem các trang sau không
     */
    isShowBtnViewNextPages() {
      if(this.totalPages == 0) {
        return false;
      }
      return this.startPage < this.totalPages - this.maxVisiableBtn;
    },


    /**
     * Cờ xác định có đang ở trang 1 không:
     * true - đang ở trang 1, false - không
     */
    isInFirstPage: function () {
      return this.currentPage === 1;
    },

    /**
     * Cờ xác định có đang ở trang cuối không:
     * true - đang ở trang 1, false - không
     */
    isInLastPage: function () {
      if (this.totalPages == 0) {
        return true;
      }
      return this.currentPage === this.totalPages;
    },
  },
  methods: {
    /**
     * Phương thức xử lý khi chọn btn chuyển đến trang cuối
     * @author pthieu (31-07-2021)
     */
    clickPreviousPage: function () {
      this.$emit("changePage", this.currentPage - 1);
    },

    /**
     * Phương thức xử lý khi chọn btn chuyển đến trang cụ thể
     * @author pthieu (31-07-2021)
     */
    clickPage: function (page) {
      this.$emit("changePage", page);
    },

    /**
     * Phương thức xử lý khi chọn btn chuyển đến trang sau
     * @author pthieu (31-07-2021)
     */
    clickNextPage: function () {
      this.$emit("changePage", this.currentPage + 1);
    },

    /**
     * Phương thức xử lý khi thay đổi số bản ghi/trang
     * @author pthieu (31-07-2021)
     */
    selectPageSize: function (newPageSize) {
      this.$emit("changePageSize", newPageSize);
    },

    /**
     * Phương thức tính toán start page
     * (btn đầu tiên trong số các btn chọn trang được hiển thị)
     * @author pthieu (20-08-2021)
     */
    calcStartPage() {
      if (this.currentPage <= this.maxVisiableBtn) {
        return 1;
      }
      if (this.currentPage + this.maxVisiableBtn > this.totalPages) {
        return this.totalPages - this.maxVisiableBtn + 1;
      }
      return this.currentPage - 1;
    },
    /**
     * Phương thức xử lý khi ấn nút hiển thị các trang trước
     * @author pthieu (20-08-2021)
     */
    viewPrevVisibleBtns: function () {
      // this.startPage = this.calcStartPage(this.pages[0].name - 1);
      this.startPage -= this.maxVisiableBtn;
      if(this.startPage < 1) {
        this.startPage = 1;
      }
    },
    /**
     * Phương thức xử lý khi ấn nút hiển thị các trang sau
     * @author pthieu (20-08-2021)
     */
    viewNextVisibleBtns: function () {
      // this.startPage = this.calcStartPage(this.pages[this.pages.length - 1].name + 1);
      this.startPage += this.maxVisiableBtn;
      var maxStartPage =  this.totalPages - this.maxVisiableBtn + 1
      if(this.startPage > maxStartPage) {
        this.startPage =  maxStartPage;
      }
    },
  },

  filters: {
    /**
     * Định dạng hiển thị dữ liệu số
     * @param {number} value giá trị dữ liệu cần định dạng
     * @returns {string} dữ liệu sau định dạng
     * @author pthieu (14-07-2021)
     */
    formatNumber: function (value) {
      return CommonFunction.formatDecimalNumber(value);
    },
  },
};
</script>

