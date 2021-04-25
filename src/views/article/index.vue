<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="头条mobile"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail markdown-body" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!--          <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="onFollowLoading"
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
            :loading="onFollowLoading"
          >关注</van-button>-->
          <!--模板中的$event是事件参数
            1.当我们传递给子组件的值既要使用也要修改时,我们可以使用v-model数据双向绑定,但是v-model只能修改一个数据,如果有多个数据需要使用.sync
            传递:props  :is-followed="article.is_followed"
            修改:自定义事件  @updata-is_followed="article.is_followed = $event"
            简写形式: 在组件上使用v-model等价于
            value="article.is_followed"
            @input="article.is_followed = $event"
            :is-followed.sync="article.is_followed"
          -->
          <!--关注start-->
          <!--@updata-is_followed="article.is_followed = $event"-->
          <follow-user
            class="follow-btn"
            :is-followed.sync="article.is_followed"
            :user-id="article.aut_id"
          ></follow-user>
          <!--关注end-->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!--评论列表start-->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentsCount = $event.total_count"
          @reply-click="onReplayClick"
        ></comment-list>
        <!--评论列表end-->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <!-- 写评论start -->
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <!-- 写评论end -->
          <!-- 信息start -->
          <van-icon name="chat-o" :badge="totalCommentsCount" />
          <!-- 信息end -->
          <!-- 收藏start -->
          <collect-article
            v-model="article.is_collected"
            class="btn-item"
            :article-id="article.art_id"
          ></collect-article>
          <!-- 收藏end -->
          <!-- 点赞start -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          ></like-article>
          <!-- 点赞end -->
          <!-- 转发start -->
          <van-icon name="share" color="#777777"></van-icon>
          <!-- 转发end -->
        </div>
        <!-- /底部区域 -->
        <!--评论弹出层start-->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
          :target="article.art_id"
          @post-success="onPostSuccess"
          ></comment-post>
        </van-popup>
        <!--评论弹出层end-->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!--评论回复弹出层start-->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 100%"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment='currentComment'
        @close='isReplyShow = false'
      ></comment-reply>
    </van-popup>
    <!--评论回复弹出层end-->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
// 加载图片预览
import { ImagePreview } from 'vant'
// 添加关注和取消关注的组件
import FollowUser from '@/components/follow-user'
//  加载收藏文章的组件
import CollectArticle from '@/components/collect-article'
// 加载点赞文章的组件
import LikeArticle from '@/components/liked-article'
// 导入文章评论的组件
import CommentList from './components/comment-list'
// 导入发布评论弹出层的组件
import CommentPost from './components/comment-post'
// 导入回复评论的弹出层组件
import CommentReply from './components/comment-reply'
// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   // 图片的起始位置,起始位置为0
//   startPosition: 0,
//   onClose() {
//     console.log('onClose')
//   }
// })
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser, // 关注用户的组件
    CollectArticle, // 收藏组件
    LikeArticle, // 点赞组件
    CommentList, // 评论列表的组件
    CommentPost, // 发表评论的组件
    CommentReply // 回复评论的组件
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 给所有的后代提供的数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data() {
    return {
      article: {}, // 用于存放文章详情的数据
      loading: true, // 请求加载的状态
      errStatus: 0, // 发生失败的状态码
      totalCommentsCount: 0, // 评论的总条数
      isPostShow: false, // 控制评论的弹出层
      commentList: [], // 评论列表
      isReplyShow: false, // 控制回复评论的弹出层
      currentComment: {} // 当前的回复评论项
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      // 点击重新加载按钮,开启loading,重新加载
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // console.log(data)
        // 数据变化了,视图的变化并不是及时更新的
        this.article = data.data
        // 由于数据变化了,视图的变化并不是及时更新的,所在在这里调用函数采用定时器
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        // this.$toast('获取文章详情页失败,请稍后重试')
        console.log('获取文章详情页失败,请稍后重试')
        // 当发生错误时,让状态码赋值为404
        if (err.response && err.response.status === 404) {
          this.errstatus = 404
        }
      }
      // 不管加载成功与否,都关闭loading
      this.loading = false
    },
    previewImage() {
      // ref:被用来给元素或子组件注册引用信息,引用信息将会注册在父组件的$refs对象上,如果在普通的DOM元素上使用,引用指向的就是DOM元素,如果用在子组件上,引用就指向组件
      const articelContents = this.$refs['article-content']
      // 获取到所有img的DOM元素
      const imgs = articelContents.querySelectorAll('img')
      const images = [] // 存储照片url的数组
      // 遍历img的DOM元素,将照片的url地址追加到村塾照片的url数组中
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            // images: images,
            images,
            // 图片的起始位置,起始位置为0
            startPosition: index
          })
        }
      })
    },
    onPostSuccess (data) {
    // 关闭弹层
      this.isPostShow = false
      // 将发布的评论追加到评论列表的顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplayClick (comment) {
      // 将点击的回复评论项,保存在currentComment对象中
      this.currentComment = comment
      // 打开回复评论的弹出层
      this.isReplyShow = true
      // console.log(comment)
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    /deep/.van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
