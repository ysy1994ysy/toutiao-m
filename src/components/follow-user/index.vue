<!--关注-->
<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
    :loading="loading"
  >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    :loading="loading"
  >关注</van-button>
</template>

<script>
// 加载关注和取消关注的api
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  components: {},
  props: {
    // 判断用户的已关注与未关注
    isFollowed: {
      type: Boolean,
      required: true
    },
    // 用户的id
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false // 按钮的加载状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onFollow () {
      try {
        this.loading = true // 关闭按钮加载的loadng状态
        if (this.isFollowed) {
          // 如果用户已关注,则取消关注
          await deleteFollow(this.userId)
          // 取消已关注更新按钮,让按钮变成关注
          // this.article.is_followed = false
        } else {
          //  如果用户没有关注,则关注
          await addFollow(this.userId)
          // 取消关注按钮,让按钮变成已关注
          // this.article.is_followed = true
        }
        // this.isFollowed = !this.isFollowed
        this.$emit('update:isFollowed', !this.isFollowed)
      } catch (err) {
        let message = '您不能关注自己'
        if (err.response && err.response.status === 400) {
          message = '操作失败,请稍后重试!'
        }
        this.$toast(message)
      }
      this.loading = false // 关闭按钮加载的loadng状态
    }
  }
}
</script>
<style lang="less" scoped></style>
