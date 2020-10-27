<template>
  <div id="categoryList">
    <h3>产品分类列表</h3>
    <van-tabs v-model="tabActive">
      <van-tab
        v-for="(item, index) in goodsCategoryList"
        :key="index"
        :title="item.name"
      >
        <h4>{{ item.name }}</h4>
        <p>{{ item.front_name }}</p>

        <div v-if="item.goodsList">
          <van-grid :border="true" :column-num="2">
            <van-grid-item
              v-for="(citem, index) in item.goodsList.data"
              :key="index"
              :to="'/product/' + citem.id"
            >
              <van-image width="100" height="100" :src="citem.list_pic_url" />
              <h5 class="van-ellipsis">{{ citem.name }}</h5>
              <p class="price">¥{{ citem.retail_price }}</p>
            </van-grid-item>
          </van-grid>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  props: ["id"],
  data() {
    return {
      tabActive: 0,
      goodsCategoryList: [],
    };
  },
  async created() {
    // console.log(this.id);
    // console.log(this.$root.api);
    let res = await Axios.get(this.$root.api.GoodsCategory, {
      params: { id: this.id },
    });
    // console.log(res);
    this.goodsCategoryList = res.data.data.brotherCategory;

    this.goodsCategoryList.forEach(async (item, index) => {
      item.goodsList = await this.getlist(item.id, 1);
      this.$forceUpdate();
    });
  },
  methods: {
    async getlist(cid, page) {
      let res = await Axios.get(this.$root.api.GoodsList, {
        params: { categoryId: cid, page, size: 20 },
      });
      console.log(res.data.data);
      return res.data.data;
    },
  },
};
</script>

<style lang="less">
#categoryList {
  .van-ellipsis {
    width: 100%;
    padding: 10px 10px;
  }

  .van-grid-item {
    overflow: hidden;
  }
  .price {
    color: red;
  }
}
</style>