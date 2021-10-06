<template>
  <div class="page">
    <EmployeeDetail
      v-if="showForm"
      :key="formKey"
      :status="status"
      :dataEmployee="dataEmployee"
      :departments="departments"
      @reOpenForm="openFormAdd"
      @closeForm="closeFormModal"
      @reloadTableData="loadTableData"
    />

    <BasePopUp v-show="showPopUpDelete">
      <template v-slot:icon>
        <div class="ms-icon ms-icon-48 ms-icon-warning-triangle"></div>
      </template>
      <template v-slot:message>
        <span>{{ popupDeleleMsg }}</span>
      </template>
      <template v-slot:footer-left>
        <BaseButton
          type="text"
          classAttr="ms-btn-secondary"
          @clickBtn="closePopUpDelete"
        >
          Không
        </BaseButton>
      </template>
      <template v-slot:footer-right>
        <BaseButton
          type="text"
          classAttr="ms-btn-primary"
          @clickBtn="clickBtnConfirmDelete"
        >
          Có
        </BaseButton>
      </template>
    </BasePopUp>
    <div class="page-header">
      <div class="page-header-title">Nhân viên</div>
      <div class="page-header-feature">
        <BaseButton
          type="text"
          classAttr="ms-btn-primary"
          :isDisabled="isLoading"
          @clickBtn="openFormAdd"
        >
          Thêm mới nhân viên
        </BaseButton>
      </div>
    </div>

    <div class="page-content">
      <div class="toolbar">
        <BaseSearchBox
          placeholder="Tìm theo mã, tên, số điện thoại"
          v-model="employeeSearch"
          maxlength="255"
        />
        <div class="ms-flex-space"></div>
        <BaseButton
          type="icon"
          class="toolbar-btn-icon"
          v-tooltip.auto="'Lấy lại dữ liệu'"
          :isDisabled="isLoading"
          @clickBtn="clickBtnRefresh"
        >
          <div class="ms-icon ms-icon-24">
            <i class="fas fa-redo"></i>
          </div>
        </BaseButton>
        <BaseButton
          type="icon"
          class="toolbar-btn-icon"
          v-tooltip.auto="'Xóa các bản ghi đã chọn'"
          :isDisabled="isLoading"
          @clickBtn="clickBtnDeleteMany"
        >
           <div class="ms-icon ms-icon-24">
            <i class="fas fa-trash-alt"></i>
           </div>
        </BaseButton>
      </div>

      <div class="main-content">
        <TheGrid
          :entityId="entityId"
          :tableColumns="tableColumns"
          :tableData="tableData"
          :isLoading="isLoading"
          :selectedRows.sync="selectedEmployeeIds"
          :isDisabled="isLoading"
          @editRow="openFormEdit"
          @deleteRow="openPopUpDeleteOne"
          @cloneRow="openFormClone"
        />

        <ThePagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          :startRecord="startRecord"
          :totalRecords="totalRecords"
          :pageSize="pageSize"
          :pageSizeSelectItems="pageSizeSelectItems"
          :isDisabled="isLoading"
          @changePage="onChangePage"
          @changePageSize="onChangePageSize"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("../../css/common/common.css");
@import url("../../css/common/input.css");
@import url("../../css/layout/toolbar.css");
</style>

<script>
import mixinEmployeePage from "../../mixins/page/employee/employee-page";
import { DATA_ACTION } from "../../script/common/constant";
import { PAGE_SIZE_SELECT_ITEMS } from "../../script/common/constant";
import employeeApi from "../../api/components/employee-api";
import departmentApi from "../../api/components/department-api";

import BaseSearchBox from "../../components/base/seachbox/BaseSearchBox.vue";
import TheGrid from "../../components/layout/TheGrid.vue";
import ThePagination from "../../components/layout/ThePagination.vue";
import BaseButton from "../../components/base/button/BaseButton.vue";
import EmployeeDetail from "./EmployeeDetail.vue";
import BasePopUp from "../../components/base/popup/BasePopUp.vue";
import { CommonFunction } from "../../script/common/common";
import { resources } from '../../script/common/resources';

export default {
  components: {
    TheGrid,
    ThePagination,
    BaseButton,
    BaseSearchBox,
    EmployeeDetail,
    BasePopUp,
  },

  // thêm một số dữ liệu
  // - Danh sách các cột trong bảng, tên trường khóa chính
  // - câu thông báo cho pop up xóa
  mixins: [mixinEmployeePage],

  props: {
    // cờ trạng thái thu hẹp/mở rộng chiều rộng của page
    // true - mở rộng, fasle - thu hẹp
    expand: Boolean,
  },
  data() {
    return {
      // dữ liệu danh sách nhân viên truyền cho table
      tableData: [],

      // liên quan đến form thông tin chi tiết
      // key set cho component EmployeeDetail
      formKey: 0,
      // cờ chỉ định ẩn/hiển form
      showForm: false,
      // dữ liệu nhân viên cụ thể (dùng để binding lên form)
      dataEmployee: {},
      // trạng thái hành động: thêm mới (add), chỉnh sửa (edit)
      status: DATA_ACTION.ADD,

      // liên quan search box
      // giá trị tìm kiếm
      employeeSearch: "",

      // liên quan đến combobox
      // dữ liệu danh sách phòng ban
      departments: [],

      // liên quan paging
      // cấu hình paging
      doPaging: true,
      // trang hiện tại
      currentPage: 1,
      // tổng số trang
      totalPages: 0,
      // tổng số bản ghi
      totalRecords: 0,
      // số bản ghi/trang
      pageSize: 20,
      // các options cho selectbox chọn số bản ghi/trang
      pageSizeSelectItems: PAGE_SIZE_SELECT_ITEMS,

      // cờ xác định trạng thái loading dữ liệu của trang
      // true - đang load dữ liệu, false - đã load xong
      isLoading: false,

      // thông tin của nhân viên cần xóa
      deleteEmployeeInfo: null,
      // mảng nhân viên được chọn
      selectedEmployeeIds: [],
      // popup delete
      showPopUpDelete: false,
      popupDeleleMsg: null,
      actionDelete: () => {},
    };
  },
  created() {
    // Tiến hành load dữ liệu danh sách nhân viên cho table
    this.loadTableData();

    // Load dữ liệu cho các combobox
    this.loadComboboxData();
  },

  computed: {
    /**
     * Tính ra index của bản ghi đầu tiên (bắt đầu từ 0)
     * VD: ở trang 2, kích thước là 20 bản ghi/trang => bản ghi đầu tiên có index = 20
     */
    startRecord: function () {
      return (this.currentPage - 1) * this.pageSize;
    }
  },

  watch: {
    /**
     * Theo dõi id phòng ban (filter), vị trí/chức vụ (filter), giá trị tìm kiếm (search)
     * Và gọi hàm load để lấy về danh sách nhân viên tương ứng
     * truyền true => trở về trang 1
     */
    employeeSearch: function () {
      this.loadTableData(true);
    },
  },
  methods: {
    //#region form
    /**
     * Phương thức ép re render lại form
     * @author pthieu (21-08-2021)
     */
    reRenderForm() {
      // this.showForm = false;
      // this.$nextTick(() => this.showForm = true);
      this.formKey++;
    },
    /**
     * Phương thức mở form
     * @author pthieu (17-07-2021)
     */
    openFormModal: function () {
      this.showForm = true;
    },
    /**
     * Phương thức đóng form
     * @author pthieu (17-07-2021)
     */
    closeFormModal: function () {
      this.showForm = false;
      this.formKey = 0;
    },
    /**
     * Phương thức hiển thị thông báo lỗi dựa trên response phía server
     * @param {object} error lỗi trả về từ phía server
     * @author pthieu (09-08-2021)
     */
    showServerResponseError(error) {
      var response = error.response;
      // Lỗi kết nối
      if(error.isAxiosError && !response) {
        this.$toast("error", resources.vi.toastMsg.errorNetworkError);
      } else if (
        response &&
        (response.status == 400 || response.status == 500) &&
        response.data.UserMsg
      ) {
        // dựa vào thông tin lỗi trả về để hiện thông báo cho người dùng
        this.$toast("error", response.data.UserMsg);
      } else {
        this.$toast("error", resources.vi.toastMsg.errorGeneral);
        console.log(error);
      }
    },
    /**
     * Phương thức mở form thêm nhân viên mới
     * @author pthieu (17-07-2021)
     */
    openFormAdd: function () {
      // set cờ trạng thái đang loading dữ liệu
      this.isLoading = true;
      // gọi api lấy mã nhân viên mới tự động
      employeeApi
        .getNewEmployeeCode()
        .then((res) => {
          switch (res.status) {
            case 200:
              // gán dữ liệu lấy được cho EmployeeCode
              // dataEmployee sẽ được truyền cho form để binding dữ liệu
              this.dataEmployee = { EmployeeCode: res.data };
              break;
            case 204:
              this.dataEmployee = { EmployeeCode: null };
              break;
          }
          // hiện form
          if (!this.showForm) {
            // set cờ ở trạng thái "thêm mới" (ADD)
            this.status = DATA_ACTION.ADD;
            this.openFormModal();
          } else {
            // set cờ ở trạng thái "thêm mới" (ADD)
            this.status = DATA_ACTION.SAVE_AND_ADD;
            this.reRenderForm();
          }
        })
        .catch((error) => {
          this.showServerResponseError(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    /**
     * Phương thức mở form nhân bản nhân viên
     * @param {string} employeeId khóa chính
     * @author pthieu (19-08-2021)
     */
    openFormClone: function (employeeId) {
      // set cờ trạng thái đang loading dữ liệu
      this.isLoading = true;
      // set cờ ở trạng thái "thêm mới" (ADD)
      this.status = DATA_ACTION.ADD;

      // gọi api lấy mã nhân viên mới tự động
      employeeApi
        .getCloneEmployeeById(employeeId)
        .then((res) => {
          switch (res.status) {
            case 200:
              // gán dữ liệu lấy được cho dataEmployee để binding lên form
              this.dataEmployee = res.data.Data;
              this.openFormModal();
              break;
            case 204:
              this.$toast("error", resources.vi.toastMsg.getNoData);
              this.loadTableData();
              break;
          }
        })
        .catch((error) => {
          this.showServerResponseError(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    /**
     * Phương thức mở form chỉnh sửa thông tin nhân viên
     * @param {string} employeeId khóa chính
     * @author pthieu (17-07-2021)
     */
    openFormEdit: function (employeeId) {
      // set cờ trạng thái đang loading dữ liệu
      this.isLoading = true;
      // set cờ ở trạng thái "chỉnh sửa" (EDIT)
      this.status = DATA_ACTION.EDIT;
      // gọi api lấy dữ liệu nhân viên theo khóa chính
      employeeApi
        .getEntityById(employeeId)
        .then((res) => {
          switch (res.status) {
            case 200:
              // gán dữ liệu lấy được cho dataEmployee để binding lên form
              this.dataEmployee = res.data.Data;
              this.openFormModal();
              break;
            case 204:
              this.$toast("error", resources.vi.toastMsg.getNoData);
              this.loadTableData();
              break;
          }
        })
        .catch((error) => {
          this.showServerResponseError(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    //#endregion
    
    //#region load dữ liệu table, combobox
    /**
     * Phương thức xử lý khi ấn btn refresh
     * @author pthieu (13-09-2021)
     */
    clickBtnRefresh() {
      this.loadTableData(true);
      this.loadComboboxData();
    },
    /**
     * Phương thức load dữ liệu danh sách nhân viên
     * (kèm theo tiêu chí phân trang, filter, search)
     * @param {Boolean} goToFirstPage
     * true - trở về trang 1, false (mặc định) - giữ nguyên trang hiện tại
     * @author pthieu (28-07-2021)
     */
    loadTableData: function (goToFirstPage = false) {
      // set cờ trạng thái đang loading dữ liệu
      this.isLoading = true;

      // reset các bản ghi được chọn
      this.selectedEmployeeIds = [];

      // dựa trên tham số đầu vào
      // true - trở về trang 1, false - giữ nguyên trang hiện tại
      if (goToFirstPage) {
        this.currentPage = 1;
      }

      // gọi api lấy danh sách nhân viên theo các tiêu chí phân trang, lọc, tìm kiếm
      employeeApi
        .getEmployeesFilterPaging(
          this.pageSize,
          this.startRecord,
          this.employeeSearch
        )
        .then((res) => {
          if (res.status === 200) {
              var result = res.data.Data;
              this.totalPages = result.TotalPages;
              this.totalRecords = result.TotalRecords;
              this.tableData = result.Data;
              // TH không có bản ghi phù hợp:
              // TotalPages = 0, TotalRecords = 0, Data = []
              if( this.totalRecords == 0) {
                this.totalPages = 0;
                this.tableData = []
              }

              // TEST: THợp xóa ở trang cuối dẫn đến làm giảm totalPages
              // Vấn đề: làm như bên dưới sẽ call lại api
              if(this.totalPages != 0 && this.currentPage > this.totalPages) {
                this.onChangePage(this.totalPages);
              }
          }
        })
        .catch((error) => {
          this.showServerResponseError(error);
        })
        .finally(() => {
          // tắt cờ loading
          // timeout 600ms để có thời gian cho modal loading hiển thị
          // (TH load dữ liệu quá nhanh, modal vừa xuất hiện lại biến mất ngay => xấu)
          setTimeout(() => (this.isLoading = false), 1000);
        });
    },
    /**
     * Phương thức load dữ liệu combobox
     * @author pthieu (28-07-2021)
     */
    loadComboboxData: function () {
      // lấy danh sách phòng ban
      departmentApi
        .getAllEntities()
        .then((res) => {
          this.departments = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //#endregion

    //#region thay đổi page, page size
    /**
     * Phương thức xử lý sự kiện thay đổi trang
     * @param {Number} page trang chuyển đến
     * @author pthieu (31-07-2021)
     */
    onChangePage(page) {
      this.currentPage = page;
      this.loadTableData();
    },

    /**
     * Phương thức xử lý sự kiện thay đổi số bản ghi/trang
     * @param {Number} pageSize số bản ghi/trâng
     * @author pthieu (31-07-2021)
     */
    onChangePageSize(pageSize) {
      this.pageSize = pageSize;
      // về trang đầu + load dữ liệu
      this.loadTableData(true);
    },
    //#endregion

    //#region xóa nhân viên
    /** Phương thức xử lý khi ấn vào btn xóa nhiều
     * @author pthieu (12-09-2021)
     */
    clickBtnDeleteMany() {
      if(this.selectedEmployeeIds.length === 0) {
        this.$toast("error", resources.vi.toastMsg.deleteNoSelectedRecord);
      } else if (this.selectedEmployeeIds.length === 1) {
        var selectedId = this.selectedEmployeeIds[0];
        var employee = this.tableData.find(i => i.EmployeeId === selectedId);
        this.openPopUpDeleteOne(employee);
      } else {
        this.openPopUpDeleteMany();
      }
    },

    /** Phương thức đóng popup xóa nhân viên
     * @author pthieu (20-08-2021)
     */
    closePopUpDelete() {
      this.showPopUpDelete = false;
      this.popupDeleleMsg = null;
    },

    /** Phương thức hiện popup xóa nhân viên
     * @param {object} row dữ liệu của row muốn xóa
     * @author pthieu (20-08-2021)
     */
    openPopUpDeleteOne(row) {
      // this.deleteEmployeeInfo = JSON.parse(JSON.stringify(row));
      this.popupDeleleMsg = CommonFunction.formatString(
        resources.vi.entity.employee.popUpDeleteMsg,
        row.EmployeeCode,
        row.EmployeeName
      );
      this.actionDelete = this.deleteEmployee.bind(this, row.EmployeeId);
      this.showPopUpDelete = true;
    },

    /** Phương thức hiện popup xóa nhân viên
     * @param {object} row dữ liệu của row muốn xóa
     * @author pthieu (12-09-2021)
     */
    openPopUpDeleteMany() {
      this.actionDelete = this.deleteManyEmployees;
      this.popupDeleleMsg = CommonFunction.formatString(resources.vi.entity.employee.popUpDeleteManyMsg, this.selectedEmployeeIds.length);
      this.showPopUpDelete = true;
    },

    /**
     * Phương thức xử lý khi ấn nút Có trong popup delete
     * @author pthieu (12-09-2021)
     */
    clickBtnConfirmDelete() {
      this.closePopUpDelete();
      this.actionDelete();
    },

    /**
     * Phương thức xóa nhân viên
     * @param {string} employeeId khóa chính của row muốn xóa
     * @author pthieu (21-07-2021)
     */
    deleteEmployee: function (employeeId) {
      this.isLoading = true;
      // var employeeId = this.deleteEmployeeInfo.EmployeeId;
      // this.deleteEmployeeInfo = null;

      employeeApi
        .deleteEntity(employeeId)
        .then((res) => {
          if(res.status === 200) {
            if(res.data.Data > 0) {
              this.$toast("success", res.data.UserMsg);
            } else {
              this.$toast("error", res.data.UserMsg);
            }
          }
        })
        .catch((error) => {
          this.showServerResponseError(error);
        })
        .finally(() => {
          // Luôn load lại dữ liệu
          this.loadTableData();
          // this.isLoading = false;
        });
    },

    /**
     * Phương thức xóa nhiều nhân viên
     * @author pthieu (10-09-2021)
     */
    deleteManyEmployees: function () {
      this.closePopUpDelete();
      employeeApi
        .deleteManyEntities(this.selectedEmployeeIds)
        .then((res) => {
          if(res.status === 200) {
            if(res.data.Data > 0) {
              this.$toast("success", res.data.UserMsg);
            } else {
              this.$toast("error", res.data.UserMsg);
            }
          }
        })
        .catch((error) => {
          this.showServerResponseError(error);
        })
        .finally(() => {
          // Luôn load lại dữ liệu
          this.loadTableData();
          // reset hàng được chọn
          this.selectedEmployeeIds = [];
          // this.isLoading = false;
        });
    },
    //#endregion
  },
};
</script>
