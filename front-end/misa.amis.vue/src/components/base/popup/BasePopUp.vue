<template>
<transition name="fade">
  <div class="ms-popup-bg">
    <div class="ms-popup">

      <!-- Nội dung pop up -->
      <div class="popup-content">
        <div class="popup-icon">
          <slot name="icon"></slot>
        </div>
        <div class="popup-msg">
          <slot name="message"></slot>
        </div>
      </div>
      <div class="popup-line"></div>
      <div class="popup-footer">
        <div class="footer-left">
          <slot name="footer-left"></slot>
        </div>
        <div class="footer-center">
          <slot name="footer-center"></slot>
        </div>
        <div class="footer-right">
          <slot name="footer-right"></slot>
        </div>
        
      </div>
    </div>
  </div>
</transition>
</template>

<style>
@import "../../../css/common/pop-up.css";
.fade-enter-active, .face-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .face-leave-to {
  opacity: 0;
}

</style>

<script>
export default {
  name: "BasePopUp"
};
</script>