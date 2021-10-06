import Vue from 'vue'
 
import BaseToastMessage from '../../components/base/toast/BaseToastMessage.vue'
 

const ToastConstructor = Vue.extend(BaseToastMessage);
 
/**
 * Thêm toast message mới
 * @param {String} type Loại toast
 * @param {String} message Nội dung toast
 * @param {Number} duration Thời gian hiện trước khi biến mất
 * @author pthieu (23-07-2021)
 */
function showToast(type, message, duration = 4000) {
  
  const toastDom = new ToastConstructor({
    el: document.createElement('div'),
    propsData: {
        type: type,
        message: message,
      }
  });

  // lấy ra toast container
  const toastContainer = document.querySelector("#toastContainer");
  // set thời gian auto remove toast
  var timeOut = setTimeout(() => {toastContainer.removeChild(toastDom.$el)}, duration);
  // remove toast khi click
  toastDom.$el.onclick = function() {
    toastContainer.removeChild(toastDom.$el);
    clearTimeout(timeOut);
  }
  // append toast message mới tạo vào
  toastContainer.appendChild(toastDom.$el);
}

/**
 * Đăng ký $toast
 */
function registryToast() {
  Vue.prototype.$toast = showToast;
}
export default registryToast;