<template>
<!--van-list组件到达可视窗口时,才会渲染-->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
    :immediate-check="false"
    @load="onLoad"
  >
    <!--评论start-->
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
    <!--评论end-->
  </van-list>
</template>

<script>
// 导入评论的接口
import { getComments } from '@/api/getComments'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem // 评论项
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
    type: {
      type: String,
      // validator自定义验证函数会将该 prop 的值作为唯一的参数代入,自定义数据的验证
      validator: (value) => {
        return ['a', 'c'].includes(value)
      },
      default: 'a' // type的默认值
    },
    // 评论列表
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      limit: 10, // 每页数据的条数
      error: false // 加载失败
    }
  },
  computed: {},
  watch: {},
  created() {
    // 当你手动onload的时候,他并不会开启loading,所以我们要手动开启loading加载状态
    this.loading = true
    this.onLoad()
  },
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const { data } = await getComments({
          source: this.source.toString(), // 源id，文章id或评论id
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // console.log(data)
        // 2.将数据追加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 将数据传递给父组件
        this.$emit('onload-success', data.data)
        // 3.关闭loading
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          // 还有数据,继续加载下一页数据
          this.offset = data.data.last_id
        } else {
          // 没有数据,加载完成
          this.finished = true
        }
      } catch (err) {
        // 开启错误
        this.error = true
        // 关闭loading
        this.loading = false
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
