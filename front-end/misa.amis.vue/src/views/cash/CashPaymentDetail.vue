<template>
  <div
    class="ms-detail"
    @keydown.esc.exact.prevent.stop="clickBtnClose"
    @keydown.ctrl.shift.83.exact.prevent.stop="clickBtnSave(true)"
    @keydown.ctrl.83.exact.prevent.stop="clickBtnSave(false)"
  >
    <div class="ms-detail-header">
      <div class="header-recent-btn" title="Tính năng đang phát triển">
        <div class="ms-icon ms-icon-24 ms-icon-recent"></div>
      </div>
      <div class="header-title">Phiếu chi {{ payment.ReceiptPaymentCode }}</div>
      <div class="ms-flex-space"></div>
      <div class="header-guide" title="Tính năng đang phát triển">
        <div class="header-guide-icon">
          <div class="ms-icon ms-icon-24 ms-icon-guide"></div>
        </div>
        <div class="header-guide-text">Hướng dẫn</div>
      </div>
      <div class="header-btn">
        <div class="header-btn-icon" title="Tính năng đang phát triển">
          <div class="ms-icon ms-icon-24 ms-icon-detail-setting"></div>
        </div>
        <div class="header-btn-icon" title="Tính năng đang phát triển">
          <div class="ms-icon ms-icon-24 ms-icon-help"></div>
        </div>
        <div
          class="header-btn-icon"
          v-tooltip.bottom="{
            content: 'Đóng (Esc)',
            classes: 'ms-detail-button-tooltip',
          }"
          :disabled="isItemDisabled"
          @click="clickBtnClose"
        >
          <div class="ms-icon ms-icon-24 ms-icon-close"></div>
        </div>
      </div>
    </div>
    <div class="ms-detail-content" ref="content" @scroll="onScrollContent">
      <div class="content-basic">
        <div class="content-basic-main">
          <div class="input-container">
            <div class="input-container-left">
              <div class="row">
                <div class="input-item">
                  <div class="ms-input-label">
                    <span>Đối tượng</span>
                    <span class="ms-input-label-required">&nbsp;*</span>
                  </div>
                  <BaseCbxTableDropdown
                    ref="OrganizationUnitId"
                    v-model="payment.OrganizationUnitId"
                    tabindex="1"
                    maxlength="255"
                    dataId="EmployeeId"
                    dataName="EmployeeName"
                    displayName="Đối tượng"
                    :isRequired="true"
                    :autofocus="true"
                    :comboboxData="cbxOrganizationUnitTableData"
                    :tableColumns="cbxOrganizationUnitTableColumns"
                    :isDisabled="isItemDisabled"
                    :showError="
                      (msg) => openPopUpError(msg, 'OrganizationUnitId')
                    "
                  />
                </div>
                <div class="input-item">
                  <div class="ms-input-label">
                    <span>Người nhận</span>
                  </div>
                  <BaseTextInput
                    ref="Receiver"
                    v-model="payment.Receiver"
                    tabindex="2"
                    maxlength="100"
                    displayName="Người nhận"
                    :isDisabled="isItemDisabled"
                    :showError="(msg) => openPopUpError(msg, 'Receiver')"
                  />
                </div>
              </div>
              <div class="row">
                <div class="input-item">
                  <div class="ms-input-label">
                    <span>Địa chỉ</span>
                  </div>
                  <BaseTextInput
                    ref="Address"
                    v-model="payment.Address"
                    tabindex="3"
                    maxlength="255"
                    :isDisabled="isItemDisabled"
                  />
                </div>
              </div>
              <div class="row">
                <div class="input-item">
                  <div class="ms-input-label">
                    <span>Lý do chi</span>
                  </div>
                  <BaseTextInput
                    ref="Description"
                    v-model="payment.Description"
                    tabindex="4"
                    maxlength="255"
                    :isDisabled="isItemDisabled"
                  />
                </div>
              </div>
              <div class="row">
                <div class="input-item">
                  <div class="ms-input-label">
                    <span>Nhân viên</span>
                  </div>
                  <BaseCbxTableDropdown
                    ref="EmployeeId"
                    v-model="payment.EmployeeId"
                    tabindex="5"
                    maxlength="255"
                    dataId="EmployeeId"
                    dataName="EmployeeName"
                    displayName="Nhân viên"
                    :comboboxData="cbxEmployeeTableData"
                    :tableColumns="cbxEmployeeTableColumns"
                    :isDisabled="isItemDisabled"
                    :showError="(msg) => openPopUpError(msg, 'EmployeeId')"
                  />
                </div>
                <div class="input-item">
                  <div class="ms-input-label">
                    <span>Kèm theo</span>
                  </div>
                  <div class="input-text-after">
                    <BaseDecimalInput
                      ref="RefAttach"
                      v-model="payment.RefAttach"
                      placeholder="Số lượng"
                      tabindex="6"
                      maxlength="18"
                      :isDisabled="isItemDisabled"
                    />
                    <span class="text-after">chứng từ gốc</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="input-container-right">
              <div class="row">
                <div class="input-item">
                  <div class="ms-input-label">
                    <span>Ngày hạch toán</span>
                    <span class="ms-input-label-required">&nbsp;*</span>
                  </div>
                  <BaseDatePickerInput
                    ref="AccountingDate"
                    v-model="payment.AccountingDate"
                    tabindex="7"
                    displayName="Ngày hạch toán"
                    :isRequired="true"
                    :isFutureDisabled="false"
                    :isDisabled="isItemDisabled"
                    :showError="(msg) => openPopUpError(msg, 'AccountingDate')"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-item">
                  <div class="ms-input-label">
                    <span>Ngày phiếu chi</span>
                    <span class="ms-input-label-required">&nbsp;*</span>
                  </div>
                  <BaseDatePickerInput
                    ref="RefDate"
                    v-model="payment.RefDate"
                    tabindex="8"
                    displayName="Ngày phiếu chi"
                    :isRequired="true"
                    :isFutureDisabled="false"
                    :isDisabled="isItemDisabled"
                    :showError="(msg) => openPopUpError(msg, 'RefDate')"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-item">
                  <div class="ms-input-label">
                    <span>Số phiếu chi</span>
                    <span class="ms-input-label-required">&nbsp;*</span>
                  </div>
                  <BaseTextInput
                    ref="ReceiptPaymentCode"
                    v-model="payment.ReceiptPaymentCode"
                    maxlength="20"
                    tabindex="9"
                    displayName="Số phiếu chi"
                    :isRequired="true"
                    :isDisabled="isItemDisabled"
                    :showError="
                      (msg) => openPopUpError(msg, 'ReceiptPaymentCode')
                    "
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="summary-container">
            <div class="summary-text">Tổng tiền</div>
            <div class="summary-value">
              <!-- {{ tableSummary.BankAccountNumber | formatMoney }} -->
              {{ payment.TotalAmount | formatMoney }}
            </div>
          </div>
        </div>
        <div class="reference">
          <div class="reference-text">Tham chiếu</div>
          <div class="reference-more" title="Tính năng đang phát triển">
            ...
          </div>
        </div>
      </div>

      <div class="content-detail">
        <div class="content-detail-info">
          <div class="accounting">Hạch toán</div>
          <div class="currency" title="Việt Nam đồng">Loại tiền: VND</div>
        </div>

        <div class="content-detail-table">
          <BaseEditableTable
            :tableColumns="tableDetailColumns"
            :tableData.sync="paymentDetailsData"
            :cbxData="cbxTableDetailData"
            :tableSummary.sync="tableSummary"
            :showError="openPopUpError"
            ref="EditableTable"
          />
          <div class="table-btn-container">
            <div class="table-btn" @click="addNewRow">Thêm dòng</div>
            <div class="table-btn" @click="clickDeleteAllRows">Xóa hết dòng</div>
          </div>
        </div>
        <div class="content-detail-attach">
          <div class="upload-title">
            <div class="ms-icon ms-icon-18 ms-icon-attach"></div>
            <div class="attach-text">Đính kèm</div>
            <div class="max-size-upload">Dung lượng tối đa 5MB</div>
          </div>
          <!-- <div class="upload-area">
            <div>Kéo/thả tệp vào đây hoặc bấm vào đây</div>
            <input class="input-file" type="file" multiple />
          </div> -->
          <label class="upload-area">
            <div>Kéo/thả tệp vào đây hoặc bấm vào đây</div>
            <input class="input-file" name="file" type="file" multiple />
            <!-- <input class="input-file" name="file" id="attach-file" type="file" multiple /> -->
          </label>
        </div>
      </div>
    </div>
    <div class="ms-detail-footer">
      <button type="button" class="ms-btn footer-btn footer-btn-secondary">
        Hủy
      </button>
      <div
        class="footer-btn footer-btn-primary footer-btn-dropdown"
        v-click-outside="closeFooterBtnDropdown"
      >
        <button
          type="button"
          class="ms-btn btn-main"
          @click="[closeFooterBtnDropdown(), clickBtnSave()]"
          v-tooltip.bottom="{
            content: 'Cất (Ctrl + S)',
            classes: 'ms-detail-button-tooltip',
          }"
          :disabled="isItemDisabled"
        >
          <div class="btn-main-text">Cất</div>
        </button>
        <button
          type="button"
          class="ms-btn btn-option"
          @click="toggleFooterBtnDropdown"
          @keydown.tab="closeFooterBtnDropdown"
        >
          <div class="ms-icon ms-icon-16 ms-icon-arrow-dropdown-white"></div>
        </button>
        <ul class="ms-dropdown up" :class="{ open: isOpenFooterBtnDropdown }">
          <li
            class="ms-dropdown-item"
            v-tooltip.left="{
              content: 'Cất và thêm (Ctrl + Shift + S)',
              classes: 'ms-detail-button-tooltip',
            }"
            @click="[closeFooterBtnDropdown(), clickBtnSave(true)]"
          >
            Cất và Thêm
          </li>
          <li
            class="ms-dropdown-item"
            v-tooltip.left="{
              content: 'Cất (Ctrl + S)',
              classes: 'ms-detail-button-tooltip',
            }"
            @click="[closeFooterBtnDropdown(), clickBtnSave()]"
          >
            Cất
          </li>
        </ul>
      </div>
    </div>
    <BaseLoading v-show="isProcessing" />
    <!-- popup close form -->
    <BasePopUp
      v-show="typePopUpOpen == popupType.CLOSE"
      role="dialog"
      aria-modal="true"
    >
      <template v-slot:icon>
        <div class="ms-icon ms-icon-48 ms-icon-question-circle"></div>
      </template>
      <template v-slot:message>
        <span>{{ popupCloseMsg }}</span>
      </template>
      <template v-slot:footer-left>
        <BaseButton
          type="text"
          classAttr="ms-btn-secondary"
          @clickBtn="closePopUp"
        >
          Hủy
        </BaseButton>
      </template>
      <template v-slot:footer-right>
        <BaseButton
          type="text"
          classAttr="ms-btn-secondary"
          @clickBtn="closeForm"
        >
          Không
        </BaseButton>
        <BaseButton
          type="text"
          classAttr="ms-btn-primary"
          @clickBtn="clickBtnSave"
        >
          Có
        </BaseButton>
      </template>
    </BasePopUp>

    <!-- popup error -->
    <BasePopUp v-show="typePopUpOpen == popupType.ERROR">
      <template v-slot:icon>
        <div class="ms-icon ms-icon-48 ms-icon-warning-triangle"></div>
      </template>
      <template v-slot:message>
        <span>{{ popupErrorMsg }}</span>
      </template>
      <template v-slot:footer-right>
        <BaseButton
          type="text"
          classAttr="ms-btn-primary"
          @clickBtn="focusFormItem(formItemError)"
        >
          Đồng ý
        </BaseButton>
      </template>
    </BasePopUp>

    <!-- popup xóa tất cả hàng đã nhập -->
     <BasePopUp v-show="showPopUpDeleteAllRows">
      <template v-slot:icon>
        <div class="ms-icon ms-icon-48 ms-icon-warning-triangle"></div>
      </template>
      <template v-slot:message>
        <span>{{ popupDeleteAllRowsMsg }}</span>
      </template>
      <template v-slot:footer-left>
        <BaseButton
          type="text"
          classAttr="ms-btn-secondary"
          @clickBtn="closePopUpDeleteAllRows"
        >
          Không
        </BaseButton>
      </template>
      <template v-slot:footer-right>
        <BaseButton
          type="text"
          classAttr="ms-btn-primary"
          @clickBtn="closePopUpDeleteAllRows(), deleteAllRows()"
        >
          Có
        </BaseButton>
      </template>
    </BasePopUp>
  </div>
</template>
<style scoped>
@import url("../../css/page/cash/cash-payment-detail.css");
@import url("../../css/common/dropdown.css");
</style>

<script>
// import BaseCombobox from "../../components/base/combobox/BaseCombobox.vue";
import BaseCbxTableDropdown from "../../components/base/combobox/BaseCbxTableDropdown.vue";
import BaseDatePickerInput from "../../components/base/input/BaseDatePickerInput.vue";
import BaseTextInput from "../../components/base/BaseTextInput.vue";
import BaseDecimalInput from "../../components/base/input/BaseDecimalInput.vue";
import BasePopUp from "../../components/base/popup/BasePopUp.vue";
import BaseButton from "../../components/base/button/BaseButton.vue";
import BaseLoading from "../../components/base/loading/BaseLoading.vue";
import mixinPaymentDetail from "../../mixins/page/cash/payment-detail";
import { CommonFunction } from "../../script/common/common";
import eventBus from "../../script/common/event-bus";
import BaseEditableTable from "../../components/base/grid/BaseEditableTable.vue";
import { DATA_ACTION, VALIDATE, PAYMENT_REASON, CREDIT_ACCOUNT_CBX, DEBIT_ACCOUNT_CBX } from "../../script/common/constant";
import employeeApi from "../../api/components/employee-api";
import receiptPaymentApi from "../../api/components/receipt-payment-api";

import { resources } from "../../script/common/resources";
import { DATE_DISPLAY_TOKEN } from '../../script/common/config';
export default {
  components: {
    // BaseCombobox,
    BaseCbxTableDropdown,
    BaseTextInput,
    BaseDatePickerInput,
    BaseEditableTable,
    BaseDecimalInput,
    BasePopUp,
    BaseButton,
    BaseLoading
  },
  mixins: [mixinPaymentDetail],
  props: {
    // dữ liệu bản ghi
    recordData: Object,
    // trạng thái: ADD, EDIT
    status: String,
  },
  data() {
    return {
      // chứa thông tin summary của bảng detail
      tableSummary: {},
      // cờ xác định trạng thái đóng/mở btn dropdown ở footer
      isOpenFooterBtnDropdown: false,
      // lưu dữ liệu phiếu chi
      payment: {},
      // biến lưu lại dữ liệu ban đầu
      // dùng để kiểm tra người dùng có thay đổi bất kỳ trường dữ liệu nào không
      oldPaymentData: null,
      // các hằng mô tả kiểu validate (email, phone number)
      validate: VALIDATE,
      // pop-up
      typePopUpOpen: null,
      // set trạng thái processing
      isProcessing: false,
      // lưu input lỗi (validate)
      formItemError: null,
      // tiền tố cho ô diễn giải Lý do chi
      paymentDescriptionPrefix: "",
      // dữ liệu combobox Đối tượng
      cbxOrganizationUnitTableData: [],
      // dữ liệu combobox Nhân viên
      cbxEmployeeTableData: [],
      // cờ xác định ẩn/hiện popup xóa tất cả hàng
      showPopUpDeleteAllRows: false
    };
  },
  created() {
    // reset payment (làm trống tất cả các trường)
    this.payment = JSON.parse(JSON.stringify(this.paymentEmpty));
    // set giá trị cho object payment
    // với dữ liệu bản ghi nhận từ prop recordData
    for (var fieldName in this.payment) {
      var value = this.recordData[fieldName];
      if (value != undefined && value != null) {
        this.payment[fieldName] = value;
      }
    }
    // Lưu lại giá trị payment
    // Để làm căn cứ kiểm tra xem người dùng có chỉnh sửa dữ liệu không
    this.oldPaymentData = JSON.parse(JSON.stringify(this.payment));

    // detail
    var detailArr = JSON.parse(this.payment.ReceiptPaymentDetail);
    if(this.payment.ReceiptPaymentDetail && detailArr.length > 0) {
      this.paymentDetailsData = detailArr;
    } else {
      this.paymentDetailsData = [Object.assign({}, this.paymentDetailEmpty)];
    }


    // load cbx data
    this.loadCbxTableData();

    // set description prefix
    this.setPaymentDescriptionPrefix();
    if(this.payment.Description == null) {
      this.payment.Description = this.paymentDescriptionPrefix;
    }
  },
  computed: {
    // cờ xác định trạng thái disabled các input
    isItemDisabled() {
      if (this.isProcessing || this.typePopUpOpen) {
        return true;
      }
      return false;
    },
    // dữ liệu các combobox trong bảng detail
    cbxTableDetailData() {
      return {
        "DebitAccount": DEBIT_ACCOUNT_CBX,
        "CreditAccount": CREDIT_ACCOUNT_CBX,
        "OrganizationUnitId": this.cbxOrganizationUnitTableData
      }
    }
  },
  watch: {
    // Theo dõi giá trị Đối tượng
    // Cập nhật Người nhận, Địa chỉ, Lý do chi theo Đối tượng
    'payment.OrganizationUnitId': function(newValue) {
      var item = this.cbxOrganizationUnitTableData.find((i) => i["EmployeeId"] === newValue);
      if(item) {
        this.payment.Receiver = item["EmployeeName"];
        this.payment.Address = item["Address"];
        this.payment.Description = this.paymentDescriptionPrefix + item["EmployeeName"];
      }
      var objDetail = {
        Description: this.payment.Description,
        OrganizationUnitId: this.payment.OrganizationUnitId,
        OrganizationUnitName: item["EmployeeName"]
      }
      if(this.paymentDetailsData) {
        if(this.paymentDetailsData.length == 0) {
          this.paymentDetailsData.push(objDetail);
        } else {
          this.paymentDetailsData[0] = Object.assign(this.paymentDetailsData[0], objDetail);
        }
      }
    },
    // Theo dõi lý do thu/chi (mặc định là Chi khác)
    // Cập nhật tiền tố cho ô diễn giải lý do thu chi
    'payment.Reason': function() {
      this.setPaymentDescriptionPrefix();
    },
    // theo dõi summary của table
    // cập nhật Tổng tiền
    'tableSummary': function() {
      if(this.tableSummary.Amount) {
        this.payment.TotalAmount = this.tableSummary.Amount;
      } else {
        this.payment.TotalAmount = 0;
      }
    }

  },
  methods: {
    //#region phương thức xử lý sự kiện chung
    /**
     * Phương thức xử lý sự kiện scroll content
     * @author pthieu (02-10-2021)
     */
    onScrollContent() {
      eventBus.$emit("scroll");
      // cách 1: dùng ref
      // cách 2: query by component tag
      // this.$children.forEach((c) => {
      //   if (c.$options._componentTag == "BaseDatePickerInput") {
      //     c.closeDatePicker();
      //   } else if (c.$options._componentTag == "BaseCombobox" || 
      //   c.$options._componentTag == "BaseCbxTableDropdown") {
      //     c.closeDropdown();
      //   }
      // });
    },
    //#endregion
    
    //#region phương thức xử lý đóng/mở btn dropdown ở footer
    /**
     * Phương thức mở btn dropdown ở footer
     * @author pthieu (24-09-2021)
     */
    openFooterBtnDropdown() {
      this.isOpenFooterBtnDropdown = true;
    },
    /**
     * Phương thức đóng btn dropdown ở footer
     * @author pthieu (24-09-2021)
     */
    closeFooterBtnDropdown() {
      this.isOpenFooterBtnDropdown = false;
    },
    /**
     * Phương thức toggle btn dropdown ở footer
     * @author pthieu (24-09-2021)
     */
    toggleFooterBtnDropdown() {
      this.isOpenFooterBtnDropdown = !this.isOpenFooterBtnDropdown;
    },
    //#endregion
    
    //#region phương thức xử lý thêm, xóa dòng
    /**
     * Phương thức xử lý khi click btn xóa tất cả dòng trong table detail
     * @author pthieu (02-10-2021)
     */
    clickDeleteAllRows() {
      if(this.paymentDetailsData && this.paymentDetailsData.length > 0) {
        this.openPopUpDeleteAllRows();
      }
    },
    /**
     * Phương thức xử lý việc xóa tất cả hàng
     * @author pthieu (24-09-2021)
     */
    deleteAllRows() {
      this.$refs.EditableTable.deleteAllRows();
    },
    /**
     * Phương thức xử lý việc thêm dòng mới
     * @author pthieu (24-09-2021)
     */
    addNewRow() {
      this.$refs.EditableTable.addNewRow();
    },
    //#endregion

    //#region combobox
    /**
     * Phương thức load dữ liệu combobox
     * @author pthieu (24-09-2021)
     */
    loadCbxTableData() {
      employeeApi.getAllEntities()
        .then((res) => {
          this.cbxOrganizationUnitTableData = res.data;
          this.cbxEmployeeTableData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //#endregion
    
    //#region các phương thức hỗ trợ
    /**
     * Phương thức Kiểm tra người dùng có thay đổi dữ liệu hay không.
     * @returns {Boolean} true - có thay đổi, false - không thay đổi
     * @author pthieu (1-8-2021)
     */
    isChangedData: function () {
      // chú ý kiểm tra theo dạng chuỗi json sẽ xét cả thứ tự các trường
      return (
        JSON.stringify(this.oldPaymentData) !== JSON.stringify(this.payment)
      );
    },
    /**
     * Phương thức thực hiện trim tất cả thuộc tính string trong 1 obj
     * @param {object} obj đối tượng cần xử lý
     * @author pthieu (20-08-2021)
     */
    trimStringPropInObject(obj) {
      Object.keys(obj).forEach(function (key) {
        // kiểm tra trường có phải kiểu string không
        // Việc kiểm tra thực hiện chưa hoàn toàn đúng
        // VD trong TH: new String()
        // Tuy nhiên TH này rất ít có khả năng xuất hiện
        // và mình cũng không bao giờ sử dụng new String()
        if (typeof obj[key] == "string") {
          obj[key] = obj[key].trim();
        }
      });
    },
    /**
     * Phương thức xử lý việc set nội dung diễn giải lý do chi
     * @author pthieu (24-09-2021)
     */
    setPaymentDescriptionPrefix() {
      Object.keys(PAYMENT_REASON).forEach((key) => {
        if(PAYMENT_REASON[key].REASON == this.payment.Reason) {
          this.paymentDescriptionPrefix = PAYMENT_REASON[key].DESCRIPTION;
          return;
        }
      });
    },
    //#endregion

    //#region phương thức xử lý đóng form
    /**
     * Phương thức thực hiện đóng form.
     * @author pthieu (16-07-2021)
     */
    closeForm: function () {
      this.$emit("closeForm");
      // if (this.status === DATA_ACTION.SAVE_AND_ADD) {
      //   // cờ true => load dữ liệu trang 1
      //   this.$emit("reloadTableData", true);
      // }
    },

    /**
     * Phương thức xử lý khi click nút đóng form.
     * @author pthieu (21-07-2021)
     */
    clickBtnClose: function () {
      // nếu dữ liệu bị thay đổi thì hiện pop-up yêu cầu xác nhận
      if (this.isChangedData() === true) {
        this.openPopUp(this.popupType.CLOSE);
      }
      // nếu dữ liệu không bị thay đổi thì đóng form luôn
      else {
        this.closeForm();
      }
    },
    //#endregion

    //#region phương thức liên quan đến popup
    /**
     * Phương thức xử lý việc mở popup
     * @param {string} popupType tên loại popup
     * @author pthieu (20-08-2021)
     */
    openPopUp(popupType) {
      this.typePopUpOpen = popupType;
    },
    /**
     * Phương thức xử lý việc đóng popup
     * @author pthieu (20-08-2021)
     */
    closePopUp() {
      this.typePopUpOpen = null;
    },
    /**
     * Phương thức xử lý việc mở popup thông báo lỗi
     * @param {string} msg thông báo lỗi
     * @author pthieu (20-08-2021)
     */
    openPopUpError(msg) {
      this.typePopUpOpen = this.popupType.ERROR;
      this.popupErrorMsg = msg;
    },

    /**
     * Phương thức cho phép focus vào 1 item dựa trên ref
     * @param {*} formItem phần tử lấy được qua ref
     * @author pthieu (06-08-2021)
     */
    focusFormItem: function (formItem) {
      this.closePopUp();
      // Nếu tồn tại formItem
      // và phần tử này có phương thức focusInput
      if (formItem && typeof formItem.focusInput == "function") {
        // tạm thời: cần đặt nextTick mới focus được vào ô input
        this.$nextTick(() => formItem.focusInput());
      }
    },

    /**
     * Phương thức hiện popup xóa tất cả dòng
     * @author pthieu (02-10-2021)
     */
    openPopUpDeleteAllRows() {
      this.showPopUpDeleteAllRows = true;
    },
    /**
     * Phương thức ẩn popup xóa tất cả dòng
     * @author pthieu (02-10-2021)
     */
    closePopUpDeleteAllRows() {
      this.showPopUpDeleteAllRows = false;
    },
    //#endregion

    //#region phương thức xử lý cất dữ liệu
    /**
     * Validate nghiệp vụ
     * @returns {Boolean} true - không có lỗi, false - có lỗi
     * @author pthieu (02-10-2021)
     */
    validateCustom() {
      // Ngày hạch toán phải lớn hơn hoặc bằng ngày chứng từ
      if(this.payment.AccountingDate < this.payment.RefDate) {
        this.formItemError = this.$refs.AccountingDate;
        var msg = resources.vi.entity.cashVoucher.errorValidateCustomAccountingDate;
        var refDate = CommonFunction.formatDate(this.payment.RefDate, DATE_DISPLAY_TOKEN);
        msg = CommonFunction.formatString(msg, refDate);
        this.openPopUpError(msg);
        return false;
      }
      return true;
    },
    /**
     * Validate dữ liệu
     * @returns {Boolean} true - không có lỗi, false - có lỗi
     * @author pthieu (02-10-2021)
     */
    validateData() {
      // thực hiện validate
      // duyệt qua tất cả các input (dựa vào ref)
     this.formItemError = null;
      for (var name in this.$refs) {
        // lấy ra phần tử dựa trên ref
        var formItem = this.$refs[name];
        // nếu phần tử có phương thức focusInput,
        // có phương thức validateInput + validate thất bại:
        if (
          typeof formItem.validateInput == "function" &&
          !formItem.validateInput() &&
          !this.formItemError
        ) {
          this.formItemError = formItem;
        }
      }

      // validate bảng detail
      var cellError = this.$refs.EditableTable.validateAllInputs();
      if(!this.formItemError) {
        this.formItemError = cellError
      }

      if (
        this.formItemError != undefined &&
        this.formItemError != null &&
        typeof this.formItemError.showErrorNotice == "function"
      ) {
        this.formItemError.showErrorNotice();
        return false;
      }
      
      return this.validateCustom();
    },

    /**
     * Phương thức xử lý khi click nút submit form.
     * @author pthieu (21-07-2021)
     */
    clickBtnSave: function (isSaveAndAdd = false) {
      if(!this.validateData()) {
        return;
      }
      // dựa trên cờ status để quyết định hành động
      switch (this.status) {
        // TH thêm bản ghi mới
        case DATA_ACTION.ADD:
        case DATA_ACTION.SAVE_AND_ADD:
          this.addPayment(isSaveAndAdd);
          break;

        // TH chỉnh sửa thông tin bản ghi
        case DATA_ACTION.EDIT:
          // Kiểm tra dữ liệu có bị thay đổi không
          // nếu không => đóng form ngay
          if (this.isChangedData() === false && isSaveAndAdd === false) {
            this.closeForm();
            return;
          }
          this.editPayment(isSaveAndAdd);
          break;
      }
    },
    //#endregion

    //#region phương thức add, edit payment
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
     * Phương thức thực hiện Thêm mới dữ liệu
     * @param {Boolean} isSaveAndAdd
     * Cờ xác định người dùng ấn btn Cất và Thêm
     * @author pthieu (21-07-2021)
     */
    addPayment: function (isSaveAndAdd = false) {
      // thiết lập trạng thái đang xử lý
      this.isProcessing = true;
      this.payment.ReceiptPaymentDetail = JSON.stringify(this.paymentDetailsData);
      // trim các trường string trước khi gửi qua api
      this.trimStringPropInObject(this.payment);
      // gọi api thêm bản ghi mới
      receiptPaymentApi
        .postEntity(this.payment)
        .then((res) => {
          switch (res.status) {
            // Thêm mới thành công
            case 201:
              this.$toast("success", res.data.UserMsg);
              // TH: Cất và thêm
              if (isSaveAndAdd) {
                this.$emit("reOpenForm");
              } else {
                // TH: Cất
                // Đóng form và load lại dữ liệu
                this.$emit("closeForm");
              }
              // cờ true => load dữ liệu trang 1
              this.$emit("reloadTableData", true);
              break;
            // Thêm mới không thành công
            // Vì lý do validate nghiệp vụ thất bại
            // Hoặc affected row = 0 (chưa rõ nguyên nhân)
            case 200:
              // TH: có lỗi xử lý nghiệp vụ (backend)
              if (res.data.IsSuccess == false) {
                this.openPopUpError(res.data.UserMsg, res.data.Data);
              } else if (res.data.Data <= 0) {
                this.$toast("error", res.data.UserMsg);
              }
              break;
          }
        })
        .catch((error) => {
          this.showServerResponseError(error);
        })
        .finally(() => {
          this.isProcessing = false;
        });
    },

    /**
     * Phương thức thực hiện chỉnh sửa dữ liệu
     * @param {Boolean} isSaveAndAdd
     * Cờ xác định người dùng ấn btn Cất và Thêm
     * @author pthieu (21-07-2021)
     */
    editPayment: function (isSaveAndAdd = false) {
      // thiết lập trạng thái đang xử lý
      this.isProcessing = true;
      this.payment.ReceiptPaymentDetail = JSON.stringify(this.paymentDetailsData);
      // trim các trường string trước khi gửi qua api
      this.trimStringPropInObject(this.payment);
      // gọi api cập nhật dữ liệu bản ghi
      receiptPaymentApi
        .putEntity(this.recordData.ReceiptPaymentId, this.payment)
        .then((res) => {
          if (res.status === 200) {
            // TH: Chỉnh sửa thành công
            if (res.data.IsSuccess && res.data.Data > 0) {
              this.$toast("success", res.data.UserMsg);
              // TH: Cất và thêm
              if (isSaveAndAdd) {
                this.$emit("reOpenForm");
              } else {
                // TH: Cất
                // Đóng form và load lại dữ liệu
                this.$emit("closeForm");
              }
              // cờ false => load dữ liệu trang hiện tại
              // (true: reload trang 1, false: reload trang hiện tại)
              this.$emit("reloadTableData", false);
            } else if (res.data.IsSuccess && res.data.Data <= 0) {
              // TH: Chỉnh sửa không thành công, do affected row = 0
              // Chú ý IsSuccess trả về vẫn là true
              // TH này có khă năng xảy ra, VD chỉnh sửa 1 bản ghi đã bị xóa
              this.$toast("error", res.data.UserMsg);
            } else {
              // TH: có lỗi xử lý nghiệp vụ (validate)
              // res.data.IsSuccess == false
              this.openPopUpError(res.data.UserMsg, res.data.Data);
            }
          }
        })
        .catch((error) => {
          this.showServerResponseError(error);
        })
        .finally(() => {
          this.isProcessing = false;
        });
    },
    //#endregion
  },
  filters: {
    formatMoney(value) {
      return CommonFunction.formatDecimalNumber(value);
    },
  },
};
</script>