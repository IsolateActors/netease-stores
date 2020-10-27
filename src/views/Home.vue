<template>
  <div class="home">
    <van-search
      v-model="searchData"
      placeholder="搜索商品, 共44571款好物"
      input-align="center"
    ></van-search>

    <van-swipe :autoplay="3000" :width="375" :height="200">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img class="swiperimg" v-lazy="image.image_url" />
      </van-swipe-item>
    </van-swipe>

    <van-grid :column-num="5" :border="false">
      <van-grid-item
        v-for="(item, index) in channel"
        :key="index"
        :icon="item.icon_urlxxx"
        :text="item.name"
      />
    </van-grid>

    <div class="brandlist">
      <van-cell-group>
        <van-cell title="品牌制造商提供" />
        <van-grid :column-num="2" :border="false">
          <van-grid-item v-for="(item, index) in brandList" :key="index">
            <van-image :src="item.new_pic_url"></van-image>
            <h4 class="title">{{ item.name }}</h4>
            <p class="price">{{ item.floor_price }}元起</p>
          </van-grid-item>
        </van-grid>
      </van-cell-group>
    </div>

    <div class="newGoodsList">
      <van-cell-group>
        <van-cell title="新品推荐" />
        <van-grid :column-num="2" :border="false">
          <van-grid-item v-for="(item, index) in newGoodsList" :key="index">
            <van-image lazy-load :src="item.list_pic_url"></van-image>
            <h4 class="title van-ellipsis">{{ item.name }}</h4>
            <p class="price">{{ item.retail_price }}元起</p>
          </van-grid-item>
        </van-grid>
      </van-cell-group>
    </div>

    <div class="hotGoodsList">
      <van-cell-group>
        <van-cell title="人气推荐" />
        <van-card
          v-for="(item, index) in hotGoodsList"
          :key="index"
          :price="item.retail_price"
          :desc="item.goods_brief"
          :title="item.name"
          :thumb="item.list_pic_url"
        />
      </van-cell-group>
    </div>

    <tab-btn></tab-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import api from "../assets/config/api";

import Vue from "vue";
import { Lazyload } from "vant";

import tabBtn from "../components/tabBtn";

Vue.use(Lazyload);

export default {
  name: "Home",
  data: function () {
    return {
      searchData: "",
      data: {},
      tabActive: 0,
    };
  },
  computed: {
    images: function () {
      if (typeof this.data.banner == "object") {
        return this.data.banner;
      } else return [];
    },
    channel: function () {
      if (typeof this.data.channel == "object") {
        return this.data.channel;
      } else return [];
    },
    brandList: function () {
      if (typeof this.data.brandList == "object") {
        return this.data.brandList;
      } else return [];
    },
    newGoodsList: function () {
      if (typeof this.data.newGoodsList == "object") {
        return this.data.newGoodsList;
      } else return [];
    },
    hotGoodsList: function () {
      if (typeof this.data.hotGoodsList == "object") {
        return this.data.hotGoodsList;
      } else return [];
    },
  },
  components: {
    tabBtn,
  },
  async mounted() {
    //console.log(api);
    let res = await axios.get(api.IndexUrl);
    console.log(res.data);
    this.data = res.data.data;
  },
};
</script>

<style lang="less">
.home {
  .swiperimg {
    width: 375px;
    height: 200px;
  }

  .brandlist {
    .van-grid-item__content {
      padding: 0;
    }

    .van-image {
      border: 1px solid #fff;
    }

    .title {
      position: absolute;
      top: 20px;
      left: 10px;
      margin: 0;
      font-size: 16px;
    }
    .price {
      position: absolute;
      top: 40px;
      left: 10px;
      margin: 0;
      font-size: 12px;
      color: #ccc;
    }
  }

  .newGoodsList {
    .van-grid-item {
      overflow: hidden;
    }

    .title {
      margin: 0;
      width: 90%;
      font-size: 16px;
    }

    .price {
      margin: 0;
      width: 90%;
      font-size: 12px;
      color: #ccc;
    }
  }

  .hotGoodsList {
    margin-bottom: 50px;

    .van-card__content {
      justify-content: center;
      text-align: left;
    }

    .van-card__price {
      color: red;
    }

    .van-card__title {
      font-weight: 900;
      color: #333;
      font-size: 14px;
      padding: 5px 0;
    }
  }
}
</style>