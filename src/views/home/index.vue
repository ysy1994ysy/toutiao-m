<!--首页-->
<template>
  <div class="home-container">
  <!--导航栏start-->
    <van-nav-bar class="page-nav-bar" fixed>
    <!--搜索框start-->
      <van-button
        class="search-btn"
        slot="title"
        size="small"
        type="info"
        round
        icon="search"
      >搜素</van-button>
    <!--搜索框end-->
    </van-nav-bar>
  <!--导航栏end-->
  <!--频道列表标签栏start-->
  <!--swipeable开启手势滑动切换，animated开启切换标签内容时的转场动画,active被激活的标签-->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated>
      <!--遍历用户信息pannels，获取用户信息-->
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
      <!--用户频道列表start-->
      <article-list :channel="channel"></article-list>
      <!--用户频道列表end-->
      </van-tab>
      <!--更多start-->
      <!--汉堡按钮start-->
      <!--右侧占位符，防止最后一个频道列表标签栏被挡住start-->
      <div slot="nav-right" class="placeholder"></div>
      <!--右侧占位符，防止最后一个频道列表标签栏被挡住end-->
      <div slot="nav-right" class="hamburger-btn">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
      <!--汉堡按钮end-->
      <!--更多end-->
    </van-tabs>
  <!--频道列表标签栏end-->
  </div>
</template>

<script>
// 导入获取用户频道信息的数据
import { getUserChannels } from '@/api/user'
// 导入子组件
import ArticleList from './components/article-list'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [] // 用户频道的信息的数据
    }
  },
  computed: {},
  watch: {},
  created () {
    this.localChannels() // 加载用户频道的信息的数据
  },
  mounted () {},
  methods: {
    async localChannels () {
      try {
        const { data } = await getUserChannels()
        // console.log(data)
        this.channels = data.data.channels
      } catch (err) {
        this.$toast('获取用户频道信息失败！')
      }
    }
  }
}
</script>
<style scoped lang="less">
.home-container {
  padding-top: 174px;
  margin-bottom: 100px; // 为了让加载数据的时候能看到底部，加载中的几个文字
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    height: 64px;
    width: 555px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
      color: #fff;
    }
  }
  // /deep/ 样式穿透 scoped引起的
  /deep/.channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      right: 0;
      left: 0;
      z-index: 999;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      font-size: 30px;
      color: #777;
      border-right:1px solid #edeff3;
    }
    .van-tab--active {
      color: #333;  // 选中的那个字体颜色
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px!important;
      height: 6px;
      bottom: 8px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0; // 让该元素参与父元素的flex计算中
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;  // 透明度
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
