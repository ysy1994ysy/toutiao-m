<template>
  <div class="user-profile">
  <!--导航栏start-->
    <van-nav-bar
      class='page-nav-bar'
      title="个人信息"
      left-arrow
      @click-left='$router.back()'
    />
  <!--导航栏end-->
    <!--头像选择框start-->
    <input
      type='file'
      hidden
      ref="file"
      @change="onFileChange"
    >
    <!--头像选择框end-->
  <!--个人头像start-->
    <van-cell
      title='头像'
      is-link
      @click="$refs.file.click()"
    >
      <van-image
        class="avator"
        round
        fit='cover'
        :src="personalData.photo"
      />
    </van-cell>
  <!--个人头像end-->
    <!--个人昵称start-->
    <van-cell
      title='昵称'
      :value='personalData.name'
      is-link
      @click="isUpdataNameShow = true"
    ></van-cell>
    <!--个人昵称end-->
    <!--个人性别start-->
    <van-cell
      title='性别'
      :value='personalData.gender ===0 ? "男" : "女"'
      @click="isUpdataGenderShow = true"
      is-link></van-cell>
    <!--个人性别end-->
    <!--个人生日start-->
    <van-cell
      title='生日'
      :value='personalData.birthday'
      is-link
      @click='isUpdataBirthdayShow = true'
    ></van-cell>
    <!--个人生日end-->
    <!--个人昵称的弹出层start-->
    <van-popup
    style='height: 100%'
    position='bottom'
    v-model="isUpdataNameShow"
    >
      <updata-name
      v-if="isUpdataNameShow"
      @close="isUpdataNameShow = false"
      v-model="personalData.name"
      ></updata-name>
    </van-popup>
    <!--个人昵称的弹出层end-->
    <!--性别的弹出层start-->
    <van-popup
      position='bottom'
      v-model="isUpdataGenderShow"
    >
      <updata-gender
      v-if="isUpdataGenderShow"
      v-model="personalData.gender"
      @close="isUpdataGenderShow = false"
      ></updata-gender>
    </van-popup>
    <!--性别的弹出层end-->
    <!--生日的弹出层start-->
    <van-popup
      position='bottom'
      v-model="isUpdataBirthdayShow"
    >
      <updata-birthday
      v-if='isUpdataBirthdayShow'
      v-model="personalData.birthday"
      @close="isUpdataBirthdayShow = false"
      ></updata-birthday>
    </van-popup>
    <!--生日的弹出层end-->
    <!--照片的弹出层start-->
    <van-popup
      position='bottom'
      v-model="isUpdataPhotoShow"
      style="height: 100%"
    >
      <updata-photo
      v-if="isUpdataPhotoShow"
      :img="img"
      @close="isUpdataPhotoShow = false"
      @updata-photo="personalData.photo = $event"
      ></updata-photo>
    </van-popup>
    <!--照片的弹出层end-->
  </div>
</template>

<script>
// 导入获取登录用户信息的api
import { getUserProfile } from '@/api/user'
// 导入昵称的组件
import UpdataName from './components/updata-name'
// 导入性别的组件
import UpdataGender from './components/updata-gender'
// 导入生日的组件
import UpdataBirthday from './components/updata-birthday'
// 导入照片的组件
import UpdataPhoto from './components/updata-photo'
export default {
  name: 'UserProfile',
  components: {
    UpdataName, // 昵称组件
    UpdataGender, // 性别组件
    UpdataBirthday, // 生日组件
    UpdataPhoto // 照片的组件
  },
  props: {},
  data() {
    return {
      personalData: {}, // 用户的个人资料
      isUpdataNameShow: false, // 昵称弹出层的显示与隐藏
      isUpdataGenderShow: false, // 性别弹出层的显示与隐藏
      isUpdataBirthdayShow: false, // 生日的弹出层
      isUpdataPhotoShow: false, // 照片的弹出层
      img: null // 预览的照片
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.personalData = data.data
      } catch (err) {
        this.$toast('获取用户个人信息失败!')
      }
    },
    onFileChange () {
    //  获取文件对象
      const File = this.$refs.file.files[0]
      // 基于文章获取图片blob数据
      // const data = window.URL.createObjectURL(file)
      this.img = window.URL.createObjectURL(File)
      // 展示预览照片弹出层
      this.isUpdataPhotoShow = true
      // this.img = data
      // 由于change时间,如果两次选择同一个照片,第二次不会出现弹出层,每次使用完将value清空
      this.$refs.file.value = ''
      // console.log(data)
    }
  }
}
</script>
<style lang="less" scoped>
.user-profile {
  /deep/.van-nav-bar .van-icon {
    color: #fff;
  }
  .avator {
    width: 60px;
    height: 60px;
  }
  .van-popup {
  background-color: #f5f7f9;
  }
}
</style>
