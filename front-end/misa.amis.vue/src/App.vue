<template>
  <div id="app">
    <div id="toastContainer" class="top-right"></div>
    <TheMenu :collapse="isCollapsedMenu" @expandMenu="onToggleMenu"/>
    <div class="page-container">
      <TheHeader :expand="isCollapsedMenu" @collapseMenu="onToggleMenu"/>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue'
import TheMenu from './components/layout/TheMenu.vue'

export default {
  name: 'App',
  components: {
    TheMenu,
    TheHeader,
  },
   data() {
    return {
      // cờ xác định trạng thái thu hẹp/mở rộng của menu
      // true - menu thu hẹp, false - menu mở rộng
      isCollapsedMenu: false,
    }
  },
  methods: {
    /**
     * Phương thức thay đổi trạng thái thu hẹp/mở rộng menu
     * @author pthieu (18-08-2021)
     */
    onToggleMenu: function() {
      this.isCollapsedMenu = !this.isCollapsedMenu;
    },
  }
}
</script>

<style>
@import url("./lib/fontawesome-free-5.15.4-web/css/all.min.css");
@import url("./css/common/main.css");
@import url("./css/common/common.css");
@import url("./css/common/tooltip.css");
@import url("./css/layout/layout.css");
@import url("./css/layout/content.css");
</style>
