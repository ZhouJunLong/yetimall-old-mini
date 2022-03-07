<template>
  <view class="wrap">
    <view class="head-img">
      <image src="../../../static/images/confirm_head.png"></image>
    </view>
    <view class="inner-content">
      <view class="head-top">
        <view class="back"
              @click="back"><text class="iconfont icon-zuojiantou"></text></view>
        <view class="head-title"><text>确认订单</text></view>
      </view>
      <!-- 服务地址 -->
      <view class="address-area">
        <view class="address-list"
              v-if="addressInfo"
              @click="selectAddress">
          <view class="address-info">
            <view class="address-top">
              <view>姓名：{{addressInfo.name}}</view>
              <view>手机号码：{{addressInfo.send_phone}}</view>
            </view>
            <view class="address-bot">地址:{{addressInfo.address}} {{addressInfo.address_detail}}</view>

            <view class="address-bot"
                  v-if="addressInfo.identify_num">身份号码：{{addressInfo.identify_num}}</view>
            <view class="address-bot"
                  v-else>身份号码未填写</view>
          </view>
        </view>
        <view class="address-list"
              v-else
              @click="selectAddress">
          <view class="address">
            <view class="select-addr">
              <text class="iconfont icon-weizhi"></text>
              <text>点击添加收货地址</text>
            </view>
            <view>
              <text class="iconfont icon-youjiantouda"></text>
            </view>
          </view>
        </view>
      </view>
      <!-- 商品信息 -->
      <view class="good-area">
        <block v-for="(item,index) in goodsInfo">
          <view class="good-info">
            <image :src="base_url+item.img_url"
                   class="good-img"></image>
            <view class="good">
              <view class="good-top">
                <view class="name">{{item.simple_desc}}</view>
              </view>
              <view class="good-mid"
                    v-if="item.property && item.property.property_text">
                <view class="name">{{item.property.property_text}}</view>
              </view>
              <view class="good-bot">
                <view class="price">￥{{item.price}}</view>
              </view>
            </view>
          </view>
          <view class="count">
            <view class="count-title">购买数量</view>
            <view class="person">x{{item.goods_count}}</view>
          </view>
        </block>
      </view>
      <!-- 商品小计 -->
      <view class="little-price">
        <view class="now-price">
          <text>商品金额</text>
          <text>￥{{realPrice}}</text>
        </view>
        <view class="delivery-fee">
          <text>运费</text>
          <text>￥{{delivery_fee}}</text>
        </view>
      </view>
      <!-- 订单备注 -->
      <view class="remark">
        <view class="remark_title">订单备注</view>
        <textarea class="remark_input"
                  v-model="remark"
                  type="text"
                  maxlength="100"></textarea>
      </view>
      <!-- 支付方式 -->
      <view class="order-area">
        <view class="order-info">
          <view class="pay-type">
            <text class="iconfont icon-weixin"></text>
            <text>微信支付</text>
          </view>
          <view class="pay-type-right">
            <text class="iconfont icon-queren"></text>
          </view>
        </view>
      </view>
      <!-- 支付身份证确认 -->
      <view class="order-area">
        <view class="order-info">
          <view class="identify">
            <text>请确认您的身份证号码与收件人名字匹配</text>
            <text>避免货物无法通关</text>
          </view>
          <view class="pay-type-right"
                @click="changeCheck">
            <text class="iconfont icon-weixuanzhongyuanquan"
                  v-if="is_check == 0"></text>
            <text class="iconfont icon-queren"
                  v-else></text>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部区域 -->
    <view class="total-area">
      <view class="total-left">
        <text>应付金额:</text>
        <text class="unit">￥</text>
        <text class="total-price">{{totalPrice}}</text>
      </view>
      <view class="total-right"
            @click="addOrder">立即购买</view>
    </view>
  </view>
</template>

<script>
import CONFIG from '../../../common/config.js'
import tools from '../../../common/tools.js'
var base_url = CONFIG.BASE_URL
var userInfo = ''
var cityInfo = ''
var did = 0
var isClick = true

export default {
  data() {
    return {
      base_url: base_url, //BASE_URL
      userInfo: [], //用户信息
      cityInfo: [], //用户城市信息
      gids: 0, //商品id
      counts: 1, //商品数量
      specs_name: '', //多商品规格名称
      specs_price: 0.0, //商品多规格价格
      addressInfo: '', //默认地址信息
      line_png: base_url + 'bg/line.png', //地址ling
      goodsInfo: '', //商品信息
      is_use_points: 0, //是否使用积分
      points: '', //使用积分
      points_money: 0, //积分抵现金额
      user_points: 0, //用户积分
      message: '', //在线留言信息
      totalPrice: 0.0, //订单总额
      realPrice: 0.0, //商实付款
      gpids: 0, //多规格属性id
      cgids: 0, //购物车id
      delivery_fee: 0,
      property_text: '', //属性文本
      delivery: 0, //运费首价
      delivery_price: 0, //运费增价
      is_check: 0, //1 确认 0 未确认
      remark: '', //订单备注
    }
  },
  onLoad(options) {
    var that = this

    //用户缓存信息
    that.userInfo = uni.getStorageSync('userInfo')

    //获取用户信息
    that.getUserInfo()

    //页面携带参数
    var gids = options.gids || 0
    var gpids = options.gpids || 0
    var counts = options.counts || 1
    var cgids = options.cids || 0
    that.gids = gids
    that.counts = counts
    that.gpids = gpids
    that.cgids = cgids

    //获取配置信息
    that.getConfigInfo()
  },
  onShow: function () {
    var that = this

    //用户缓存信息
    that.userInfo = uni.getStorageSync('userInfo')
    console.log(that.userInfo)
    //获取用户信息
    that.getUserInfo()

    //获取配置信息
    // that.getConfigInfo();

    //获取地址信息
    that.getAddressInfo()
  },
  methods: {
    getConfirmInfo: function (gids, gpids, counts) {
      var that = this
      tools.httpClient(
        'home/WxStore/getConfirmInfo',
        { gids: gids, gpids: gpids, counts: counts },
        function (err, res) {
          if (res.errorCode == 0) {
            var goodsData = res.data
            //商品总额
            var total = res.total_price
            var realPrice = parseFloat(total).toFixed(2)
            that.realPrice = realPrice
            //运费总额
            var counts = res.counts - 1
            var delivery = that.delivery
            var delivery_price = that.delivery_price
            let fee = 0
            fee = parseFloat(delivery) + parseFloat(delivery_price * counts)
            that.delivery_fee = fee

            var totalPrice = parseFloat(realPrice) + parseFloat(fee)
            //实付总额
            that.totalPrice = totalPrice.toFixed(2)
            that.goodsInfo = goodsData
          }
        }
      )
      return false
    },

    //获取地址信息
    getUserInfo: function () {
      var that = this
      tools.httpClient(
        'home/WxStore/getUserInfo',
        { user_id: that.userInfo.id },
        (error, res) => {
          if (res.errorCode == 0) {
            var userData = res.data
            userInfo = userData
            that.userInfo = userData
          }
        }
      )
    },
    //勾选确认身份信息
    changeCheck: function () {
      var that = this
      var is_check = that.is_check
      if (is_check == 0) {
        that.is_check = 1
      } else {
        that.is_check = 0
      }
      return false
    },

    //获取地址信息
    getAddressInfo: function () {
      var that = this
      tools.httpClient(
        'home/WxStore/getAddress',
        { user_id: that.userInfo.id },
        (error, res) => {
          if (res.errorCode == 0) {
            var addressData = res.data
            that.addressInfo = addressData
          }
        }
      )
    },

    //获取配置信息
    getConfigInfo: function () {
      var that = this
      tools.httpClient(
        'home/WxStore/getConfigInfo',
        { gids: this.gids, gpids: this.gpids, counts: this.counts },
        (error, res) => {
          if (res.errorCode == 0) {
            var configData = res.data
            that.configInfo = configData
            // console.log(configData)
            that.delivery = configData.delivery
            that.delivery_price = configData.price
            //获取确认订单信息
            that.getConfirmInfo(that.gids, that.gpids, that.counts)
          }
        }
      )
    },

    //选择服务地址
    selectAddress: function () {
      uni.navigateTo({
        url: '/pages/address/addressList/addressList',
      })
    },

    //提交订单
    addOrder: function () {
      var that = this
      //服务地址
      if (that.addressInfo == '' || that.addressInfo == null) {
        uni.showToast({
          title: '请选择收货地址！',
          icon: 'none',
          duration: 1500,
        })
        return false
      }
      if (that.is_check == '' || that.is_check == 0) {
        uni.showToast({
          title: '请确认配送信息！',
          icon: 'none',
          duration: 1500,
        })
        return false
      }
      var data = {
        uid: that.userInfo.id,
        gpids: that.gpids,
        gids: that.gids,
        total_price: that.totalPrice,
        delivery_fee: that.delivery_fee,
        counts: that.counts,
        address_id: that.addressInfo.id,
        cgids: that.cgids,
        open_id: that.userInfo.open_id,
        remarks_user: that.remark || '',
      }
      uni.showLoading({
        title: '加载中',
      })
      // console.log(data);
      // return false;
      if (isClick) {
        isClick = false
        uni.request({
          url: base_url + 'home/WxStore/addOrder',
          data: data,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          success: function (res) {
            // console.log(res);
            // return false;
            if (res.data.errorCode == 0) {
              uni.request({
                url: base_url + '../extend/pay/request/WxAppPay.php',
                data: { oid: res.data.data.addOrderId },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'GET',
                success: function (res) {
                  uni.hideLoading() //隐藏提示层
                  isClick = true //按钮可以点击
                  if (res.data.rescode == '0000') {
                    var resmsg = JSON.parse(res.data.resmsg)
                    uni.requestPayment({
                      timeStamp: resmsg.timeStamp,
                      nonceStr: resmsg.nonceStr,
                      package: resmsg.package,
                      signType: resmsg.signType,
                      paySign: resmsg.paySign,
                      success: function (res) {
                        console.log(res)
                        uni.showToast({
                          title: '支付成功',
                          icon: 'success',
                          success: function () {
                            setTimeout(function () {
                              uni.reLaunch({
                                url: '/pages/userCenter/userCenter/userCenter',
                              })
                            }, 1000)
                          },
                        })
                      },
                    })
                  } else if (res.data.errorCode == 1) {
                    uni.showToast({
                      title:
                        res.data.errorInfo || '跳转支付失败，请尝试重新支付!',
                      icon: 'none',
                      duration: 3000,
                    })
                    return false
                  } else {
                    uni.showToast({
                      title: '跳转支付失败，请尝试重新支付!',
                      icon: 'none',
                      duration: 3000,
                    })
                    return false
                  }
                },
              })
            } else {
              uni.hideLoading() //隐藏提示层
              isClick = true //按钮可以点击
              uni.showToast({
                title: res.data.errorInfo,
                icon: 'none',
                duration: 2000,
              })
            }
          },
        })
      }
    },
    back: function () {
      uni.navigateBack()
    },
  },
}
</script>

<style>
@import url('./confirmOrder.css');
</style>
