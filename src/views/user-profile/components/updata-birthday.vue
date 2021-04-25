<template>
<div class="updata-birthday">
  <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择年月日"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('close')"
    @confirm="onConfirm"
  />
</div>
</template>

<script>
// 更新用户资料
import { updataUserProfile } from '@/api/user'
// 导入处理时间的组件
import dayjs from 'dayjs'
export default {
  name: 'UpdataBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1960, 0, 1), // 可选的最小时间
      maxDate: new Date(), // 可选的最长时间
      currentDate: new Date(this.value) // 更改后的时间
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm () {
      // 将时间格式化为 ****年-**月-**日
      const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.$toast.loading({
        message: '更改出生日期中...', // 登录的信息
        forbidClick: true, // 登录中，背景禁止点击
        duration: 0 // 默认登录的时间是2000ms,0表示持续展示
      })
      try {
        await updataUserProfile({
          birthday: currentDate
        })
        // 更新视图
        this.$emit('input', currentDate)
        // 关闭弹层
        this.$emit('close')
        // 提示更改成功
        this.$toast.success('更改用户出生日期成功')
      } catch (err) {
        this.$toast.fail('更改用户出生日期失败')
      }
    }
  }
}
</script>

<style scoped>

</style>
