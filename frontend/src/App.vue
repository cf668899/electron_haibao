<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  setup() {
    document.getElementById('loadingPage').remove()
  },
}
</script>
<style lang="less">
.commonTitle {
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
}
</style>
