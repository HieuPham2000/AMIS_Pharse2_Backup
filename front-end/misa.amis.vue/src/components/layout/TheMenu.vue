<template>
  <div :class="['menu', {'collapse': collapse}]">
    <div class="logo-container">
      <a href="#" class="menu-option" tabindex="-1">
        <div v-if="collapse" class="ms-icon ms-icon-24 ms-icon-sidebar-toggle" @click="onExpandMenu"></div>
        <div v-else class="ms-icon ms-icon-24 ms-icon-menu-option"></div>
      </a>
      <a href="#" class="logo" tabindex="-1"></a>
    </div>
    <div class="menu-item-container scroll-container">
      <router-link
        v-for="menuItem in menuItems"
        :key="menuItem.text"
        :to="menuItem.route"
        class="menu-item"
        exact-active-class="active"
        tabindex="-1"
      >
        <div class="menu-item-icon">
          <div :class="['ms-icon', 'ms-icon-24', menuItem.icon]"></div>
        </div>
        <div class="menu-item-text">{{ menuItem.text }}</div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
@import url("../../css/layout/menu.css");
@import url("../../css/common/icon.css");
</style>

<script>
export default {
  name: "TheMenu",
  props: {
    collapse: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      menuItems: [
        {
          text: "Tổng quan",
          icon: "ms-icon-sidebar-dashboard",
          route: "/",
        },
        {
          text: "Danh mục",
          icon: "ms-icon-sidebar-employee",
          route: "/employee",
        },
        {
          text: "Tiền mặt",
          icon: "ms-icon-sidebar-cash",
          route: "/cash",
        },
        {
          text: "Tiền gửi",
          icon: "ms-icon-sidebar-deposit",
          route: "/deposit",
        },
        {
          text: "Mua hàng",
          icon: "ms-icon-sidebar-purchase",
          route: "/purchase",
        },
        {
          text: "Bán hàng",
          icon: "ms-icon-sidebar-sell",
          route: "/sell",
        },
        {
          text: "Quản lý hóa đơn",
          icon: "ms-icon-sidebar-invoice",
          route: "/invoice",
        },
        {
          text: "Kho",
          icon: "ms-icon-sidebar-stock",
          route: "/stock",
        },
        {
          text: "Công cụ dụng cụ",
          icon: "ms-icon-sidebar-tool",
          route: "/tool",
        },
        {
          text: "Tài sản cố định",
          icon: "ms-icon-sidebar-fixed-asset",
          route: "/asset",
        },
        {
          text: "Thuế",
          icon: "ms-icon-sidebar-tax",
          route: "/tax",
        },
        {
          text: "Giá thành",
          icon: "ms-icon-sidebar-price",
          route: "/price",
        },
        {
          text: "Tổng hợp",
          icon: "ms-icon-sidebar-general",
          route: "/general",
        },
        {
          text: "Ngân sách",
          icon: "ms-icon-sidebar-budget",
          route: "/budget",
        },
        {
          text: "Báo cáo",
          icon: "ms-icon-sidebar-report",
          route: "/report",
        },
        {
          text: "Phân tích tài chính",
          icon: "ms-icon-sidebar-finance",
          route: "/finance",
        },
      ],
    };
  },
  methods: {

    /**
     * Phương thức xử lý khi ấn nút mở rộng menu
     * @author pthieu (18-08-2021)
     */
    onExpandMenu() {
      this.$emit("expandMenu");
    }
  }
};
</script>