<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDelteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDelteShow = false">完成</span>
      </div>
      <!--删除的图标start-->
      <van-icon
        v-else
        name="delete-o"
        @click="isDelteShow = true"
      >
      </van-icon>
      <!--删除的图标end-->
    </van-cell>
    <!--历史记录start-->
    <van-cell
      :title="item"
      :key="index"
      v-for="(item, index) in searchHistories"
      @click="onSearchItemHistory(item, index)"
    >
      <!--每条历史记录中右侧删除的图标start-->
      <van-icon
        name="close"
        v-show="isDelteShow"
      ></van-icon>
      <!--每条历史记录中右侧删除的图标end-->
    </van-cell>
    <!--历史记录end-->
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDelteShow: false // 控制删除的显示与隐藏
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearchItemHistory (item, index) {
      if (this.isDelteShow) {
        // 1.如果是删除状态,点击按钮删除历史记录
        // 点击按钮删除一条历史记录
        this.searchHistories.splice(index, 1)
      } else {
        // 如果是非删除状态,点击后,展示搜索结果
        this.$emit('search', item)
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
