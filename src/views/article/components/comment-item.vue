<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{comment.aut_name}}</div>
      <van-button
        class="like-btn"
        :class="{
          liked: comment.is_liking
        }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :loading="commentLoading"
        @click="onCommentLiked"
      >
        {{comment.like_count || '赞'}}
      </van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{comment.content}}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{comment.pubdate | relativeTime}}</span>
        <van-button
          class="reply-btn"
          round
          @click="$emit('reply-click',comment)"
        >回复{{comment.reply_count}}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentsLiked, deleteCommentsLiked } from '@/api/getComments'

export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      commentLoading: false // 评论点赞的加载状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onCommentLiked () {
      this.commentLoading = true
      try {
        if (this.comment.is_liking) {
          // console.log(222)
          // 如果用户已经点赞了,则取消点赞
          await deleteCommentsLiked(this.comment.com_id)
          // 取消点赞,则取消点赞的数字
          this.comment.like_count--
        } else {
          // 如果用户没有点赞,则进行点赞
          await addCommentsLiked(this.comment.com_id)
          // 增加点赞,则增加点赞的个数
          this.comment.like_count++
        }
        // 更新视图
        this.comment.is_liking = !this.comment.is_liking
      } catch (err) {
        console.log(err)
        this.$toast('操作失败,请重试！')
      }
      this.commentLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: #E5645F;
    }
  }
}
</style>
