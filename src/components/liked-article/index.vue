<!--点赞-->
<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{
      liked: value === 1
    }"
    :loading="loading"
    @click="liked"
  ></van-button>
</template>
<script>
import { addLikededArticles, deleteLikedArticles } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, Array, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async liked() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          //  如果用户点赞了,则取消点赞
          await deleteLikedArticles(this.articleId)
        } else {
          // 如果用户没有点赞,则进行点赞
          await addLikededArticles(this.articleId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败,请稍后重试')
      }
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
