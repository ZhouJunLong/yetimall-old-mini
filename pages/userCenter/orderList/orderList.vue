<template>
  <view class="wrap">
    <!-- 订单区域 -->
    <view class="order-area">
      <!-- 订单状态 -->
      <view class="tab-area"
            v-if="language == 0">
        <view :class="[state == -1?'tab-list cur':'tab-list']"
              data-state="-1"
              @click="changeState">온통</view>
        <view :class="[state == 0?'tab-list cur':'tab-list']"
              data-state="0"
              @click="changeState">지불 대기</view>
        <view :class="[state == 1?'tab-list cur':'tab-list']"
              data-state="1"
              @click="changeState">발송 대기 화물</view>
        <view :class="[state == 2?'tab-list cur':'tab-list']"
              data-state="2"
              @click="changeState">받 을 물건</view>
        <view :class="[state == 3?'tab-list cur':'tab-list']"
              data-state="3"
              @click="changeState">완료 됨</view>
        <view :class="[state == 7?'tab-list cur':'tab-list']"
              data-state="7"
              @click="changeState">환불 됨</view>
      </view>
      <view class="tab-area"
            v-else>
        <view :class="[state == -1?'tab-list cur':'tab-list']"
              data-state="-1"
              @click="changeState">全部</view>
        <view :class="[state == 0?'tab-list cur':'tab-list']"
              data-state="0"
              @click="changeState">待付款</view>
        <view :class="[state == 1?'tab-list cur':'tab-list']"
              data-state="1"
              @click="changeState">待发货</view>
        <view :class="[state == 2?'tab-list cur':'tab-list']"
              data-state="2"
              @click="changeState">待收货</view>
        <view :class="[state == 3?'tab-list cur':'tab-list']"
              data-state="3"
              @click="changeState">已完成</view>
        <view :class="[state == 7?'tab-list cur':'tab-list']"
              data-state="7"
              @click="changeState">已退款</view>
      </view>
      <!-- 订单列表 -->
      <block v-if="list.length > 0">
        <block v-for="(item, index) in list">
          <view class="order-list">
            <view class="order-top">
              <view class="order-top-left">
                <view class="order-num"
                      v-if="language == 2">주문 번호：{{item.order_num}}</view>
                <view class="order-num"
                      v-else>订单编号：{{item.order_num}}</view>
                <image class="copy"
                       @click="copy(item.order_num)"
                       src='../../../static/images/copy.png'>
                </image>
              </view>
              <view class="state">{{item.state_text}}</view>
            </view>
            <block v-for="(items, indexs) in item.goods_list">
              <view class="order-mid">
                <view class="good-list"
                      @click="gotoOrderDetail"
                      :data-gid="items.gid"
                      :data-oid="item.id">
                  <view class="good-img">
                    <image mode="widthFix"
                           :src="base_url+items.thumb"></image>
                  </view>
                  <view class="order-good">
                    <view class="good-top">
                      <view class="desc">
                        <text>{{items.goods_name + "    "}}</text>
                        <text v-if="items.property">{{items.property}}</text>
                      </view>
                    </view>
                    <view class="good-bot">
                      <view class="good-price">￥<text class="price">{{items.price}}</text></view>
                      <view class="good-count">x{{items.count}}</view>
                    </view>
                  </view>
                </view>
              </view>
            </block>
            <view class="order-bot">
              <view class="order-desc">
                <text v-if="language == 0">모두1단지</text>
                <text v-else>共1单</text>
                <text class="unit"
                      v-if="language == 0">합계 하 다：</text>
                <text class="unit"
                      v-else>合计：</text>
                ￥<text class="total_price">{{item.total_price}}</text>
                <text v-if="language == 0">（운임 포함¥{{item.delivery_fee}}）</text>
                <text v-else>（含运费¥{{item.delivery_fee}}）</text>
              </view>
            </view>
            <view class="btn-area">
              <!-- <view class="delivery-num" v-if="show_delivery && index == open_index">
								<text v-if="language == 0">물류 번호：{{item.delivery_num}}</text>
								<text v-else>物流单号：{{item.delivery_num}}</text>
							</view> -->
              <view :class="item.btn_opt"
                    v-if="item.btn_show"
                    @click="operationOrder"
                    :data-token="item.waybill_token"
                    :data-operation="item.btn_opt"
                    :data-index="index">{{item.btn_text}}</view>
              <view :class="item.btn_opt2"
                    v-if="item.btn_show2"
                    @click="operationOrder"
                    :data-operation="item.btn_opt2"
                    :data-index="index">{{item.btn_text2}}</view>
            </view>
          </view>
        </block>
      </block>
      <block v-else>
        <view class="no-more"
              v-if="language == 0">주문 없 음</view>
        <view class="no-more"
              v-else>暂无订单</view>
      </block>
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
var is_click = true

//分页信息
var page = 1
var pageSize = 10
var allPages = 0

//加载数据
var GetList = function (that, orbottom) {
  //显示加载中
  uni.showLoading({
    title: '加载中',
  })
  //用户id
  var user_id = userInfo.id
  if (user_id == undefined) {
    user_id = 0
  }
  //data数据
  var data = {
    pageIndex: page,
    pageSize: pageSize,
    user_id: that.userInfo.id,
    state: that.state,
  }
  //请求数据
  tools.httpClient('home/WxStore/pagingOrder', data, (error, res) => {
    //console.log(res);
    if (res.errorCode == 0) {
      //隐藏加载中
      uni.hideLoading()

      var data = res.data
      var dataList = data.dataList
      allPages = data.pageInfo.all_pages
      var total_count = data.pageInfo.total_count

      //是否下拉触底
      var list = orbottom == 1 ? that.list : []

      //for循环数据
      for (var i = 0; i < dataList.length; i++) {
        var obj = dataList[i]
        var state = parseInt(obj.state)
        var goods_list = JSON.parse(obj.goods_list)
        // console.log(dataList[i]);
        if (goods_list[0]['property']) {
          var property = JSON.parse(goods_list[0]['property'])
          var property_text = ''
          for (var k = 0; k < property.length; k++) {
            property_text +=
              property[k]['name'] + ':' + property[k]['value'] + ' '
          }
          goods_list[0]['property'] = property_text
        }
        obj.goods_list = goods_list
        if (that.language == 0) {
          switch (state) {
            case 0:
              obj.state_text = '지불 대기'
              obj.btn_show = true
              obj.btn_opt = 'cancelOrder'
              obj.btn_text = '주문 취소'
              obj.btn_show2 = true
              obj.btn_opt2 = 'payOrder'
              obj.btn_text2 = '즉시 지불 하 다'
              break
            case 1:
              obj.state_text = '발송 대기 화물'
              obj.btn_show = true
              obj.btn_opt = 'refundOrder'
              obj.btn_text = '환불 을 신청 하 다'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              if (obj.is_top == 1) {
                obj.btn_show = false
              }
              break
            case 2:
              obj.state_text = '받 을 물건'
              obj.btn_show = true
              obj.btn_opt = 'findOrder'
              obj.btn_text = '물류'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              if (obj.is_top == 1) {
                obj.btn_show = false
              }
              break
            case 3:
              obj.state_text = '완료 됨'
              obj.btn_show = true
              obj.btn_opt = 'deleteOrder'
              obj.btn_text = '삭제'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              if (obj.is_top == 1) {
                obj.btn_show = false
              }
              break
            case 4:
              obj.state_text = '취소 됨'
              obj.btn_show = true
              obj.btn_opt = 'deleteOrder'
              obj.btn_text = '삭제'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              break
            case 6:
              obj.state_text = '환불 중'
              obj.btn_show = false
              obj.btn_opt = ''
              obj.btn_text = ''
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              break
            case 7:
              obj.state_text = '환불 됨'
              obj.btn_show = true
              obj.btn_opt = 'deleteOrder'
              obj.btn_text = '삭제'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              break
          }
        } else {
          switch (state) {
            case 0:
              obj.state_text = '待付款'
              obj.btn_show = true
              obj.btn_opt = 'cancelOrder'
              obj.btn_text = '取消订单'
              obj.btn_show2 = true
              obj.btn_opt2 = 'payOrder'
              obj.btn_text2 = '立即付款'
              break
            case 1:
              obj.state_text = '待发货'
              obj.btn_show = true
              obj.btn_opt = 'refundOrder'
              obj.btn_text = '申请退款'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              if (obj.is_top == 1) {
                obj.btn_show = false
              }
              break
            case 2:
              obj.state_text = '待收货'
              obj.btn_show = true
              obj.btn_opt = 'findOrder'
              obj.btn_text = '查看详情'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              if (obj.is_top == 1) {
                obj.btn_show = false
              }
              break
            case 3:
              obj.state_text = '已完成'
              obj.btn_show = true
              obj.btn_opt = 'deleteOrder'
              obj.btn_text = '删除'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              if (obj.is_top == 1) {
                obj.btn_show = false
              }
              break
            case 4:
              obj.state_text = '已取消'
              obj.btn_show = true
              obj.btn_opt = 'deleteOrder'
              obj.btn_text = '删除'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              break
            case 6:
              obj.state_text = '退款中'
              obj.btn_show = false
              obj.btn_opt = ''
              obj.btn_text = ''
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              break
            case 7:
              obj.state_text = '已退款'
              obj.btn_show = true
              obj.btn_opt = 'deleteOrder'
              obj.btn_text = '删除'
              obj.btn_show2 = false
              obj.btn_opt2 = ''
              obj.btn_text2 = ''
              break
          }
        }
        list.push(dataList[i])
      }
      //渲染页面数据
      that.list = list
      console.log(that.list)
      page++
      //设置无内容
      if (total_count == 0) {
        that.no_content = true
      } else {
        that.no_content = false
      }
    }
  })
}

export default {
  data() {
    return {
      base_url: base_url, //BASE_URL
      userInfo: [], //用户信息
      cityInfo: [], //用户城市信息
      state: -1, //订单状态
      list: [], //列表
      no_content: false, //无内容是否显示
      show_delivery: 0,
      open_index: '', //当前选择index
      language: 1, // 1 中文 ，0韩文
      waybillToken: '', //通过后台接口获取到的值
    }
  },
  onShow() {
    page = 1
    allPages = 0
    this.list = []
    GetList(this, 0)
  },
  onLoad(options) {
    var that = this
    console.log(options.state)
    //页面携带参数
    if (options.state) {
      that.state = options.state
    }

    //用户缓存信息
    that.userInfo = uni.getStorageSync('userInfo')
    that.language = uni.getStorageSync('language')
    //获取用户信息
    // that.getUserInfo();

    //加载分页信息
    page = 1
    allPages = 0
    that.list = []
    GetList(that, 0)
  },
  onUnload: function () {
    var that = this
    //初始化参数
    page = 1
    pageSize = 10
    allPages = 0
    that.list = []
  },
  onReachBottom: function () {
    var that = this
    if (page > allPages) {
      return false
    } else {
      GetList(that, 1)
    }
  },
  onPullDownRefresh: function () {
    var that = this
    //加载分页信息
    page = 1
    allPages = 0
    that.list = []
    GetList(that, 0)
    setTimeout(function () {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    copy(data) {
      tools.copy(data)
    },
    //获取用户信息
    getUserInfo: function () {
      var that = this
      tools.httpClient(
        'home/WxStore/getUserInfo',
        { user_id: userInfo.id },
        (error, result) => {
          if (result.errorCode == 0) {
            var userData = result.data
            userInfo = userData
            that.userInfo = userData
          }
        }
      )
    },

    // 在此通过调用api来查询微信快递服务详情
    searchDetail: function () {
      var plugin = requirePlugin('logisticsPlugin')
      const waybillToken = this.waybillToken
      console.log(waybillToken)
      plugin.openWaybillTracking({
        waybillToken: waybillToken,
      })
    },

    //切换订单状态
    changeState: function (e) {
      var that = this
      var state = e.currentTarget.dataset.state
      that.state = state

      //重新加载分页信息
      page = 1
      that.list = []
      GetList(that, 0)
    },

    //操作订单
    operationOrder: function (e) {
      var that = this
      var operation = e.currentTarget.dataset.operation
      var index = e.currentTarget.dataset.index
      var token = e.currentTarget.dataset.token
      //console.log(operation);
      if (operation == 'payOrder') {
        //立即支付
        that.payOrder(index)
      } else if (operation == 'refundOrder') {
        //申请退款
        that.refundOrder(index)
      } else if (operation == 'addComment') {
        //评价
        that.addComment(index)
      } else if (operation == 'deleteOrder') {
        //删除
        that.deleteOrder(index)
      } else if (operation == 'findOrder') {
        that.waybillToken = token
        that.findOrder()
      } else if (operation == 'cancelOrder') {
        that.cancelOrder(index)
      }
    },
    findOrder: function (index) {
      let oid = list[index].id
      if (oid) {
        uni.navigateTo({
          url: '/pages/userCenter/orderDetail/orderDetail?oid=' + oid,
        })
      }
      // that.searchDetail();
      // if(that.show_delivery == 0){
      // 	that.show_delivery = 1;
      // 	that.open_index = index;
      // }else{
      // 	that.show_delivery = 0;
      // }
    },
    //立即支付
    payOrder: function (index) {
      var that = this
      var list = that.list
      var oid = list[index].id
      uni.request({
        url: base_url + '../extend/pay/request/WxAppPay.php',
        data: { oid: oid },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'GET',
        success: function (res) {
          uni.hideLoading() //隐藏提示层
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
                        url: '/pages/userCenter/orderList/orderList?state=1',
                      })
                    }, 1000)
                  },
                })
              },
            })
          } else if (res.data.errorCode == 1) {
            uni.showToast({
              title: res.data.errorInfo || '跳转支付失败，请尝试重新支付!',
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
    },

    //申请退款
    refundOrder: function (index) {
      var that = this
      var list = that.list
      var data = {
        oid: list[index].id,
        state: 6,
      }
      //提示
      uni.showModal({
        title: '提示',
        content: '确定申请退款吗？',
        showCancel: true,
        confirmColor: '#3056d1',
        success: function (res) {
          if (res.confirm) {
            //退款操作
            uni.showLoading({
              title: '加载中',
            })
            if (is_click) {
              is_click = false
              tools.httpClient(
                'home/WxStore/setOrderState',
                data,
                function (err, res) {
                  uni.hideLoading()
                  if (res.errorCode == 0) {
                    is_click = true
                    //重新加载分页信息
                    page = 1
                    that.list = []
                    GetList(that, 0)
                  } else {
                    is_click = true
                    uni.showToast({
                      title: '操作失败',
                      icon: 'none',
                      duration: 2000,
                    })
                  }
                }
              )
            }
          }
        },
      })
    },
    //取消订单
    cancelOrder: function (index) {
      var that = this
      var list = that.list
      var data = {
        oid: list[index].id,
        state: 4,
      }
      //提示
      uni.showModal({
        title: '提示',
        content: '确定取消订单吗？',
        showCancel: true,
        confirmColor: '#3056d1',
        success: function (res) {
          if (res.confirm) {
            //取消操作
            uni.showLoading({
              title: '加载中',
            })
            if (is_click) {
              is_click = false
              tools.httpClient(
                'home/WxStore/setOrderState',
                data,
                function (err, res) {
                  uni.hideLoading()
                  if (res.errorCode == 0) {
                    is_click = true
                    //重新加载分页信息
                    page = 1
                    that.list = []
                    GetList(that, 0)
                  } else {
                    is_click = true
                    uni.showToast({
                      title: '操作失败',
                      icon: 'none',
                      duration: 2000,
                    })
                  }
                }
              )
            }
          }
        },
      })
    },

    //评价
    addComment: function (index) {
      var that = this
      var list = that.list
      var oid = list[index].id
      if (oid) {
        uni.navigateTo({
          url: '/pages/userCenter/addComment/addComment?oid=' + oid,
        })
      }
    },

    //删除订单
    deleteOrder: function (index) {
      var that = this
      var list = that.list
      var data = {
        oid: list[index].id,
      }
      //提示
      uni.showModal({
        title: '提示',
        content: '确定删除该订单吗？',
        showCancel: true,
        confirmColor: '#3056d1',
        success: function (res) {
          if (res.confirm) {
            //删除操作
            uni.showLoading({
              title: '加载中',
            })
            tools.httpClient(
              'home/WxStore/deleteOrder',
              data,
              function (err, res) {
                uni.hideLoading()
                if (res.errorCode == 0) {
                  //重新加载分页信息
                  page = 1
                  that.list = []
                  GetList(that, 0)
                } else {
                  uni.showToast({
                    title: '操作失败',
                    icon: 'none',
                    duration: 2000,
                  })
                }
              }
            )
          }
        },
      })
    },
    gotoOrderDetail(e) {
      var oid = e.currentTarget.dataset.oid
      console.log('---oid---', oid)
      if (oid) {
        uni.navigateTo({
          url: '/pages/userCenter/orderDetail/orderDetail?oid=' + oid,
          // url:'/pages/store/goodsDetail/goodsDetail?gid='+gid
        })
      }
    },
    //订单商品详情
    // goodDetail:function(e){
    // 	var gid = e.currentTarget.dataset.gid;
    // 	if(gid){
    // 		uni.navigateTo({
    // 			url:'/pages/store/goodsDetail/goodsDetail?gid='+gid
    // 		})
    // 	}
    // },
  },
}
</script>

<style>
@import url('./orderList.css');
</style>
