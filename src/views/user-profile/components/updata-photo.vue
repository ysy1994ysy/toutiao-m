<template>
  <div class='updata-photo'>
    <img :src="img" class="img" ref="img">
    <div class="toolbar">
      <div
        class="cancel"
        @click="$emit('close')"
      >取消</div>
      <div
        class="confirm"
        @click="onConfirm"
      >完成</div>
    </div>
  </div>
</template>

<script>
// 导入裁剪照片包的css和js文件
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
// 导入头像的api处理函数
import { updataUserPhoto } from '@/api/user'

export default {
  name: 'UpdataPhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 限制裁剪区一定范围
      dragMode: 'move', // 拖动模式
      aspectRatio: 1, // 截图比例,默认16:9
      // autoCropArea: 1, // 自动截取区域
      cropBoxMovable: false, // 截图区域是否可以移动
      cropBoxResizable: false, // 截图区域的缩放
      background: false,
      movable: true // 画布是否可以移动
    })
  },
  methods: {
    onConfirm () {
      // console.log(this.cropper.getData())
      // 纯客服端的裁剪使用,getCroppedCanvas 获取裁剪的文件对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        // console.log(blob)
        this.updataUserPhoto(blob)
      })
    },
    async updataUserPhoto (blob) {
      this.$toast.loading({
        message: '更换头像中...', // 登录的信息
        forbidClick: true, // 登录中，背景禁止点击
        duration: 0 // 默认登录的时间是2000ms,0表示持续展示
      })
      try {
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updataUserPhoto(formData)
        // console.log(data)
        // 关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('updata-photo', data.data.photo)
        this.$toast.success('更换头像成功')
      } catch (err) {
        this.$toast.fail('更换头像失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.updata-photo {
  background-color: #000;
  height: 100%;
 .toolbar {
   position: fixed;
   left: 0;
   right: 0;
   bottom: 0;
   display: flex;
   justify-content: space-between;
   .cancel,
   .confirm {
     width: 90px;
     height: 90px;
     font-size: 30px;
     display: flex;
     justify-content: center;
     align-items: center;
     color: #fff;
   }
 }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
