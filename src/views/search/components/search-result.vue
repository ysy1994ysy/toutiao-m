<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(result, index) in list"
        :key="index"
        :title="result.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 搜索结果的页码
      per_page: 20, // 每页展示的搜索结果的数量
      error: false // 错误展示状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const { data } = await getSearchResults({
          page: 1, // 页数，不传默认为1
          per_page: this.per_page, // 每页数量，不传每页数量由后端决定
          q: this.searchText // 搜索关键字
        })
        // console.log(data)
        // 2.将搜索结果追加到数组中
        const { results } = data.data
        this.list.push(...results)
        // 3.关闭加载状态loading
        this.loading = false
        // 4.判断是否加载完成
        if (this.results) {
          // 没有加载完成，加载下一页
          this.page++
        } else {
          // 加载完成,将finish设置为 true,已经完成加载
          this.finished = true
        }
      } catch (err) {
        // 如果加载失败了
        // 1.关闭loading,停止加载
        this.loading = false
        // 2.将error设置为true,点击按钮重新加载
        this.error = true
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
