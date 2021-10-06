<template>
  <div class="paging-bar">
    <!-- hiển thị range các bản ghi/ tổng số bản ghi -->
    <div class="paging-total">
      <span>Tổng số: <b>{{ totalRecords }}</b> bản ghi</span>
    </div>

    <div class="ms-flex-space"></div>
     <!-- selectbox select number of records -->
    <BaseSelectBox
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
    <div class="paging-button">
      <!-- nút chuyển đến trang trước -->
      <button
        class="ms-btn ms-btn-ctrl-page ms-btn-prev-page"
        :disabled="isInFirstPage || isDisabled"
        @click="clickPreviousPage"
      >Trước</button>

      <!-- các nút chọn trang cụ thể -->
      <button
        v-for="page in pages"
        :key="page.name"
        :class="['ms-btn','ms-btn-num-page', { active: page.isCurrentPage }]"
        :disabled="isDisabled"
        @click="clickPage(page.name)"
      >
        {{ page.name }}
      </button>

      <!-- nút chuyển đến trang sau -->
      <button
        class="ms-btn ms-btn-ctrl-page ms-btn-next-page"
        :disabled="isInLastPage || isDisabled"
        @click="clickNextPage"
      >Sau</button>
    </div>
    <!-- end button control page -->

   
  </div>
</template>

<style>
@import "../../css/common/common.css";
@import "../../css/layout/pagination.css";
</style>

<script>
import BaseSelectBox from '../base/selectbox/BaseSelectBox.vue';
export default {
  components: {
    BaseSelectBox
  },
  props: {
    /**
     * Số lượng tối đa các btn chọn trang
     */
    maxVisiableBtn: {
      type: Number,
      required: false,
      default: 4,
    },
    totalPages: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    totalRecords: Number,
    // chỉ số của bản ghi đầu tiên trong trang
    startRecord: Number,
    pageSize: Number,
    // các options trong selectbox chọn số bản ghi/trang
    pageSizeSelectItems: Array,
    // trạng thái disabled (khi trang loading)
    isDisabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    /**
     * Chỉ số của nút đầu tiên trong số các btn chọn trang
     */
    startPage: function () {
      return parseInt((this.currentPage - 1) / this.maxVisiableBtn)*this.maxVisiableBtn + 1;
    },

    /**
     * Danh sách các btn chọn trang
     */
    pages: function () {
      var buttons = [];
      if(this.totalPages == 0) {
        buttons.push({
          name: 1,
          isCurrentPage: 1 === this.currentPage,
        });
        return buttons;
      }

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
      if(this.totalPages == 0) {
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
    selectPageSize: function(newPageSize) {
      this.$emit("changePageSize", newPageSize);
    }
  },
};
</script>

