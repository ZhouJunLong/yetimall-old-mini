<template>
  <view class="container"
        v-if="list.length > 0">
    <view class="header">
      <view class="order_num">
        <view class="title">顺丰速运：</view>
        <view class="num">{{ delivery_num }}</view>
        <view class="copy_btn"
              @click="copy(delivery_num)">复制</view>
      </view>
      <view class="order_num">
        <view class="title">快递电话：</view>
        <view class="num">{{ delivery_tel }}</view>
      </view>
    </view>
    <view class="wrap">
      <view class="item"
            v-for="(item,index) in list"
            :key='index'>
        <view class="item-left">
          <view class="item-circle"></view>
          <view class="item-line"></view>
        </view>
        <view class="item-right">
          <view>{{ item.content }}</view>
          <view>{{ item.content_date }}</view>
        </view>
      </view>
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
      delivery_num: '',
      delivery_tel: '95338',
    }
  },
  onLoad(query) {
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
            this.list = res.trajectory || []
            this.delivery_num = res.delivery_num
            this.delivery_tel = res.delivery_tel
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
    copy(data) {
      tools.copy(data)
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  padding: 30rpx 30rpx;
  box-sizing: border-box;
  min-height: 100vh;
  background-color: #fff;
}
.header {
  .order_num {
    margin-top: 10rpx;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #252525;

    .title {
      // font-weight: bold;
    }
    .num {
    }
    .copy_btn {
      margin-left: 10rpx;
      width: 58rpx;
      height: 28rpx;
      font-size: 20rpx;
      border-radius: 5rpx 5rpx 5rpx 5rpx;
      border: 1rpx solid #8b8b8b;
      text-align: center;
      line-height: 28rpx;
    }
  }
}
.wrap {
  margin-top: 60rpx;
  .item {
    display: flex;
    font-size: 28rpx;
    color: #8b8b8b;
    &:last-child {
      .item-left {
        .item-line {
          display: none;
        }
      }
    }

    .item-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      .item-circle {
        width: 12rpx;
        height: 12rpx;
        border: 4rpx solid white;
        background-color: #08b8e6;
        border-radius: 50%;
      }
      .item-line {
        flex: 1;
        border: 0;
        height: 100%;
        width: 4rpx;
        background-image: linear-gradient(#00eba7, #08b8e6);
      }
    }
    .item-right {
      margin-top: -14rpx;
      padding-left: 20rpx;
      padding-bottom: 40rpx;
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>