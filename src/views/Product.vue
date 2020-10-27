<template>
  <div id="product">
    <van-nav-bar
      title="商品"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img class="swipeimg" v-lazy="image.img_url" />
      </van-swipe-item>
    </van-swipe>

    <div class="info">
      <span>30天无忧退货</span>
      <span>48小时快速退款</span>
      <span>满88元免邮费</span>
    </div>

    <div class="proinfo">
      <h3 class="title">{{ info.name }}</h3>
      <p class="brief">{{ info.goods_brief }}</p>
      <p class="price">￥{{ info.retail_price }}</p>
    </div>

    <van-cell title="请选择规格数量" is-link />

    <!-- 商品参数 -->
    <div class="proParams">
      <h3>商品参数</h3>
      <div class="proitem" v-for="(item, index) in attribute" :key="index">
        <span class="title">{{ item.name }}</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="prodetail" v-html="info.goods_desc"></div>
  </div>
</template>

<script>
import Axios from "axios";
import Vue from "vue";
import { Lazyload } from "vant";

Vue.use(Lazyload);
export default {
  props: ["id"],
  data() {
    return {
      data: {},
      info: {},
      attribute: [],
    };
  },
  computed: {
    images: function () {
      if (this.data.gallery == undefined) {
        return [];
      } else {
        return this.data.gallery;
      }
    },
  },

  async created() {
    let res = await Axios.get(this.$root.api.GoodsDetail, {
      params: { id: this.id },
    });
    console.log(res);
    this.data = res.data.data;
    this.info = this.data.info;
    this.attribute = this.data.attribute;
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less">
#product {
  .swipeimg {
    width: 100%;
  }

  .info {
    display: flex;
    justify-content: space-evenly;
    height: 24px;
    line-height: 24px;
    background-color: #efefef;
    font-size: 12px;
    color: #999;

    span {
      position: relative;
    }

    span::before {
      content: "";
      display: block;
      position: absolute;
      left: -10px;
      top: 8px;
      width: 4px;
      height: 4px;
      border-radius: 2px;
      border: 1px solid red;
    }
  }

  .proinfo {
    .title {
      font-weight: 500;
      padding: 5px;
    }
    .brief {
      font-size: 12px;
      color: #999;
      padding: 3px;
    }
    .price {
      font-size: 16px;
      color: red;
    }
  }
  .van-cell__title {
    text-align: left;
  }

  .proParams {
    padding-bottom: 20px;

    h3 {
      padding: 10px 0;
    }
    .proitem {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      height: 24px;
      color: #999;
      font-size: 12px;
      background-color: #efefef;
      line-height: 24px;

      span.title {
        width: 45px;
        padding: 0 10px;
        border-right: 1px solid #ccc;
      }
      span.value {
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .prodetail {
    width: 100%;

    img {
      width: 100%;
    }
    p {
      display: flex;
    }
  }
}
</style>