<template>
  <!--文章列表项start-->
  <van-cell class="article-item">
    <!--文章标题start-->
    <div slot="title" class="title van-multi-ellipsis--l3">
      {{ article.title }}
    </div>
    <!--文章标题end-->
    <!--文章有三张照片，照片在标题下方start-->
    <div slot="label">
      <div class="cover-wrap" v-if="article.cover.type === 3">
        <div
          class="cover-item"
          :key="index"
          v-for="(img, index) in article.cover.images"
        >
          <van-image
           class="cover-item-img"
          fit="cover"
          :src="img"
          />
        </div>
      </div>
      <!--文章作者，评论数，评论时间长start-->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}条评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
      <!--文章作者，评论数，评论时间长end-->
    </div>
    <!--文章有三张照片，照片在标题下方end-->
    <!--文章有一张照片,照片在标题右侧start-->
    <van-image
      v-if="article.cover.type === 1"
      slot="default"
      fit="cover"
      class="right-cover"
      :src="article.cover.images[0]"
    />
    <!--文章有1张照片end-->
  </van-cell>
  <!--文章列表项end-->
</template>
<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    color: #3a3a3a;
    font-size: 32px;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover{
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #bfbfbf;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      //&:nth-child(2) {
      //  padding: 0 4px;
      //}
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
