<template>
  <div class='search-container'>
    <!--顶部搜索start-->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
      <!-- 1、先判断有没有搜索结果,如果有所有结果,就展示所搜结果
        2、如果没有搜索结果,判断搜索框是否有内容,如果有内容并且获得焦点时,就展示搜索建议
        3、如果搜索框里没有内容,就展示搜索历史
       -->
      <!--搜索结果start-->
      <search-result
        v-if="isResultShow"
        :search-text="searchText"
      ></search-result>
      <!--搜索结果end-->
      <!--搜索建议start-->
      <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
      ></search-suggestion>
      <!--搜索建议end-->
      <!--搜索历史记录start-->
      <search-history
        v-else
        :search-histories="searchHistories"
        @clear-search-histories="searchHistories = []"
        @search="onSearch"
      >
      </search-history>
      <!--搜索历史记录end-->
    </form>
    <!--顶部搜索end-->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '', // 搜索框的文本内容
      isResultShow: false, // 控制搜索结果的显示与隐藏
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 如果有本地存储的历史记录,就展示本地存储搜索的历史记录,否则不展示
    }
  },
  computed: {},
  watch: {
    searchHistories (val) {
      setItem('TOUTIAO_SEARCH_HISTORIES', val)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch(val) {
      // console.log(val)
      // 点击搜索后,更新搜索框内容
      this.searchText = val
      // 展示搜索历史记录
      // 1.先判断搜索的内容在存储搜索历史记录searchHistories中不,如果在,先删除历史记录中的内容
      // 2.然后,将文本框中的内容追加到数组中,展示在最前面unshift
      // 3.如果没有在搜索历史记录中,则直接追加到数组中,展示在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 展示搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>
<style lang='less' scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .van-search {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }

}
</style>
