<template>
<div class='updata-gender'>
  <van-picker
    title="性别"
    show-toolbar
    :columns="columns"
    @confirm="onConfirm"
    @cancel="$emit('close')"
    @change="onChange"
    :default-index="value"
  />
</div>
</template>

<script>
// 更新用户资料
import { updataUserProfile } from '@/api/user'
export default {
  name: 'UpdataGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.value // 性别
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '更改用户性别中...', // 登录的信息
        forbidClick: true, // 登录中，背景禁止点击
        duration: 0 // 默认登录的时间是2000ms,0表示持续展示
      })
      try {
        await updataUserProfile({
          gender: this.localGender
        })
        // 更新视图
        this.$emit('input', this.localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示更改成功
        this.$toast.success('更改用户性别成功')
      } catch (err) {
        this.$toast.fail('更改用户性别失败')
      }
    },
    onChange (picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style scoped>

</style>
