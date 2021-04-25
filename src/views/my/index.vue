<!--个人中心未登录-->
<template>
  <div class="my-container">
    <!--已登录start-->
    <div v-if="user" class="header user-info">
      <!-- 个人头像-用户名-编辑资料start -->
      <div class="base-info">
        <div class="left">
          <van-image class="avator" round fit="cover" :src="userInfo.photo" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button type="default" round size="mini" to="/user/profile"
            >编辑资料</van-button
          >
        </div>
      </div>
      <!-- 个人头像-用户名-编辑资料end -->
      <!-- 头条-关注-粉丝-获赞start -->
      <div class="data-states">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
      <!-- 头条-关注-粉丝-获赞end -->
    </div>
    <!--已登录end-->
    <!--未登录start-->
    <div v-else class="header not-login" @click="$router.push('/login')">
      <div class="login-btn">
        <img src="~@/assets/mobile.png" class="mobile-img" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!--未登录end-->
    <!-- 收藏与历史start -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 收藏与历史end -->
    <!--消息通知-小智同学-退出登录start-->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell
      clickable
      v-if="user"
      title="退出登录"
      class="layout-cell"
      @click="onLogout"
    />
    <!--消息通知-小智同学-退出登录end-->
  </div>
</template>

<script>
import { mapState } from 'vuex'
// 获取用户自己信息
import { getUserInfo } from '@/api/user'

export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data() {
    return {
      userInfo: {} // 用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    // 如果用户登录了，加载获取用户信息
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted() {},
  methods: {
    // 点击退出按钮，让用户选择是否退出
    onLogout() {
      // console.log(111)
      this.$dialog
        .confirm({
          title: '退出提示',
          message: '您确认要退出吗？',
          cancelButtonColor: 'red',
          confirmButtonColor: 'skyblue'
        })
        .then(() => {
          // 确认退出，清除容器和本地存储中的token
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 在这里取消退出
          console.log('该用户退出了')
        })
    },
    async loadUserInfo() {
      try {
        // console.log('获取用户信息成功')
        const { data } = await getUserInfo()
        // console.log(data.data)
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取用户信息失败')
      }
    }
  }
}
</script>
<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png') no-repeat;
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      box-sizing: border-box;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avator {
          width: 132px;
          height: 132px;
          border: 3px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
          margin-left: 23px;
        }
      }
      .rigth {
        color: #666666;
      }
    }
    .data-states {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .text {
        font-size: 28px;
      }
    }
  }
  .layout-cell {
    height: 105px;
    margin-top: 10px;
    font-size: 30px;
    text-align: center;
    color: #d86262;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
