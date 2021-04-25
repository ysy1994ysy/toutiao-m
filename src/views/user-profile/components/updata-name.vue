<!--昵称组件-->
<template>
  <div class="updata-name">
  <!--导航栏start-->
    <van-nav-bar
      title="我的昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  <!--导航栏end-->
<!--昵称输入区start-->
   <div class="filed-wrap">
     <van-field
       v-model.trim="updataUserName"
       rows="2"
       autosize
       type="textarea"
       maxlength="7"
       placeholder="请输入昵称"
       show-word-limit
     />
   </div>
  </div>
</template>

<script>
// 更新用户资料
import { updataUserProfile } from '@/api/user'

export default {
  name: 'UpdataName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      updataUserName: this.value // 用户要更改的昵称
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '更改用户昵称中...', // 登录的信息
        forbidClick: true, // 登录中，背景禁止点击
        duration: 0 // 默认登录的时间是2000ms,0表示持续展示
      })
      try {
        // 判断用户更改的昵称是否为空,如果为空,则停止,不为空则继续下面的程序
        if (!this.updataUserName.length) {
          this.$toast('用户名不能为空')
          return
        }
        await updataUserProfile({
          name: this.updataUserName
        })
        // 更新视图
        this.$emit('input', this.updataUserName)
        // 关闭弹层
        this.$emit('close')
        // 提示更改成功
        this.$toast.success('更改用户名成功')
      } catch (err) {
        this.$toast.fail('更改用户昵称失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.filed-wrap {
  padding-top: 20px;
}
</style>
