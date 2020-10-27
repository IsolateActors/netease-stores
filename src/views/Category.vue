<template>
  <div class="category">
    <!-- 搜索框 -->
    <van-search
      v-model="searchData"
      placeholder="搜索商品, 共44571款好物"
      input-align="center"
    ></van-search>

    <!-- 侧边栏 -->
    <van-tree-select
      height="calc(100vh - 104px)"
      :items="items"
      :main-active-index.sync="activeIndex"
      @click-nav="changeRight(activeIndex)"
    >
      <!-- 内容区 -->
      <template #content>
        <van-image :src="bannerImg" />

        <van-grid :column-num="3">
          <van-grid-item
            v-for="(item, index) in subCategoryList"
            :key="index"
            :text="item.name"
            :to="'/categoryList/' + item.id"
          >
            <!-- 内容图标 -->
            <template #icon>
              <van-image lazy-load :src="item.wap_banner_url" />
            </template>
          </van-grid-item>
        </van-grid>
      </template>
    </van-tree-select>

    <tab-btn></tab-btn>
  </div>
</template>

<script>
import tabBtn from "../components/tabBtn";
import axios from "axios";
import api from "../assets/config/api";

import Vue from "vue";
import { Lazyload } from "vant";
Vue.use(Lazyload);

export default {
  data() {
    return {
      searchData: "",
      activeIndex: 0,
      subCategoryList: [],
      data: {},
      bannerImg: "",
    };
  },
  computed: {
    items: function () {
      // [{ text: "分组 1" }, { text: "分组 2" }]
      //console.log(this.data.categoryList);
      if (this.data.categoryList == undefined) {
        return [];
      } else {
        let arr = [];
        this.data.categoryList.forEach((item, index) => {
          item.text = item.name;
          arr.push(item);
        });
        //console.log(arr);
        return arr;
      }
    },
  },
  watch: {
    activeIndex: async function () {
      if (this.items.length != 0) {
        // console.log(this.items);
        // console.log(this.items[this.activeIndex].subCategoryList);

        let id = this.items[this.activeIndex].id;
        console.log(id);
        let res = await axios.get(api.CatalogCurrent, {
          params: {
            id: id,
          },
        });
        //console.log(res.data);
        this.subCategoryList = res.data.data.currentCategory.subCategoryList;
        this.bannerImg = res.data.data.currentCategory.banner_url;
      } else {
        this.subCategoryList = [];
      }
    },
  },
  async created() {
    let res = await axios.get(api.CatalogList);
    let data = res.data;
    this.data = data.data;
    console.log(data);
    this.subCategoryList = data.data.currentCategory.subCategoryList;
    this.bannerImg = data.data.currentCategory.banner_url;
  },
  components: {
    tabBtn,
  },
  methods: {
    changeRight: function (index) {
      //console.log(index);
      this.activeIndex = index;
    },
  },
};
</script>