<template>
  <div class="header">
    <div v-show="!expand" class="btn-toggle-menu header-btn" @click="collapseMenu">
      <div class="ms-icon ms-icon-24 ms-icon-toggle"></div>
    </div>
    <div class="header-company">
      <div class="header-company-name">CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI - DỊCH VỤ QUI PHÚC</div>
      <div class="header-company-btn header-btn">
        <div class="ms-icon ms-icon-14 ms-icon-chevron-down"></div> 
      </div>
    </div>
    <div class="ms-flex-space"></div>
    <div class="notify header-btn">
      <div class="ms-icon ms-icon-24 ms-icon-bell"></div>
    </div>
    <div class="account-info">
      <div class="account-avatar"></div>
      <div class="account-name">Phạm Trung Hiếu</div>
      <div class="account-btn header-btn">
        <div class="ms-icon ms-icon-14 ms-icon-chevron-down-light"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("../../css/common/common.css");
@import url("../../css/common/icon.css");
@import url("../../css/layout/header.css");
</style>

<script>
export default {
  name: 'TheHeader',
  props: {
    expand: {
      type: Boolean,
      required: false,
      default: false
    }
  },
   methods: {
    /**
     * Mở rông/thu hẹp menu
     * @author pthieu (18-08-2021)
     */
    collapseMenu() {
      this.$emit("collapseMenu");
    },
  }
}
</script>