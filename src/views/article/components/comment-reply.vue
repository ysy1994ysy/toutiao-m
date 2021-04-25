<template>
  <div class="comment-reply">
    <!--导航栏start-->
    <van-nav-bar
      title="comment.reply_count > 0 ? `comment.reply_count${条评论}` : '暂无回复'"
    >
      <van-icon
      slot="left"
      name="cross"
      @click="$emit('close')"
      />
    </van-nav-bar>
    <!--导航栏end-->
    <div class='scroll-wrap'>
      <!-- 评论项start-->
      <comment-item :comment="comment"></comment-item>
      <!-- 评论项end-->
      <!--评论列表start-->
      <van-cell title='全部回复'></van-cell>
      <comment-list
        :source="comment.com_id"
        type="c"
        :list="commentList"
      ></comment-list>
      <!--评论列表end-->
    </div>
    <!--发布评论start-->
    <div class='post-wrap'>
      <van-button
        class='post-btn'
        round
        size='small'
        @click="isPostShow = true"
      >写评论</van-button>
    </div>
    <!--发布评论end-->
    <!--发布评论的弹出层start-->
    <van-popup
      v-model="isPostShow"
      position='bottom'
    >
      <comment-post
        :target='comment.com_id'
        @post-success='onPostSuccess'
      ></comment-post>
    </van-popup>
    <!--发布评论的弹出层end-->
  </div>
</template>

<script>
// 导入comment-item评论项
import CommentItem from './comment-item'
// 导入评论列表组件
import CommentList from './comment-list'
// 导入发布评论的组件
import CommentPost from './comment-post'
export default {
  name: 'CommentReply',
  components: {
    CommentItem, // 评论项
    CommentList, // 评论列表
    CommentPost // 发布评论
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPostShow: false,
      commentList: [] // 回复的数组列表
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onPostSuccess (data) {
    // 1.回复条数
      this.comment.reply_count++
      // 2.关闭弹出层
      this.isPostShow = false
      // 3.将数据追加到list数组的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>
<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-top:1px solid #d8d8d8;
  .post-btn {
    width: 80%;
  }
}
</style>
