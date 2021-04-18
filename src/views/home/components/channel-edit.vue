<template>
  <!--频道编辑组件start-->
  <div class="channel-edit">
    <!--我的频道start-->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <!--编辑start-->
      <van-button
        class="edit-btn"
        type="danger"
        round
        size="small"
        plain
        @click="isEdit= !isEdit"
        >{{ isEdit ? '完成' : '编辑'}}</van-button
      >
      <!--编辑end-->
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannel"
        :key="index"
        :text="channel.name"
        @click="onMyChannelClick(channel, index)"
      >
        <!--我的频道删除按钮start-->
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fixedChannels.includes(channel.id)"
        ></van-icon>
        <!--我的频道删除按钮end-->
        <span
          slot="text"
          class="text"
          :class="{ active: index === active }"
        >
          {{channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <!--我的频道end-->
    <!--***************-->
    <!--频道推荐start-->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        icon="plus"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
      >
      </van-grid-item>
      <!--频道end-->
    </van-grid>
    <!--频道推荐end-->
    <!--频道推荐start-->
  </div>
  <!--频道编辑组件end-->
</template>

<script>
import { getAllChannels, addUserChannels, deleteUserChannels } from '@/api/channel'
// 导入封装处理token的函数
import { setItem } from '@/utils/storage'
// 将用户的登录状态映射进来
import { mapState } from 'vuex'
export default {
  name: 'Channel-Edit',
  components: {},
  props: {
    myChannel: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allchannels: [], // 所有频道列表数据
      isEdit: false, // 控制我的推荐频道中的删除按钮的显示与隐藏
      fixedChannels: [0] // 控制不允许删除的频道
    }
  },
  computed: {
    // recommendChannels () {
    //   const channels = []
    //   // 遍历所有的频道列表数据
    //   this.allchannels.forEach(channel => {
    //     // 遍历我的频道列表数据
    //     const ret = this.myChannel.find(myChannel => {
    //       // 如果myChannel.id等于channel.id,则我的频道列表数据在所有频道列表数据中
    //       return myChannel.id === channel.id
    //     })
    //     // 推荐频道项=所有频道项-我的频道项，如果没在我的频道项中，就把其追加到推荐频道项中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   return channels
    ...mapState(['user']),
    recommendChannels () {
      return this.allchannels.filter(channel => {
        return !this.myChannel.find(mychannel => {
          return mychannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    // 获取所有频道列表数据start
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allchannels = data.data.channels
      } catch (error) {
        this.$toast('获取所有频道列表数据失败！')
      }
    },
    // 获取所有频道列表数据end
    async onAddChannel (channel) {
      // 添加频道
      this.myChannel.push(channel)
      if (this.user) {
        //  如果用户登录了，则把数据保存在线上
        try {
          await addUserChannels({
            id: channel.id, // 频道id
            seq: this.myChannel.length // 顺序序号
          })
        } catch (error) {
          this.$toast('添加频道失败,请稍后重试')
        }
      } else {
        //  如果未登录则把数据保存在本地
        setItem('TOUTIAO_CHANNEL', this.myChannel)
      }
    },
    // 编辑状态，点击按钮进行删除，非编辑状态点击按钮进行切换
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 编辑状态，点击按钮进行删除
        // 如果是固定频道不允许删除
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        // 如果删除的是选定转态前面的，删除后，依然是原来选定的状态,如果删除的是选定的状态的,则删除后选定状态的是删除的那个的后一个
        if (index < this.active) {
          this.$emit('updata-active', this.active - 1, true)
        }
        // 根据索引值进行删除操作
        this.myChannel.splice(index, 1)
        // 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态点击按钮进行切换
        this.$emit('updata-active', index, false)
      }
    },
    // 删除指定频道
    async deleteChannel(channel) {
      try {
        if (this.user) {
          //  如果用户登录了,则更新数据到线上
          await deleteUserChannels(channel.id)
        } else {
          // 如果用户没有登录,则更新数据到本地
          setItem('TOUTIAO_CHANNELS', this.myChannel)
        }
      } catch (err) {
        this.$toast('添加频道失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 49px !important;
    font-size: 26px;
    color: #f85a5a;
    border: 1px solid #f85a5a;
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: #ccc;
        z-index: 999;
      }
    }
  }
  /deep/ .grid-item {
    width: 164px;
    height: 84px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
