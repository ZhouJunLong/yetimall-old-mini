<template>
  <view class="container"
        v-if="list.length > 0">
    <view v-for="(item,index) in list"
          :key='index'>
      <view class="vertical-circle"></view>
      <view class="vertical-text">
        <view>{{ item.content }}</view>
        <view>{{ item.content_date }}</view>
      </view>
      <view class="vertical-line"
            v-if="index < list.length-1"></view>
    </view>
  </view>
</template>
<script>
import tools from '../../../common/tools.js'
export default {
  data() {
    return {
      oid: '',
      list: [],
    }
  },
  onLoad(query) {
    console.log('---query---', query)
    this.oid = query.oid
    this.getOrderDetail()
  },
  methods: {
    //获取订单详情
    // https://www.yetimall.fun/public/home/WxStore/getOrderInfoTrajectory?oid=3320
    getOrderDetail() {
      tools.httpClient(
        'home/WxStore/getOrderInfoTrajectory',
        { oid: this.oid },
        (error, result) => {
          if (result.errorCode === 0) {
            let res = result.data
            this.list = res.trajectory
          } else {
            uni.showToast({
              title: result.errorInfo || '请求失败,请稍后再试',
              icon: 'none',
              duration: 3000,
            })
            this.showDetail = false
          }
        }
      )
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  padding: 100rpx 30rpx;
}
.vertical-line {
  height: 100px;
  border-left: 2px solid;
  margin-left: 4px;
  border-image: linear-gradient(#00eba7, #08b8e6) 30 30;
}

.vertical-circle {
  float: left;
  width: 6px;
  height: 6px;
  border: 2px solid white;
  background-color: #08b8e6;
  -webkit-border-radius: 100px;
}
.vertical-text {
  float: left;
  margin-top: -7px;
  padding-left: 20rpx;
  font-size: 22rpx;
  color: #8b8b8b;
}
</style>