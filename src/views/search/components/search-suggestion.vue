<template>
  <div class='search-suggestion'>
      <van-cell
        v-for="(text, index) in suggestions"
        :key="index"
        icon="search"
        @click="$emit('search',text)"
      >
        <div slot="title" v-html="highLight(text)"></div>
      </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 导入处理搜索框防抖的包
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 存储搜索建议的数组
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 监听searchText(搜索框)的变化
      // debounce:第一个参数是处理函数(要防抖动的处理函数),第二个参数是延迟时间
      // handler: debounce(处理函数, 延迟时间)
      // handler: debounce(function (val) {
      //   console.log(val)
      // }, 1000),
      handler: debounce(function (val) {
        this.getSearchSuggestions(val)
      }, 500),
      // 该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    async getSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('获取搜索建议失败,请稍后重试!')
      }
    },
    highLight (text) {
      // 采用正则表达式进行匹配
      const htmlStr = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, htmlStr)
    }
  }
}
</script>
<style lang='less' scoped>
.search-suggestion {
  /deep/.active {
    color: #3296fa;
  }
}
</style>
