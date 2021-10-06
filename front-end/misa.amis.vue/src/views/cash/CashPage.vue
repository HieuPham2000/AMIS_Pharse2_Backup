<template>
  <div class="page">
    <CashPaymentDetail
      :tableData.sync="tableData"
      v-if="showForm"
      :key="formKey"
      :status="status"
      :recordData="recordData"
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
      <div class="page-header-title">Thu chi tiền mặt</div>
    </div>
    <div class="page-content">
      <div class="toolbar">
        <BaseSearchBox 
          placeholder="Nhập từ khóa tìm kiếm" 
          v-model="keywordSearch"
          maxlength="255" 
        />
        <BaseBtnDropdownSecondary class="toolbar-btn-filter" :isDisabled="isLoading" ref="btnFilter">
          <template v-slot:btn-name>Lọc</template>
          <template v-slot:dropdown-content>
            <div class="dropdown-body">
              <div class="row">
                <div class="row-item">
                  <div class="ms-input-label">Lý do thu, chi</div>
                  
                  <BaseCombobox 
                    v-model="reasonFilterValue" 
                    :isDisabled="true" 
                    :comboboxData="reasonFilterCbxData" 
                    dataId="id"
                    dataName="text"
                  />
                </div>
              </div>
              <div class="row">
                <div class="row-item">
                  <div class="ms-input-label">Trạng thái ghi sổ</div>
                  
                  <BaseCombobox 
                    v-model="statusFilterValue" 
                    :isDisabled="true" 
                    :comboboxData="statusFilterCbxData" 
                  />
                </div>
              </div>
              <div class="row">
                <div class="row-item">
                  
                  <div class="ms-input-label">Thời gian</div>
                  <BaseCombobox 
                    class="date-filter-cbx" 
                    v-model="dateFilterValue" 
                    displayName="Thời gian" 
                    :comboboxData="dateFilterCbxData" 
                  />
                </div>
                <div class="row-item">
                  
                  <div class="ms-input-label">Từ ngày</div>
                  <BaseDatePickerInput v-model="dateFrom" :isFutureDisabled="false"/>
                </div>
                <div class="row-item">
                  <div class="ms-input-label">Đến ngày</div>
                  <BaseDatePickerInput v-model="dateTo" :isFutureDisabled="false"/>
                </div>
              </div>
            </div>
            <div class="dropdown-footer">
              <BaseButton type="text" classAttr="ms-btn-secondary" @clickBtn="[resetFilter()]">
                Đặt lại
              </BaseButton>
              <div class="ms-flex-space"></div>
              <BaseButton type="text" classAttr="ms-btn-primary" @clickBtn="[closeBtnFilterDropdown(), doFilter()]">
                Lọc
              </BaseButton>
            </div>
          </template>
        </BaseBtnDropdownSecondary>
        <div class="filter-list-container">
          <div  v-for="i in filterArr"  :key="i.text" class="filter-list-item" :class="{'clearable': i.clearable}" >
            <span>{{ i.text }}</span>
            <div v-show="i.clearable" class="btn-remove ms-icon ms-icon-16 ms-icon-close-small"></div>
          </div>
        </div>
        <div class="ms-flex-space"></div>
        <BaseButton 
          type="text" 
          classAttr="ms-btn-primary" 
          :isDisabled="isLoading"
          @clickBtn="openFormAdd">
          Thêm chi tiền
        </BaseButton>
        <BaseButton
          type="icon"
          class="toolbar-btn-icon"
          v-tooltip.auto="'Lấy lại dữ liệu'"
          :isDisabled="isLoading"
          @clickBtn="clickBtnRefresh"
        >
          <div class="ms-icon ms-icon-24 ms-icon-refresh"></div>
        </BaseButton>
        <BaseButton
          type="icon"
          class="toolbar-btn-icon"
          v-tooltip.auto="'Xuất ra Excel'"
          :isDisabled="isLoading"
        >
          <div class="ms-icon ms-icon-24 ms-icon-excel"></div>
        </BaseButton>
      </div>

      <div class="main-content">
        <TheGrid
          :entityId="entityId"
          :tableColumns="tableColumns"
          :tableData="tableData"
          :isLoading="isLoading"
          :selectedRows.sync="selectedRecordIds"
          :isDisabled="isLoading"
          :showTableSummary="true"
          :tableSummary="tableSummary"
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

<script>
import BaseButton from "../../components/base/button/BaseButton.vue";
import BaseSearchBox from "../../components/base/seachbox/BaseSearchBox.vue";
import BaseCombobox from "../../components/base/combobox/BaseCombobox.vue";
import BaseDatePickerInput from "../../components/base/input/BaseDatePickerInput.vue";
import BaseBtnDropdownSecondary from "../../components/base/button/BaseBtnDropdownSecondary.vue";
import BasePopUp from "../../components/base/popup/BasePopUp.vue";
import TheGrid from "../../components/layout/TheGrid.vue";
import ThePagination from "../../components/layout/ThePagination.vue";
import CashPaymentDetail from "./CashPaymentDetail.vue";
import mixinCashPage from "../../mixins/page/cash/cash-page";
import { DATA_ACTION } from "../../script/common/constant";
import { PAGE_SIZE_SELECT_ITEMS } from "../../script/common/constant";
import receiptPaymentApi from "../../api/components/receipt-payment-api";
import { CommonFunction } from "../../script/common/common";
import { DATE_CONST } from "../../script/common/constant";
import { resources } from "../../script/common/resources";
export default {
  components: {
    BaseSearchBox,
    BaseButton,
    TheGrid,
    ThePagination,
    CashPaymentDetail,
    BaseBtnDropdownSecondary,
    BaseCombobox,
    BaseDatePickerInput,
    BasePopUp,
  },
  mixins: [mixinCashPage],
  props: {
    // cờ trạng thái thu hẹp/mở rộng chiều rộng của page
    // true - mở rộng, fasle - thu hẹp
    expand: Boolean,
  },
  data() {
    return {
      // dữ liệu danh sách truyền cho table
      tableData: [],

      // liên quan đến form chi tiết
      // key set cho component Detail
      formKey: 0,
      // cờ chỉ định ẩn/hiển form
      showForm: false,
      // dữ liệu bản ghi cụ thể (binding lên form)
      recordData: {},
      // trạng thái hành động: thêm mới (add), chỉnh sửa (edit)
      status: DATA_ACTION.ADD,

      // liên quan search box
      // giá trị tìm kiếm
      keywordSearch: "",

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

      // mảng bản ghi được chọn
      selectedRecordIds: [],
      // popup delete
      showPopUpDelete: false,
      popupDeleleMsg: null,
      actionDelete: () => {},

      // mảng chứa các thông tin lọc
      filterArr: [],
      // giá trị Thời gian (lọc theo thời gian)
      // dateFilterValue: DATE_CONST.BEGINNING_YEAR_TO_PRESENT,
      dateFilterValue: DATE_CONST.ALL,
      // giá trị Từ ngày (lọc theo thời gian)
      dateFrom: null,
      // giá trị Đến ngày (lọc theo thời gian)
      dateTo: null,
      // giá trị Trạng thái ghi sổ (lọc)
      statusFilterValue: null,
      // giá trị Lý do thu/chi (lọc)
      reasonFilterValue: null,
      // dữ liệu summary của grid
      tableSummary: {
        // trường cần hiển thị summary 
        "TotalAmount": 0,
      }
    };
  },
  created() {
    // load giá trị Từ ngày, Đến ngày (lọc) theo giá trị Thời gian (lọc)
    [this.dateFrom, this.dateTo] = CommonFunction.getRangeDate(this.dateFilterValue);
    // khởi tạo mảng chứa thông tin lọc
    this.filterArr = [
      {type: "date", text: this.dateFilterValue, clearable: false},
    ];

    // Load danh sách bản ghi cho table
    this.loadTableData();
  },

  computed: {
    /**
     * Tính ra index của bản ghi đầu tiên (bắt đầu từ 0)
     * VD: ở trang 2, kích thước là 20 bản ghi/trang => bản ghi đầu tiên có index = 20
     */
    startRecord: function () {
      if(this.currentPage > 0) {
        return (this.currentPage - 1) * this.pageSize;
      }
      return 0;
    },
  },

  watch: {
    /**
     * Theo dõi từ khóa tìm kiếm (search)
     * Và gọi hàm load để lấy về danh sách dữ liệu tương ứng
     * truyền true => trở về trang 1
     */
    keywordSearch: function() {
      this.loadTableData(true);
    },
    /**
     * Theo dõi giá trị combobox thời gian
     * => thực hiện thay đổi range date (từ ngày, đến ngày)
     */
    dateFilterValue: function() {
      this.changeDateRangeFilter();
    },
    /**
     * Theo dõi giá trị "Từ ngày"
     * => thực hiện thay đổi cbx Thời gian cho khớp
     */
    dateFrom: function() {
      this.autoChangeDateFilterValue();
    },
    /**
     * Theo dõi giá trị "Đến ngày"
     * => thực hiện thay đổi cbx Thời gian cho khớp
     */
    dateTo: function() {
      this.autoChangeDateFilterValue();
    },

  },
  methods: {
    //#region btn filter
    /**
     * Phương thức xử lý việc reset các giá trị lọc về mặc định
     * @author pthieu (24-09-2021)
     */
    resetFilter() {
      // this.dateFilterValue = DATE_CONST.BEGINNING_YEAR_TO_PRESENT;
      this.dateFilterValue = DATE_CONST.ALL;
    },
    /**
     * Phương thức xử lý hành động Lọc
     * @author pthieu (24-09-2021) 
     */
    doFilter() {
      // load dữ liệu (trang đầu)
      this.loadTableData(true);
      // cập nhật mảng thông tin lọc
      // var dateFilterText = this.dateFilterValue;
      // if(this.dateFilterText == DATE_CONST.OPTION ) {
        
      //   this.dateFilterText = `${CommonFunction.formatDate(this.dateFrom)}`
      // }
      this.filterArr = [
        // {type: "date", text: this.dateFilterValue, clearable: true},
        {type: "date", text: this.dateFilterValue, clearable: false},
      ];
    },
    /**
     * Phương thức xử lý việc đóng dropdown của btn filter
     * @author pthieu (24-09-2021) 
     */
    closeBtnFilterDropdown() {
      this.$refs.btnFilter.closeDropdown();
    },
    /**
     * Phương thức xử lý việc tự động thay đổi giá trị dateFrom, dateTo
     * theo giá trị dateFilterValue
     * @author pthieu (24-09-2021) 
     */
    changeDateRangeFilter() {
      // nếu giá trị Thời gian khác "Tùy chọn"
      // cập nhật giá trị Từ ngày, Đến ngày tương ứng với Thời gian
      if(this.dateFilterValue && this.dateFilterValue != DATE_CONST.OPTION) {
        [this.dateFrom, this.dateTo] = CommonFunction.getRangeDate(this.dateFilterValue);
      }
    },
    /**
     * Phương thức xử lý việc tự động thay đổi giá trị text dateFilterValue
     * theo giá trị dateFrom, dateTo
     * @author pthieu (24-09-2021) 
     */
    autoChangeDateFilterValue() {
      var [itemdateFrom, itemdateTo] = CommonFunction.getRangeDate(this.dateFilterValue);
      // Nếu đã khớp => dừng
      if(this.dateFrom == itemdateFrom && this.dateTo == itemdateTo) {
          return;
      }
      // Duyệt toàn bộ option của combobox
      var len = this.dateFilterCbxData.length;
      for(var i = 0; i < len; ++i) {
        var itemId = this.dateFilterCbxData[i].id;
        [itemdateFrom, itemdateTo] = CommonFunction.getRangeDate(itemId);
        // kiểm tra khoảng ngày có khớp không
        if(this.dateFrom == itemdateFrom && this.dateTo == itemdateTo) {
          this.dateFilterValue = itemId;
          return;
        }
      }
      // Trường hợp không có option nào khớp
      // Set giá trị DATE_CONST.OPTION cho cbx
      this.dateFilterValue = DATE_CONST.OPTION;
    },
    //#endregion
    
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
      if (error.isAxiosError && !response) {
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
     * Phương thức mở form thêm phiếu chi mới
     * @author pthieu (17-07-2021)
     */
    openFormAdd: function () {
      // set cờ trạng thái đang loading dữ liệu
      this.isLoading = true;
      // gọi api lấy mã chứng từ mới tự động
      receiptPaymentApi
        .getNewReceiptPaymentCode()
        .then((res) => {
          switch (res.status) {
            case 200:
              // gán dữ liệu lấy được cho ReceiptPaymentCode
              // recordData sẽ được truyền cho form để binding dữ liệu
              this.recordData = { ReceiptPaymentCode: res.data };
              break;
            case 204:
              this.recordData = { ReceiptPaymentCode: null };
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
     * Phương thức mở form nhân bản phiếu chi
     * @param {string} recordId khóa chính
     * @author pthieu (19-08-2021)
     */
    openFormClone: function (recordId) {
      // set cờ trạng thái đang loading dữ liệu
      this.isLoading = true;
      // set cờ ở trạng thái "thêm mới" (ADD)
      this.status = DATA_ACTION.ADD;

      receiptPaymentApi
        .getCloneReceiptPaymentById(recordId)
        .then((res) => {
          switch (res.status) {
            case 200:
              // gán dữ liệu lấy được cho recordData để binding lên form
              this.recordData = res.data.Data;
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
     * Phương thức mở form chỉnh sửa 
     * @param {string} recordId khóa chính
     * @author pthieu (24-09-2021)
     */
    openFormEdit: function (recordId) {
      // set cờ trạng thái đang loading dữ liệu
      this.isLoading = true;
      // set cờ ở trạng thái "chỉnh sửa" (EDIT)
      this.status = DATA_ACTION.EDIT;
      // gọi api lấy dữ liệu theo khóa chính
      receiptPaymentApi
        .getEntityById(recordId)
        .then((res) => {
          switch (res.status) {
            case 200:
              // gán dữ liệu lấy được cho recordData để binding lên form
              this.recordData = res.data.Data;
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
    },
    /**
     * Phương thức load dữ liệu danh sách bản ghi
     * (kèm theo tiêu chí phân trang, filter, search)
     * @param {Boolean} goToFirstPage
     * true - trở về trang 1, false (mặc định) - giữ nguyên trang hiện tại
     * @author pthieu (28-07-2021)
     */
    loadTableData: function (goToFirstPage = false) {
      // set cờ trạng thái đang loading dữ liệu
      this.isLoading = true;

      // reset các bản ghi được chọn
      this.selectedRecordIds = [];

      // dựa trên tham số đầu vào
      // true - trở về trang 1, false - giữ nguyên trang hiện tại
      if (goToFirstPage) {
        this.currentPage = 1;
      }

      // gọi api lấy danh sách bản ghi
      // theo các tiêu chí phân trang, lọc, tìm kiếm
      receiptPaymentApi
        .getReceiptPaymentFilterPaging(
          this.pageSize,
          this.startRecord,
          this.dateFrom,
          this.dateTo,
          this.keywordSearch
        )
        .then((res) => {
          if (res.status === 200) {
            var result = res.data.Data;
            this.totalPages = result.TotalPages;
            this.totalRecords = result.TotalRecords;
            this.tableSummary.TotalAmount = result.TotalAmount;
            this.tableData = result.Data;
            // TH không có bản ghi phù hợp:
            // TotalPages = 0, TotalRecords = 0, Data = []
            if (this.totalRecords == 0) {
              this.totalPages = 0;
              this.tableData = [];
              this.tableSummary.TotalAmount = 0;
            }

            // TEST: THợp xóa ở trang cuối dẫn đến làm giảm totalPages
            // Vấn đề: làm như bên dưới sẽ call lại api
            if (this.totalPages != 0 && this.currentPage > this.totalPages) {
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

    //#region xóa
    /** Phương thức xử lý khi ấn vào btn xóa nhiều
     * @author pthieu (12-09-2021)
     */
    clickBtnDeleteMany() {
      if (this.selectedRecordIds.length === 0) {
        this.$toast("error", resources.vi.toastMsg.deleteNoSelectedRecord);
      } else if (this.selectedRecordIds.length === 1) {
        var selectedId = this.selectedRecordIds[0];
        var record = this.tableData.find((i) => i.ReceiptPaymentId === selectedId);
        this.openPopUpDeleteOne(record);
      } else {
        this.openPopUpDeleteMany();
      }
    },

    /** Phương thức đóng popup xóa bản ghi
     * @author pthieu (20-08-2021)
     */
    closePopUpDelete() {
      this.showPopUpDelete = false;
      this.popupDeleleMsg = null;
    },

    /** Phương thức hiện popup xóa bản ghi
     * @param {object} row dữ liệu của row muốn xóa
     * @author pthieu (20-08-2021)
     */
    openPopUpDeleteOne(row) {
      this.popupDeleleMsg = CommonFunction.formatString(
        resources.vi.entity.cashVoucher.popUpDeleteMsg,
        row.ReceiptPaymentCode
      );
      this.actionDelete = this.deleteOneRecord.bind(this, row.ReceiptPaymentId);
      this.showPopUpDelete = true;
    },

    /** Phương thức hiện popup xóa bản ghi
     * @param {object} row dữ liệu của row muốn xóa
     * @author pthieu (12-09-2021)
     */
    openPopUpDeleteMany() {
      this.popupDeleleMsg = CommonFunction.formatString(
        resources.vi.entity.cashVoucher.popUpDeleteManyMsg,
        this.selectedRecordIds.length
      );
      this.actionDelete = this.deleteManyRecords;
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
     * Phương thức xóa bản ghi
     * @param {string} recordId khóa chính của row muốn xóa
     * @author pthieu (24-09-2021)
     */
    deleteOneRecord: function (recordId) {
      this.isLoading = true;
      receiptPaymentApi
        .deleteEntity(recordId)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.Data > 0) {
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
     * Phương thức xóa nhiều bản ghi
     * @author pthieu (10-09-2021)
     */
    deleteManyRecords: function () {
      this.closePopUpDelete();
      receiptPaymentApi
        .deleteManyEntities(this.selectedRecordIds)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.Data > 0) {
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
          this.selectedRecordIds = [];
          // this.isLoading = false;
        });
    },
    //#endregion
  },
};
</script>

<style scoped>
@import url("../../css/page/cash/cash-page.css");
  .toolbar {
    z-index: 6;
    position: relative;
    --ms-input-height: 32px;
  }
  .page .page-header {
    padding: 16px 0;
  }

  .page .page-header .page-header-title {
    font-size: 20px;
  }
</style>