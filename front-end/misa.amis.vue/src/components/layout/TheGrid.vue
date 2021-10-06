<template>
  <div class="ms-grid-container">
    <div :class="['ms-grid', {'pointer-events-disabled': isDisabled}]" ref="grid">
      <div class="ms-grid-table-container">
      <table class="ms-grid-table" cellspacing="0">
        <!-- Hàng tiêu đề các cột trong bảng -->
        <thead class="ms-grid-thead">
          <tr>
            <th class="ms-grid-th fixed-left grid-checkbox">
              <BaseCheckBox v-model="checkAll" tabindex="-1" />
            </th>

            <th
              v-for="column in tableColumns"
              :key="column.header"
              class="ms-grid-th"
              :style="column.style"
            >
              {{ column.header }}
            </th>

            <th class="ms-grid-th fixed-right grid-feature">Chức năng</th>
          </tr>
        </thead>

        <!-- Nội dung bảng -->
        <tbody class="ms-grid-tbody">
          <tr
            v-for="row in tableData"
            :key="row[entityId]"
            :class="['ms-grid-row', { active: activeRowId == row[entityId] }]"
            @click="setSelectedRow($event, row[entityId])"
          >
            <!-- ô 1: chứa checkbox -->
            <td class="ms-grid-td fixed-left grid-checkbox">
              <!-- <BaseCheckBox
                v-model="selectedRows"
                :checkboxValue="row[entityId]"
              /> -->
              <BaseCheckBox
                :value="selectedRows"
                @input="$emit('update:selectedRows', $event)"
                :checkboxValue="row[entityId]"
              />
            </td>

            <!-- Các ô khác -->
            <td
              v-for="(column, index) in tableColumns"
              :key="index"
              class="ms-grid-td"
              :style="column.style"
              @click="clickRow($event, row[entityId])"
              @dblclick="clickEditRow(row[entityId])"
              @contextmenu.prevent="showContextMenu($event, row[entityId])"
              :title="row[column.fieldName] | formatData(column.filter)"
            >
              {{ row[column.fieldName] | formatData(column.filter) }}
            </td>
            <!-- <td class="fixed-right feature" :style="{'z-index': tableData.length - index}" > -->
            <td class="ms-grid-td fixed-right grid-feature">
              <div
                class="feature-item"
                @click="clickEditRow(row[entityId])"
                v-tooltip.auto="'Sửa'"
              >
                <i class="feature-item-icon far fa-edit"></i>
              </div>
              <div
                class="feature-item"
                @click="clickCloneRow(row[entityId])"
                v-tooltip.auto="'Nhân bản'"
              >
                <i class="feature-item-icon far fa-clone"></i>
              </div>
              <div
                class="feature-item"
                @click="clickDeleteRow(row[entityId])"
                v-tooltip.auto="'Xóa'"
              >
                <i class="feature-item-icon far fa-trash-alt"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      <div class="ms-grid-footer-container">
      <table class="ms-grid-table" cellspacing="0">
        <tfoot class="ms-grid-tfoot" v-if="showTableSummary">
          <tr class="ms-grid-summary-row">
            <th class="ms-grid-th fixed-left grid-checkbox"></th>
            <th class="ms-grid-th" :style="tableColumns[0].style">
              Tổng
            </th>
            <th
              v-for="column in tableColumns.slice(1)"
              :key="column.fieldName"
              class="ms-grid-th"
              :style="column.style"
            >
              <!-- {{ column.header }} -->
              {{ tableSummary[column.fieldName] | formatData("decimal") }}
            </th>

            <th class="ms-grid-th fixed-right grid-feature"></th>
          </tr>
        </tfoot>
      </table>
      </div>
      <div
        class="ms-context-menu"
        ref="contextMenu"
        v-show="contextMenuRowId"
        :style="{
          top: contextMenuRect.top,
          right: contextMenuRect.right,
          bottom: contextMenuRect.bottom,
          left: contextMenuRect.left,
        }"
        @blur="closeContextMenu"
      >
        <div
          class="ms-context-menu-item"
          @click="clickEditRow(contextMenuRowId)"
        >
          Sửa
        </div>
        <div
          class="ms-context-menu-item"
          @click="clickCloneRow(contextMenuRowId)"
        >
          Nhân bản
        </div>
        <div
          class="ms-context-menu-item"
          @click="clickDeleteRow(contextMenuRowId)"
        >
          Xóa
        </div>
      </div>
    </div>
    <!-- modal loading -->
    <BaseLoading v-show="isLoading" />
    <!-- thông báo hiển thị khi bảng không có dữ liệu -->
    <div class="grid-notice-empty-data" v-show="isEmpty">
      <img src="../../assets/img/bg_report_nodata.76e50bd8.svg" />
      <span class="no-data-text">Không có dữ liệu</span>
    </div>
  </div>
</template>

<style scoped>
@import "../../css/layout/grid.css";
</style>

<script>
import { CommonFunction } from "../../script/common/common";
import { DATE_DISPLAY_TOKEN } from "../../script/common/config";
import BaseCheckBox from "../base/input/BaseCheckBox.vue";
import BaseLoading from "../base/loading/BaseLoading.vue";
export default {
  components: { BaseLoading, BaseCheckBox },
  props: {
    /**
     * Tên trường id (khóa chính)
     * VD: EmployeeId, CustomerId
     */
    entityId: String,
    /**
     * Danh sách thông tin các cột
     * (tiêu đề, kích thước, style)
     */
    tableColumns: Array,
    /**
     * Danh sách dữ liệu hiển thị
     */
    tableData: Array,
    /**
     * Cờ xác định trang có đang load dữ liệu không:
     * true - loading, false - không
     */
    isLoading: Boolean,
    /**
     * Chỉ số của bản ghi đầu tiên
     */
    startIndex: {
      type: Number,
      default: 0,
    },
    /**
     * Mảng id của row được chọn
     */
    selectedRows: {
      type: Array,
      default: () => [],
    },
    /** Cờ disabled */
    isDisabled: {
      type: Boolean,
      default: false,
      required: false
    },
    showTableSummary: {
      type: Boolean,
      default: false,
      required: false
    },
    tableSummary: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    }
  },
  computed: {
    /**
     * Cờ xác định dữ liệu tableData sau khi load có trống hay không:
     * true - trống | false - không
     */
    isEmpty: function () {
      return (
        !this.isLoading &&
        (this.tableData == undefined ||
          this.tableData == null ||
          this.tableData.length == 0)
      );
    },
    /**
     * Mảng chứa toàn bộ id của các hàng
     */
    rowIds() {
      return this.tableData.map((row) => row[this.entityId]);
    },
  },
  watch: {
    /**
     * Nếu tồn tại bất cứ row nào unselected thì checkAll sẽ false
     */
    selectedRows() {
      if (this.selectedRows.length < this.rowIds.length || this.selectedRows.length === 0) {
        this.checkAll = false;
      } else {
        this.checkAll = true;
      }
    },
    /**
     * TH rowIds thay đổi do filter
     */
    rowIds() {
      if (this.selectedRows.length < this.rowIds.length || this.selectedRows.length === 0) {
        this.checkAll = false;
      } else {
        this.checkAll = true;
      }
    },
    /**
     * Theo dõi trạng thái checkAll
     */
    checkAll() {
      // Nếu checkAll true => select tất cả row
      if (this.checkAll) {
        // this.selectedRows = [...this.rowIds];
        this.$emit("update:selectedRows", [...this.rowIds]);
      }
      // trường hợp tất cả các row đang được select
      // và checkAll false => bỏ select tất cả row
      else if (this.selectedRows.length === this.rowIds.length) {
        // this.selectedRows = [];
        this.$emit("update:selectedRows", []);
      }
    },
  },
  data() {
    return {
      // selectedRows: [], // Danh sách các bản ghi/hàng được chọn
      activeRowId: null, // lưu id của hàng có trạng thái active (khi click vào)
      checkAll: false, // cờ trạng thái select tất cả row hiện tại
      // trick: để ban đầu có thể tính được width, height của context menu
      // cần set 1 giá trị gì đó khác falsy 
      contextMenuRowId: "id",
      contextMenuRect: {
        top: null,
        right: null,
        bottom: null,
        left: null,
        width: null,
        height: null,
      },
    };
  },
  mounted() {
    this.$refs.grid.addEventListener("scroll", this.closeContextMenu);
    document.addEventListener("click", this.closeContextMenu);
    // document.addEventListener('contextmenu', this.closeContextMenu);

    var rectCtxMenu = this.$refs.contextMenu.getBoundingClientRect();
    this.contextMenuRect.width = rectCtxMenu.width;
    this.contextMenuRect.height = rectCtxMenu.height;
    this.contextMenuRowId = null;
  },
  beforeDestroy() {
    // this.$refs.grid.removeEventListener("scroll", this.closeContextMenu);
    document.removeEventListener("click", this.closeContextMenu);
    // document.removeEventListener('contextmenu', this.closeContextMenu);
  },
  methods: {
    /**
     * Phương thức Xử lý sự kiện click nút Sửa
     * @param {String} id khóa chính
     * @author pthieu (19-08-2021)
     */
    clickEditRow: function (id) {
      // Truyền đi sự kiện (lên component cha) với tham số id
      this.$emit("editRow", id);
    },
    /**
     * Phương thức Xử lý sự kiện click nút Xóa
     * @param {String} id khóa chính
     * @author pthieu (19-08-2021)
     */
    clickDeleteRow: function (id) {
      // Truyền đi sự kiện (lên component cha) với tham số id
      var row = this.tableData.find((i) => i[this.entityId] === id);
      this.$emit("deleteRow", row);
    },
    /**
     * Phương thức Xử lý sự kiện click nút Nhân bane
     * @param {String} id khóa chính
     * @author pthieu (19-08-2021)
     */
    clickCloneRow: function (id) {
      // Truyền đi sự kiện (lên component cha) với tham số id
      this.$emit("cloneRow", id);
    },
    /**
     * Phương thức Kiểm tra 1 bản ghi có đang ở trạng thái selected không
     * @param {String} id khóa chính
     * @return {Boolean} true - đang được selected, false - không
     * @author pthieu (16-07-2021)
     */
    isSelected: function (id) {
      return this.selectedRows.indexOf(id) > -1;
    },

    /**
     * Phương thức xử lý khi click vào row
     * @param {event} $event sự kiện click chọn
     * @param {string} rowId id của row
     * @author pthieu (19-08-2021)
     */
    setSelectedRow($event, rowId) {
      this.activeRowId = rowId;
      // this.selectedRows = [rowId];
      $event.stopPropagation();
    },

    /**
     * Phương thức xử lý khi click vào hàng
     * @param {event} $event sự kiện
     * @param {string} rowId khóa chính của hàng
     * @author pthieu (10-09-2021)
     */
    clickRow($event, rowId) {
      // TH: Ctrl + click
      if ($event.ctrlKey) {
        // thêm hàng vừa click vào selectedRows
        this.$emit("update:selectedRows", [...this.selectedRows, rowId]);
      } 
      // TH: Shift + click
      else if ($event.shiftKey) {
        // var firstIndex = this.rowIds.indexOf(this.selectedRows[0]);
        // lấy ra index của hàng đang active (trong mảng rowIds)
        var firstIndex = this.rowIds.indexOf(this.activeRowId);
        // lấy index của hàng vừa chọn (trong mảng rowIds)
        var currentIndex = this.rowIds.indexOf(rowId);
        // xác định cận trên, cận dưới index
        var minIndex = Math.min(firstIndex, currentIndex);
        var maxIndex = Math.max(firstIndex, currentIndex);
        // tạo 1 mảng để lưu các id của các hàng
        // thỏa mãn index nằm trong phạm vi vừa xác định
        var tmpArr = [];
        for (var i = minIndex; i <= maxIndex; i += 1) {
          tmpArr.push(this.rowIds[i]);
        }
        this.$emit("update:selectedRows", [...tmpArr]);
        $event.stopPropagation();
      } else {
        this.$emit("update:selectedRows", [rowId]);
      }
    },

    /**
     * Phương thức hiện context menu
     * @param {event} $event sự kiện
     * @param {string} rowId khóa chính của hàng
     * @author pthieu (10-09-2021)
     */
    showContextMenu($event, rowId) {
      // truyền id cho context menu
      this.contextMenuRowId = rowId;
      // thiết lập vị trí của context menu
      // dựa trên vị trí click, hình bao container
      var rect = this.$el.getBoundingClientRect();
      this.contextMenuRect.top = $event.clientY + "px";
      this.contextMenuRect.left = $event.clientX + "px";
      this.contextMenuRect.right = null;
      this.contextMenuRect.bottom = null;
      // nếu width của context menu + tọa độ X vượt quá biên phải của container
      if (this.contextMenuRect.width + $event.clientX > rect.right) {
        this.contextMenuRect.left =
          $event.clientX - this.contextMenuRect.width + "px";
      }
      // nếu height context menu + tọa độ y vượt quá biên dưới của container
      if (this.contextMenuRect.height + $event.clientY > rect.bottom) {
        this.contextMenuRect.top =
          $event.clientY - this.contextMenuRect.height + "px";
      }
    },
    /**
     * Phương thức đóng context menu
     * @author pthieu (10-9-2021)
     */
    closeContextMenu() {
      // set null để ẩn context menu
      this.contextMenuRowId = null;
      // reset vị trí của context menu
      this.contextMenuRect.top = null;
      this.contextMenuRect.right = null;
      this.contextMenuRect.bottom = null;
      this.contextMenuRect.left = null;
    },
  },
  filters: {
    /**
     * Định dạng hiển thị dữ liệu
     * @param {*} value giá trị dữ liệu cần định dạng
     * @param {string} filterType kiểu định dạng
     * @returns {*} dữ liệu sau định dạng
     * @author pthieu (14-07-2021)
     */
    formatData: function (value, filterType) {
      switch (filterType) {
        case "date":
          return CommonFunction.formatDate(value, DATE_DISPLAY_TOKEN);
        case "decimal":
          return CommonFunction.formatDecimalNumber(value);
        default:
          return value;
      }
    },
  },
};
</script>