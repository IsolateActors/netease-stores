<template>
  <van-tabbar v-model="tabActive" route>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="cashier-o">专题</van-tabbar-item>
    <van-tabbar-item icon="apps-o" to="/category">分类</van-tabbar-item>
    <van-tabbar-item icon="shopping-cart-o" to="buycart"
      >购物车</van-tabbar-item
    >
    <van-tabbar-item icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  data: function () {
    return {
      tabActive: 0,
    };
  },
  mounted() {
    // console.log(this.tabActive);
    // console.log(this);
    switch (this.$route.path) {
      case "/":
        this.tabActive = 0;
        break;
      case "/category":
        this.tabActive = 2;
        break;
      default:
        this.tabActive = 0;
    }
  },
};
</script>

<style>
</style>