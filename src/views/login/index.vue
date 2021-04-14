<template>
  <div class="login-container">
    <!-- 导航栏start -->
    <van-nav-bar class="page-nav-bar" title="登录" >
      <!--导航栏左侧关闭的按钮-->
      <van-icon
        class="close"
        name="cross"
        slot="left"
        @click="$router.back()"
      >
      </van-icon>
    </van-nav-bar>
    <!-- 导航栏end-->
    <!-- 登录表单start -->
    <van-form ref="loginForm" @submit="onSubmit">
      <!--当表单验证通过会触发submit事件，验证失败不会触发submit事件-->
      <!-- 手机号输入框start -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="number"
        maxlength="11"
        :rules="userFormRules.mobile"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <!-- 手机号输入框end -->
      <!-- 验证码输入框start -->
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        maxlength="6"
        :rules="userFormRules.code"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>

        <template #button>
          <!--倒计时-->
          <van-count-down
            v-if="isCountDownShow"
            slot="button"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            round
            type="default"
            size="small"
            class="send-sms-btn"
            native-type="button"
            @click="onSendSms"
            >发送验证码
          </van-button>
        </template>
      </van-field>
      <!-- 验证码输入框end -->
      <!-- 登录按钮start -->
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn"
          >登录
        </van-button>
      </div>
      <!-- 登录按钮end -->
    </van-form>
    <!-- 登录表单end -->
  </div>
</template>

<script>
// 导入登录(login)和发送验证码(sendSms)的api接口
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 通过给手机号码和验证码输入框绑定rules属性进行验证，用于表单的验证required为必填项，利用正则表达式进行正则验证
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: '手机号格式错误，请重新输入正确的手机号'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码错误，请输入正确的验证码' }
        ]
      },
      // 倒计时的显示与隐藏
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 为表单绑定提交事件
    async onSubmit() {
      // console.log(111)
      // 1.获取表单数据
      // const user = this.user
      // 2.表单验证
      // 给van-field组件配置rules属性，从而实现表单的验证
      // 3.提交表单请求登录
      // 登录的轻提示
      // 在vue中toast必须使用this.$来调用,如果下一个toast轻提示执行，则上一个轻提示停止执行
      this.$toast.loading({
        message: '登录中...', // 登录的信息
        forbidClick: true, // 登录中，背景禁止点击
        duration: 0 // 默认登录的时间是2000ms,0表示持续展示
      })
      // 4.根据请求响应处理后的结果,验证通过后进行手机号码和验证码的校验
      try {
        // data为调用接口返回回来的数据，把其解构出来，data.data
        // data.data是一个obj对象，这个obj对象中保存着token和refresh_token两个属性
        const { data } = await login(this.user)
        this.$store.commit('setUser', data.data)
        // console.log('登录成功', data)
        // 登录成功之后，跳转页面
        this.$router.back()
        this.$toast.success('登录成功')
      } catch (error) {
        // console.log(error)
        if (error.response.status === 400) {
          // console.log('手机号或者验证码错误')
          this.$toast.fail('手机号或者验证码错误')
        } else {
          // console.log('登录失败,请稍后重试', error)
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
    },
    // 发送验证码
    async onSendSms() {
      // 1.对手机号进行校验
      try {
        // console.log(this)
        await this.$refs.loginForm.validate('mobile')
      } catch (error) {
        // catch只能捕捉到同步的错误
        return console.log('验证失败', error)
      }
      // 2.验证通过，点击发送验证码按钮，显示倒计时效果
      this.isCountDownShow = true
      // 3.调用接口，请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (error) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (error.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重新发送')
        } else {
          this.$toast('验证码发送错误，请重新发送')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    //width: 152px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    // 该盒子有一个默认的padding，我们把padding 设置为0,在iPhone5以下的设备
    //文字会充满整个盒子，所以我们不给盒子设置宽度，从而让文字撑开盒子
    //padding: 0;
    background-color: #ededed;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;

    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
