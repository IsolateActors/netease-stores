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

    <van-goods-action>
      <van-goods-action-icon
        :badge="
          $store.state.cartTotal.goodsCount == 0
            ? ''
            : $store.state.cartTotal.goodsCount
        "
        to="/buycart"
        icon="cart-o"
        text="购物车"
      />
      <van-goods-action-icon icon="star-o" text="收藏" />
      <van-goods-action-button
        @click="chooseSku"
        type="warning"
        text="加入购物车"
      />
      <van-goods-action-button type="danger" text="立即购买" />
    </van-goods-action>

    <!-- sku -->
    <van-sku
      v-model="skushow"
      :sku="sku"
      :goods="goods"
      :hide-stock="sku.hide_stock"
      @buy-clicked="onBuyClicked"
      @add-cart="onAddCartClicked"
    />
  </div>
</template>

<script>
import Axios from "axios";

let sku = {
  // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
  // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
  tree: [],
  //所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
  list: [],
  price: "", // 默认价格（单位元）
  stock_num: 0, // 商品总库存
  //   collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
  //   none_sku: false, // 是否无规格商品

  hide_stock: false, // 是否隐藏剩余库存
};
export default {
  props: ["id"],
  data() {
    return {
      data: {},
      info: {},
      attribute: [],
      skushow: false,
      show: true,
      sku: sku,
      goods: {
        // 默认商品 sku 缩略图
        picture: "https://img.yzcdn.cn/1.jpg",
      },
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
    // 初始状态管理
    this.$store.dispatch("ajaxCartlist");

    let res = await Axios.get(this.$root.api.GoodsDetail, {
      params: { id: this.id },
    });
    console.log(res);
    this.data = res.data.data;
    this.info = this.data.info;
    this.attribute = this.data.attribute;
    this.goods.picture = this.info.primary_pic_url;
    this.sku.price = this.info.retail_price;
    this.sku.stock_num = this.info.goods_number;

    let tree = [];
    let k_s = [];
    this.data.specificationList.forEach((item, index) => {
      k_s.push("s" + item.specification_id);
      let arr = [];
      item.valueList.forEach((product, i) => {
        arr.push({
          id: product.id,
          name: product.value,
        });
      });
      tree.push({
        k: item.name, // skuKeyName：规格类目名称
        k_s: "s" + item.specification_id, // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
        v: arr,
        largeImageMode: false, //  是否展示大图模式
      });
    });

    this.sku.tree = tree;

    let list = [];
    let stockCount = 0;
    this.data.productList.forEach((item, index) => {
      stockCount += item.goods_number;
      let kv = item.goods_specification_ids.split("_");
      list.push({
        id: item.goods_id, // skuId
        [k_s[0]]: kv[0], // 规格类目 k_s 为 s1 的对应规格值 id
        [k_s[1]]: kv[1], // 规格类目 k_s 为 s2 的对应规格值 id
        price: item.retail_price * 100, // 价格（单位分）
        stock_num: item.goods_number, // 当前 sku 组合对应的库存
      });
    });
    this.sku.list = list;
    this.sku.stock_num = stockCount;
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onBuyClicked() {
      console.log("将当前内容提交到订单");
    },
    async onAddCartClicked(skuData) {
      console.log("选择商品规格并提交购物车");
      console.log(skuData);

      let chooseContent =
        skuData.selectedSkuComb["s1"] + "_" + skuData.selectedSkuComb["s2"];
      console.log(chooseContent);
      let resPro = this.data.productList.filter((item, index) => {
        if (item.goods_specification_ids == chooseContent) {
          return true;
        } else {
          return false;
        }
      });
      console.log(resPro);

      let cartRes = await Axios.post(this.$root.api.CartAdd, {
        goodsId: resPro[0].goods_id,
        number: skuData.selectedNum,
        productId: resPro[0].id,
      });
      console.log(cartRes.data);
      if (cartRes.data.errno == 0) {
        this.$store.commit("setCarList", cartRes.data.data.cartList);
        this.$store.commit("setCartTotal", cartRes.data.data.cartTotal);
      } else {
        console.log(cartRes.data.errmsg);
      }

      this.skushow = false;
    },
    chooseSku() {
      this.skushow = true;
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