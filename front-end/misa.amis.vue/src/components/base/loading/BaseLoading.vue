<template>
    <div class="ms-loading-container">
      <div class="loader">
        <object :data="loaderUrl"></object>
        <!-- <object data="/loading.svg"></object> -->
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      loaderUrl: require('../../../assets/img/loading.svg'),
    }
  },
};
</script>
<style scoped>
@import url("../../../css/common/loading.css");
</style>