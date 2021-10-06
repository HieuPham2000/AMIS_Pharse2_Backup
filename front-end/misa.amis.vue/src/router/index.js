import Vue from "vue";
import VueRouter from "vue-router";

import EmployeePage from '../views/employee/EmployeePage.vue';
import CashPage from '../views/cash/CashPage.vue';

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/employee" },
  { path: "/employee", component: EmployeePage, meta: {title: "Quản lý nhân viên | AMIS Kế Toán"} },
  { path: "/cash", component: CashPage, meta: {title: "Tiền mặt | AMIS Kế Toán"} }
];

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

// set title
const DEFAULT_TITLE = 'AMIS Kế Toán';
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;