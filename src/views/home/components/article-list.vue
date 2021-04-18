<template>
  <div class="article-list">
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。
      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件
      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
        List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，
        数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
     -->
    <!--下拉刷新start-->
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="isRefreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >

        <!--<van-cell v-for="(article,index) in list" :key="index" :title="article.title" />-->
        <article-item v-for="(article,index) in list" :key="index" :article="article" />
      </van-list>
    </van-pull-refresh>
    <!--下拉刷新end-->
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载状态,true表示需要加载，false不需要加载
      finished: false, // 数据加载结束的状态,ture加载完成了,false加载没有完成
      timestamp: null, // 请求加载第二页的时间戳
      error: false, // 获取数据失败的提示信息
      isRefreshLoading: false, // 下拉刷新的loading状态
      isRefreshSuccessText: '' // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    // 加载列表数据
    async onLoad() {
      try {
        // 1.获取用户数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐,数据当前的时间戳，请求历史推荐指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 2.把获取到的数据存储到list数组中
        const { results } = data.data
        // 利用数组的扩展运算符，将数组中的值解构出来，然后将值追加到list数组中
        this.list.push(...results)
        // 3.判断加载loading状态，是否继续加载
        this.loading = false
        // 4.判断加载是否结束结束
        if (results.length) {
          // 更新获取下一页数据,pre_timestamp是求下一页历史数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不在加载数据了
          this.finished = true
        }
      } catch (err) {
        // 当捕捉到错误时，给用户展示错误的消息
        this.error = true
        // 当出现错误时，停止加载数据
        this.loading = false
      }
    },
    // 下拉刷新
    async onRefresh() {
      try {
        // 1.获取用户数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now(), // 时间戳,请求新的推荐数据,当前的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 2.将获取到的数据追加到数组顶部
        const { results } = data.data
        // 利用数组的扩展运算符，将数组中的值解构出来，然后将值追加到list数组中
        this.list.unshift(...results)
        // 3.关闭下拉loading状态
        this.isRefreshLoading = false
        this.isRefreshSuccessText = `刷新成功更新了${results.length}条数据`
      } catch (error) {
        console.log('刷新失败', error)
        // 关闭下拉loading状态
        this.isRefreshLoading = false
        this.$toast('下拉失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 设置滚动容器，1vh=可视窗口高度的百分之一,高度是响应式的,1vw=可视窗口宽度的百分之一,宽度也是响应式的
.article-list {
  //height: clac(100vh-274px);
  height: 79vh;
  overflow-y: auto;
}
</style>
