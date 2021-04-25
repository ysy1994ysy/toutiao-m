<!--收藏文章-->
<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{
      collected: value
    }"
    :loading="loading"
    @click="onCollect"
  ></van-button>
</template>
<script>
import { addCollectedArticles, deleteCollectedArticles } from '@/api/article'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Array, Object, Number],
      reuqired: true
    }
  },
  data() {
    return {
      loading: false // 文章得加载状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          // 如果收藏了,点击按钮取消收藏
          await deleteCollectedArticles(this.articleId)
        } else {
          // 如果没有收藏,点击按钮收藏
          await addCollectedArticles(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作错误,请稍后重试!')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
