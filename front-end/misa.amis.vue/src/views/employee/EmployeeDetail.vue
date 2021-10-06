<template>
  <div class="ms-modal">
    <!-- form thông tin chi tiết-->
    <div
      class="ms-form-container"
      @keydown.esc.exact.prevent.stop="clickBtnClose"
      @keydown.ctrl.shift.83.exact.prevent.stop="clickBtnSave(true)"
      @keydown.ctrl.83.exact.prevent.stop="clickBtnSave(false)"
    >
      <form class="ms-form" autocomplete="off" @submit.prevent>
        <div class="form-header">
          <div class="form-header-info">
            <div class="form-title">Thông tin nhân viên</div>
            <div class="header-checkbox">
              <BaseCheckBox checkboxLabel="Là khách hàng" />
            </div>
            <div class="header-checkbox">
              <BaseCheckBox checkboxLabel="Là nhà cung cấp" />
            </div>
          </div>
          <div class="form-header-btn">
            <div 
              class="ms-icon ms-icon-24 ms-icon-help"
              v-tooltip.bottom="{
                content: 'Giúp',
                classes: 'ms-form-button-tooltip',
              }"
            ></div>
            <div
              class="ms-icon ms-icon-24 ms-icon-close"
              v-tooltip.bottom="{
                content: 'Đóng (Esc)',
                classes: 'ms-form-button-tooltip',
              }"
              :disabled="isItemDisabled"
              @click="clickBtnClose"
            ></div>
          </div>
        </div>

        <div class="form-content">
          <div class="form-content-part flex">
            <div class="flex-05 margin-right-15">
              <div class="form-item-row flex">
                <div class="form-item flex-04 margin-right-8">
                  <div class="ms-input-label">
                    <span>Mã</span
                    ><span class="ms-input-label-required">&nbsp;*</span>
                  </div>
                  <BaseTextInput
                    ref="EmployeeCode"
                    v-model="employee.EmployeeCode"
                    maxlength="20"
                    tabindex="1"
                    displayName="Mã"
                    :isRequired="true"
                    :autofocus="true"
                    :isDisabled="isItemDisabled"
                    :showError="(msg) => openPopUpError(msg, 'EmployeeCode')"
                    @keydown.native.shift.tab.exact.prevent="
                      $refs.LastFocusElement.$el.focus()
                    "
                  />
                </div>
                <div class="form-item flex-06">
                  <div class="ms-input-label">
                    <span>Tên</span
                    ><span class="ms-input-label-required">&nbsp;*</span>
                  </div>
                  <BaseTextInput
                    ref="EmployeeName"
                    v-model="employee.EmployeeName"
                    maxlength="100"
                    tabindex="2"
                    displayName="Tên"
                    :isRequired="true"
                    :isDisabled="isItemDisabled"
                    :showError="(msg) => openPopUpError(msg, 'EmployeeName')"
                  />
                </div>
              </div>

              <div class="form-item-row">
                <div class="form-item">
                  <div class="ms-input-label">
                    <span>Đơn vị</span
                    ><span class="ms-input-label-required">&nbsp;*</span>
                  </div>
                  <BaseCombobox
                    ref="DepartmentId"
                    v-model="employee.DepartmentId"
                    maxlength="255"
                    tabindex="3"
                    dataId="DepartmentId"
                    dataName="DepartmentName"
                    displayName="Đơn vị"
                    :comboboxData="departments"
                    :isRequired="true"
                    :isDisabled="isItemDisabled"
                    :showError="(msg) => openPopUpError(msg, 'DepartmentId')"
                  />
                </div>
              </div>

              <div class="form-item-row">
                <div class="form-item">
                  <div class="ms-input-label">
                    <span>Chức vụ</span>
                  </div>
                  <BaseTextInput
                    ref="EmployeePosition"
                    v-model="employee.EmployeePosition"
                    tabindex="4"
                    maxlength="100"
                    :isDisabled="isItemDisabled"
                  />
                </div>
              </div>
            </div>

            <div class="flex-05">
              <!-- start: form item row -->
              <div class="form-item-row flex">
                <!-- start: form item -->
                <div class="form-item flex-04 margin-right-8">
                  <div class="ms-input-label">
                    <span>Ngày sinh</span>
                  </div>
                  <BaseDatePickerInput
                    ref="DateOfBirth"
                    v-model="employee.DateOfBirth"
                    tabindex="5"
                    :isDisabled="isItemDisabled"
                  />
                </div>
                <!-- end: form item -->

                <!-- start: form item -->
                <div class="form-item flex-06 padding-left-10">
                  <div class="ms-input-label">
                    <span>Giới tính</span>
                  </div>
                  <div class="input-radio-container flex">
                    <div class="input-radio-item margin-right-20">
                      <BaseRadioInput
                        inputLabel="Nam"
                        :inputValue="0"
                        tabindex="6"
                        v-model="employee.Gender"
                        name="Gender"
                        :isDisabled="isItemDisabled"
                      />
                    </div>
                    <div class="input-radio-item margin-right-20">
                      <BaseRadioInput
                        inputLabel="Nữ"
                        :inputValue="1"
                        tabindex="6"
                        v-model="employee.Gender"
                        name="Gender"
                        :isDisabled="isItemDisabled"
                      />
                    </div>
                    <div class="input-radio-item margin-right-20">
                      <BaseRadioInput
                        inputLabel="Khác"
                        :inputValue="2"
                        tabindex="6"
                        v-model="employee.Gender"
                        name="Gender"
                        :isDisabled="isItemDisabled"
                      />
                    </div>
                  </div>
                </div>
                <!-- end: form item-->
              </div>
              <!-- end: form item row -->

              <!-- start: form item row -->
              <div class="form-item-row flex">
                <!-- start: form item -->
                <div class="form-item flex-06 margin-right-8">
                  <div class="ms-input-label">
                    <span>Số CMND</span>
                  </div>
                  <BaseTextInput
                    ref="IdentityNumber"
                    type="number"
                    tabindex="7"
                    v-model="employee.IdentityNumber"
                    maxlength="25"
                    displayName="Số CMND"
                    :isDisabled="isItemDisabled"
                  />
                </div>
                <!-- end: form item -->
                <!-- start: form item -->
                <div class="form-item flex04">
                  <div class="ms-input-label">
                    <span>Ngày cấp</span>
                  </div>
                  <BaseDatePickerInput
                    ref="IdentityDate"
                    tabindex="8"
                    v-model="employee.IdentityDate"
                    :isDisabled="isItemDisabled"
                  />
                </div>
                <!-- end: form item -->
              </div>
              <!-- end: form item row -->

              <!-- start: form item row -->
              <div class="form-item-row">
                <!-- start: form item -->
                <div class="form-item">
                  <div class="ms-input-label">
                    <span>Nơi cấp</span>
                  </div>
                  <BaseTextInput
                    ref="IdentityPlace"
                    tabindex="9"
                    v-model="employee.IdentityPlace"
                    maxlength="255"
                    :isDisabled="isItemDisabled"
                  />
                </div>
                <!-- end: form item -->
              </div>
              <!-- end: form item row -->
            </div>
            <!-- end: form content part right-->
          </div>
          <!-- end: form content part -->
          <!-- start: form content part -->
          <div class="form-content-part">
            <!-- start: form item row -->
            <div class="form-item-row">
              <!-- start: form item -->
              <div class="form-item">
                <div class="ms-input-label">
                  <span>Địa chỉ</span>
                </div>
                <BaseTextInput
                  ref="Address"
                  tabindex="10"
                  v-model="employee.Address"
                  maxlength="255"
                  :isDisabled="isItemDisabled"
                />
              </div>
              <!-- end: form item -->
            </div>
            <!-- end: form item row -->

            <!-- start: form item row -->
            <div class="form-item-row flex">
              <!-- start: form item -->
              <div class="form-item flex-025 margin-right-8">
                <div class="ms-input-label">
                  <span>ĐT di động</span>
                </div>
                <BaseTextInput
                  ref="PhoneNumber"
                  tabindex="11"
                  v-model="employee.PhoneNumber"
                  maxlength="50"
                  displayName="ĐT di động"
                  :format="validate.PHONE_NUMBER.TYPE"
                  :isDisabled="isItemDisabled"
                  :showError="(msg) => openPopUpError(msg, 'PhoneNumber')"
                />
              </div>
              <!-- end: form item -->
              <!-- start: form item -->
              <div class="form-item flex-025 margin-right-8">
                <div class="ms-input-label">
                  <span>ĐT cố định</span>
                </div>
                <BaseTextInput
                  ref="TelephoneNumber"
                  tabindex="12"
                  v-model="employee.TelephoneNumber"
                  maxlength="50"
                  displayName="ĐT cố định"
                  :format="validate.TELEPHONE_NUMBER.TYPE"
                  :isDisabled="isItemDisabled"
                  :showError="(msg) => openPopUpError(msg, 'TelephoneNumber')"
                />
              </div>
              <!-- end: form item -->
              <!-- start: form item -->
              <div class="form-item flex-025 margin-right-8">
                <div class="ms-input-label">
                  <span>Email</span>
                </div>
                <BaseTextInput
                  ref="Email"
                  tabindex="13"
                  v-model="employee.Email"
                  maxlength="100"
                  displayName="Email"
                  :format="validate.EMAIL.TYPE"
                  :isDisabled="isItemDisabled"
                  :showError="(msg) => openPopUpError(msg, 'Email')"
                />
              </div>
              <!-- end: form item -->
              <!-- start: form item -->
              <div class="form-item flex-025"></div>
              <!-- end: form item -->
            </div>
            <!-- end: form item row -->
            <!-- start: form item row -->
            <div class="form-item-row flex">
              <!-- start: form item -->
              <div class="form-item flex-025 margin-right-8">
                <div class="ms-input-label">
                  <span>Tài khoản ngân hàng</span>
                </div>
                <BaseTextInput
                  ref="BankAccountNumber"
                  tabindex="14"
                  type="number"
                  v-model="employee.BankAccountNumber"
                  maxlength="25"
                  :isDisabled="isItemDisabled"
                />
              </div>
              <!-- end: form item -->
              <!-- start: form item -->
              <div class="form-item flex-025 margin-right-8">
                <div class="ms-input-label">
                  <span>Tên ngân hàng</span>
                </div>
                <BaseTextInput
                  ref="BankName"
                  tabindex="15"
                  v-model="employee.BankName"
                  maxlength="255"
                  :isDisabled="isItemDisabled"
                />
              </div>
              <!-- end: form item -->
              <!-- start: form item -->
              <div class="form-item flex-025 margin-right-8">
                <div class="ms-input-label">
                  <span>Chi nhánh</span>
                </div>
                <BaseTextInput
                  ref="BankBranchName"
                  tabindex="16"
                  v-model="employee.BankBranchName"
                  maxlength="255"
                  :isDisabled="isItemDisabled"
                />
              </div>
              <!-- end: form item -->
              <!-- start: form item -->
              <div class="form-item flex-025"></div>
              <!-- end: form item -->
            </div>
            <!-- end: form item row -->
          </div>
          <!-- end: form content part -->
        </div>

        <div class="form-footer">
          <div class="footer-left">
            <BaseButton
              type="text"
              ref="LastFocusElement"
              tabindex="19"
              classAttr="ms-btn-secondary"
              :isDisabled="isItemDisabled"
              @clickBtn="clickBtnClose"
              @keydown.native.tab.exact.prevent="
                $refs.EmployeeCode.focusInput()
              "
            >
              Hủy
            </BaseButton>
          </div>
          <div class="footer-right">
            <BaseButton
              type="text"
              tabindex="17"
              classAttr="ms-btn-secondary"
              v-tooltip.bottom="{
                content: 'Cất (Ctrl + S)',
                classes: 'ms-form-button-tooltip',
              }"
              :isDisabled="isItemDisabled"
              @clickBtn="clickBtnSave"
            >
              Cất
            </BaseButton>
            <BaseButton
              type="text"
              tabindex="18"
              classAttr="ms-btn-primary"
              v-tooltip.bottom="{
                content: 'Cất và thêm (Ctrl + Shift + S)',
                classes: 'ms-form-button-tooltip',
              }"
              :isDisabled="isItemDisabled"
              @clickBtn="clickBtnSave(true)"
            >
              Cất và thêm
            </BaseButton>
          </div>
        </div>
        <!-- end form footer -->
      </form>
      <BaseLoading v-show="isProcessing" />
    </div>
    <!-- end form modal -->

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
          @clickBtn="focusFormItem(formItemErrorRef)"
        >
          Đồng ý
        </BaseButton>
      </template>
    </BasePopUp>
  </div>
</template>

<script>
import { DATA_ACTION, VALIDATE } from "../../script/common/constant";
import employeeApi from "../../api/components/employee-api";
import mixinEmployeeDetail from "../../mixins/page/employee/employee-detail";

import BaseTextInput from "../../components/base/BaseTextInput.vue";
import BaseDatePickerInput from "../../components/base/input/BaseDatePickerInput.vue";
import BaseButton from "../../components/base/button/BaseButton.vue";
import BaseLoading from "../../components/base/loading/BaseLoading.vue";
import BaseCheckBox from "../../components/base/input/BaseCheckBox.vue";
import BaseRadioInput from "../../components/base/input/BaseRadioInput.vue";
import BaseCombobox from "../../components/base/combobox/BaseCombobox.vue";
import BasePopUp from "../../components/base/popup/BasePopUp.vue";
import { resources } from '../../script/common/resources';

export default {
  components: {
    BaseTextInput,
    BaseDatePickerInput,
    BaseButton,
    BaseLoading,
    BaseCheckBox,
    BaseRadioInput,
    BaseCombobox,
    BasePopUp,
  },
  props: {
    // dữ liệu nhân viên
    dataEmployee: Object,
    // trạng thái: ADD, EDIT
    status: String,
    // danh sách phòng ban
    departments: Array,
  },
  /* thêm 1 số thông tin, bao gồm:
   * - object chứa tất cả các trường thông tin employee
   * - các kiểu popup, câu thông báo pop-up
   */
  mixins: [mixinEmployeeDetail],
  data() {
    return {
      employee: {},
      // các hằng mô tả kiểu validate (email, phone number)
      validate: VALIDATE,
      // pop-up
      typePopUpOpen: null,
      // biến lưu lại dữ liệu employee
      // dùng để kiểm tra người dùng có thay đổi bất kỳ trường dữ liệu nào không
      oldEmployeeData: null,
      // set trạng thái processing
      isProcessing: false,
      // lưu ref input lỗi (validate)
      formItemErrorRef: null,
    };
  },
  created() {
    // reset employee (làm trống tất cả các trường)
    this.employee = JSON.parse(JSON.stringify(this.employeeEmpty));
    // set giá trị cho object employee
    // với dữ liệu nhân viên nhận từ prop dataEmployee
    for (var fieldName in this.employee) {
      var value = this.dataEmployee[fieldName];
      if (value != undefined && value != null) {
        this.employee[fieldName] = value;
      }
    }
    // Lưu lại giá trị employee
    // Để làm căn cứ kiểm tra xem người dùng có chỉnh sửa dữ liệu không
    this.oldEmployeeData = JSON.parse(JSON.stringify(this.employee));
  },
  computed: {
    isItemDisabled() {
      if (this.isProcessing || this.typePopUpOpen) {
        return true;
      }
      return false;
    },
  },
  methods: {
    //#region các phương thức hỗ trợ
    /**
     * Phương thức Kiểm tra người dùng có thay đổi dữ liệu hay không.
     * @returns {Boolean} true - có thay đổi, false - không thay đổi
     * @author pthieu (1-8-2021)
     */
    isChangedData: function () {
      // chú ý kiểm tra theo dạng chuỗi json sẽ xét cả thứ tự các trường
      return (
        JSON.stringify(this.oldEmployeeData) !== JSON.stringify(this.employee)
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
     * @param {string} fieldName tên trường có lỗi
     * @author pthieu (20-08-2021)
     */
    openPopUpError(msg, fieldName) {
      this.typePopUpOpen = this.popupType.ERROR;
      this.popupErrorMsg = msg;
      this.formItemErrorRef = fieldName;
    },

    /**
     * Phương thức cho phép focus vào 1 item dựa trên ref
     * @param {string} formItemRef giá trị ref
     * @author pthieu (06-08-2021)
     */
    focusFormItem: function (formItemRef) {
      // test
      this.closePopUp();
      var formItem = this.$refs[formItemRef];
      // Nếu tồn tại formItem
      // và phần tử này có phương thức focusInput
      if (formItem && typeof formItem.focusInput == "function") {
        // tạm thời: cần đặt nextTick mới focus được vào ô input
        this.$nextTick(() => formItem.focusInput());
      }
    },
    //#endregion

    //#region phương thức xử lý cất dữ liệu
    /**
     * Phương thức xử lý khi click nút submit form.
     * @author pthieu (21-07-2021)
     */
    clickBtnSave: function (isSaveAndAdd = false) {
      // thực hiện validate
      // duyệt qua tất cả các input (dựa vào ref)
      var firstFormItemError = null;
      for (var name in this.$refs) {
        // lấy ra phần tử dựa trên ref
        var formItem = this.$refs[name];
        // nếu phần tử có phương thức focusInput,
        // có phương thức validateInput + validate thất bại:
        if (
          typeof formItem.validateInput == "function" &&
          !formItem.validateInput() &&
          !firstFormItemError
        ) {
          firstFormItemError = formItem;
        }
      }

      if (
        firstFormItemError != undefined &&
        firstFormItemError != null &&
        typeof firstFormItemError.showErrorNotice == "function"
      ) {
        firstFormItemError.showErrorNotice();
        return;
      }

      // dựa trên cờ status để quyết định hành động
      switch (this.status) {
        // TH thêm nhân viên mới
        case DATA_ACTION.ADD:
        case DATA_ACTION.SAVE_AND_ADD:
          this.addEmployee(isSaveAndAdd);
          break;

        // TH chỉnh sửa thông tin nhân viên
        case DATA_ACTION.EDIT:
          // Kiểm tra dữ liệu có bị thay đổi không
          // nếu không => đóng form ngay
          if (this.isChangedData() === false && isSaveAndAdd === false) {
            this.closeForm();
            return;
          }
          this.editEmployee(isSaveAndAdd);
          break;
      }
    },
    //#endregion

    //#region phương thức add, edit employee
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
     * Phương thức thực hiện Thêm mới dữ liệu
     * @param {Boolean} isSaveAndAdd
     * Cờ xác định người dùng ấn btn Cất và Thêm
     * @author pthieu (21-07-2021)
     */
    addEmployee: function (isSaveAndAdd = false) {
      // thiết lập trạng thái đang xử lý
      this.isProcessing = true;
      // trim các trường string trước khi gửi qua api
      this.trimStringPropInObject(this.employee);
      // gọi api thêm nhân viên mới
      employeeApi
        .postEntity(this.employee)
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
    editEmployee: function (isSaveAndAdd = false) {
      // thiết lập trạng thái đang xử lý
      this.isProcessing = true;
      // trim các trường string trước khi gửi qua api
      this.trimStringPropInObject(this.employee);
      // gọi api cập nhật dữ liệu nhân viên
      employeeApi
        .putEntity(this.dataEmployee.EmployeeId, this.employee)
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
};
</script>

<style scoped>
@import "../../css/common/icon.css";
@import "../../css/page/employee/employee-detail.css";
@import "../../css/page/employee/employee-detail-new.css";
</style>