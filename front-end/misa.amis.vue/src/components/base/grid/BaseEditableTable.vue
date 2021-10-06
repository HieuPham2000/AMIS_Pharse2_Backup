<template>
  <div class="ms-editable-grid-container">
    <div class="ms-grid">
      <table class="ms-grid-table" cellspacing="0">
        <!-- Hàng tiêu đề các cột trong bảng -->
        <thead class="ms-grid-thead">
          <tr>
            <th class="ms-grid-th outer-left"></th>
            <th class="ms-grid-th fixed-left row-index">#</th>

            <th
              v-for="column in tableColumns"
              :key="column.header"
              class="ms-grid-th"
              :style="column.style"
              :title="column.title"
            >
              {{ column.header }}
            </th>

            <th class="ms-grid-th fixed-right row-feature"></th>
            <th class="ms-grid-th outer-right"></th>
          </tr>
        </thead>

        <!-- Nội dung bảng -->
        <tbody class="ms-grid-tbody">
          <tr
            v-for="(row, rowIndex) in myTableData"
            :key="rowIndex"
            :class="['ms-grid-row', { active: activeRowIndex == rowIndex }]"
            @click="setSelectedRow($event, rowIndex)"
            @focusin="setSelectedRow($event, rowIndex)"
          >
            <td class="ms-grid-td outer-left"></td>
            <td class="ms-grid-td fixed-left row-index">{{ rowIndex + 1 }}</td>
            <!-- Các ô khác -->
            <td
              v-for="(column, colIndex) in tableColumns"
              :key="colIndex"
              class="ms-grid-td ms-editable-cell"
              :style="column.style"
              :class="{'ms-editable-cell-cbx': column.type === 'cbxTable', 'disabled': column.disabled}"
            >
              <BaseTextInput 
                v-if="column.type === 'text'"
                v-model="row[column.fieldName]"
                :ref="column.fieldName"
                :displayName="column.title || column.header"
                :isRequired="column.required"
                :showErrorIcon="true"
                :isDisabled="column.disabled"
                :showError="(msg) => showError(msg)"
              />
              <BaseDecimalInput 
                v-else-if="column.type === 'decimal'"
                v-model="row[column.fieldName]"
                :ref="column.fieldName"
                :displayName="column.title || column.header"
                :isRequired="column.required"
                :showErrorIcon="true"
                :isDisabled="column.disabled"
                :showError="(msg) => showError(msg)"
              />
              <BaseCbxTableDropdown 
                v-else-if="column.type === 'cbxTable'"
                v-model="row[column.fieldName]"
                :ref="column.fieldName"
                @input="row[column.referenceFieldName] = getReferenceData(cbxData[column.fieldName], column.cbxDataId, row[column.fieldName], column.referenceDataName)"
                :displayName="column.title || column.header"
                :tableColumns="column.tableColumns"
                :comboboxData="cbxData[column.fieldName]"
                :dataId="column.cbxDataId"
                :dataName="column.cbxDataName"
                :isRequired="column.required"
                :showErrorIcon="true"
                :isDisabled="column.disabled"
                :showError="(msg) => showError(msg)"
              />
            </td>
            <td class="ms-grid-td fixed-right row-feature" @click="$event.stopPropagation()">
              <div
                class="ms-icon ms-icon-16 ms-icon-delete"
                @click="deleteRow(rowIndex)"
              ></div>
            </td>
            <td class="ms-grid-td outer-right"></td>
          </tr>
        </tbody>
        <tfoot class="ms-grid-tfoot">
          <tr class="ms-grid-summary-row">
            <th class="ms-grid-th outer-left"></th>
            <th class="ms-grid-th fixed-left row-index"></th>

            <th
              v-for="column in tableColumns"
              :key="column.fieldName"
              class="ms-grid-th"
              :style="column.style"
            >
              {{ summary[column.fieldName] | formatData("decimal") }}
            </th>

            <th class="ms-grid-th fixed-right row-feature"></th>
            <th class="ms-grid-th outer-right"></th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import "../../../css/layout/grid2.css";
@import "../../../css/common/editable-table.css";
</style>

<script>
import { CommonFunction } from "../../../script/common/common";
import BaseTextInput from '../BaseTextInput.vue';
import BaseDecimalInput from '../input/BaseDecimalInput.vue';
import BaseCbxTableDropdown from '../combobox/BaseCbxTableDropdown.vue';
import { DECIMAL_MASK } from "../../../script/common/config";
export default {
  components: { BaseTextInput, BaseDecimalInput, BaseCbxTableDropdown },
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
    // Dữ liệu cho các ô combobox
    cbxData: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    },
    // Dữ liệu summary của table
    tableSummary: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    // Hàm showError truyền cho input
    showError: {
      type: Function,
      required: false,
      default: () => {}
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
     * Object summary 
     */
    summary() {
      var res = {};
      // duyệt danh sách cột
      // tìm các cột có trường summary
      this.tableColumns.forEach((col) => {
        if (col.summary) {
          res[col.fieldName] = 0;
        }
      });
      // duyệt dữ liệu các hàng để tính summary cho các cột
      this.myTableData.forEach((row) => {
        Object.keys(res).forEach((key) => {
          res[key] += parseInt(row[key]) || 0;
        });
      });
      // emit để đồng bộ dữ liệu với prop tableSummary
      this.$emit("update:tableSummary", res);

      return res;
    },
  },
  data() {
    return {
      // mask ô input decimal
      decimalMask: DECIMAL_MASK,
      // dữ liệu nội bộ (để v-model)
      // đồng bộ với tableData
      myTableData: [],
      // lưu id của hàng có trạng thái active (khi click vào)
      activeRowIndex: 0
    };
  },
  created() {
    // đồng bộ myTableData
    this.myTableData = JSON.parse(JSON.stringify(this.tableData));
  },
  watch: {
    // Theo dõi myTableData
    // Cập nhật để đồng bộ với prop tableData
    myTableData: {
      deep: true,
      handler() {
        this.$emit("update:tableData", this.myTableData);
      },
    },
  },
  methods: {
    /**
     * Phương thức lấy giá trị cho trường tham chiếu
     * @param {Array} cbxData dữ liệu combobox
     * @param {String} cbxDataId tên trường id
     * @param {*} id giá trị id
     * @param {String} referenceDataName tên trường tham chiếu, cần lấy giá trị 
     * @returns {*} giá trị dữ liệu tham chiếu
     * @author pthieu (03-10-2021)
     */
    getReferenceData(cbxData, cbxDataId, id, referenceDataName) {
      var item = cbxData.find((item) => item[cbxDataId] == id);
      if(item) {
        return item[referenceDataName];
      }
    },
    /**
     * Phương thức xử lý xóa tất cả hàng
     * @author pthieu (28-09-2021)
     */
    deleteAllRows() {
      this.myTableData = [];
      this.activeRowIndex = null;
    },
    /**
     * Phương thức xử lý thêm hàng mới
     * @author pthieu (28-09-2021)
     */
    addNewRow() {
      var len = this.myTableData.length;
      if (len > 0) {
        var newRow = Object.assign({}, this.myTableData[len - 1]);
        this.myTableData.push(newRow);
        this.activeRowIndex = len;
      } else {
        this.myTableData.push({});
        this.activeRowIndex = 0;
      }
    },
    /**
     * Phương thức xử lý xóa hàng theo index
     * @param {Number} index index của hàng
     * @author pthieu (28-09-2021)
     */
    deleteRow(index) {

      this.myTableData = [
        ...this.myTableData.slice(0, index),
        ...this.myTableData.slice(index + 1),
      ];
      this.activeRowIndex = null;
    },

    /**
     * Phương thức xử lý khi click vào row
     * @param {event} $event sự kiện click chọn
     * @param {string} rowIndex index của row
     * @author pthieu (19-08-2021)
     */
    setSelectedRow($event, rowIndex) {
      this.activeRowIndex = rowIndex;
      // TODO
      // $event.stopPropagation();
    },
    /**
     * Phương thức thực hiện validate các ô input
     * @returns {*} ô input đầu tiên bị lỗi
     * @author pthieu (02-10-2021)
     */
    validateAllInputs() {
      var firstCellError = null;
      for (var name in this.$refs) {
        this.$refs[name].forEach((cell) => {
          if (
          typeof cell.validateInput == "function" &&
          !cell.validateInput() &&
          !firstCellError
          ) {
            firstCellError = cell;
          }
        });
      }
      return firstCellError;
    }
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
          return CommonFunction.formatDate(value);
        case "decimal":
          return CommonFunction.formatDecimalNumber(value);
        default:
          return value;
      }
    },
  },
};
</script>