<template>
	<view class="wrap">
		<!-- 头部区域 -->
		<view class="top-area">
			<view class="top-info" v-if="userInfo.id">
				<view class="user-info">
					<image :src="userInfo.head_img_url" class="head_img"></image>
					<view class="user">
						<view class="nick_name">{{userInfo.nick_name}}</view>
					</view>
				</view>
			</view>
			<view class="no-user" v-if="!userInfo.id && !userInfo.nickName">
				<view class="peron-info" @click="userLogin" v-if="language == 0">상륙 하 다.</view>
				<view class="peron-info" @click="userLogin" v-else>登陆</view>
			</view>

			<view class="top-info" v-if="userInfo.id || userInfo.nickName">
				<view class="user-info">
					<image :src="userInfo.avatarUrl" class="head_img"></image>
					<view class="user">
						<view class="nick_name">{{userInfo.nickName}}</view>
						<view class="submit-info" @click="prefectInfo" v-if="language == 0">완벽 한 정보</view>
						<view class="submit-info" @click="prefectInfo" v-else>{{ prefectInfoText }}</view>
					</view>
				</view>
			</view>
			
			<!-- 主体 -->
			<view class="main-area">
				<view class="order">
					<view class="order-title">
						<text class="order-inner-title" v-if="language == 0">내 주문서</text>
						<text class="order-inner-title" v-else>我的订单</text>
						<text class="order-list" @click="orderList(-1)" v-if="language == 0">주문 확인<i class="iconfont icon-youjiantouda"></i></text>
						<text class="order-list" @click="orderList(-1)" v-else>查看订单<i class="iconfont icon-youjiantouda"></i></text>
					</view>
					<view class="order-options">
						<view class="order-option-item" @click="orderList(0)">
							<image src="../../../static/images/isPay.png"></image>
							<text v-if="language == 0">지불 대기</text>
							<text v-else>待付款</text>
						</view>
						<view class="order-option-item" @click="orderList(1)">
							<image src="../../../static/images/isSend.png"></image>
							<text v-if="language == 0">발송 대기 화물</text>
							<text v-else>待发货</text>
						</view>
						<view class="order-option-item" @click="orderList(2)">
							<image src="../../../static/images/isCheck.png"></image>
							<text v-if="language == 0">받 을 물건</text>
							<text v-else>待收货</text>
						</view>
						<view class="order-option-item" @click="orderList(3)">
							<image src="../../../static/images/isFinish.png"></image>
							<text v-if="language == 0">완료 됨</text>
							<text v-else>已完成</text>
						</view>
						<view class="order-option-item" @click="orderList(7)">
							<image src="../../../static/images/isRefun.png"></image>
							<text v-if="language == 0">환불 됨</text>
							<text v-else>已退款</text>
						</view>
					</view>
				</view>
				<view class="options">
					<view class="like" @click="likeList()">
						<view class="left">
							<text class="iconfont icon-aixin"></text>
							<text v-if="language == 0">나의 소장 품</text>
							<text v-else>我的收藏</text>
						</view>
						<view class="right">
							<text class="iconfont icon-youjiantouda"></text>
						</view>
					</view>
					<view class="address" @click="addressList">
						<view class="left">
							<text class="iconfont icon-lianxiren"></text>
							<text v-if="language == 0">주소 관리</text>
							<text v-else>地址管理</text>
						</view>
						<view class="right">
							<text class="iconfont icon-youjiantouda"></text>
						</view>
					</view>
					<button class="online-kefu" open-type="contact">
						<view class="left">
							<text class="iconfont icon-kefu"></text>
							<text>在线客服</text>
						</view>
						<view class="right">
							<text class="iconfont icon-youjiantouda"></text>
						</view>
					</button>
				</view>
				<view class="kefu">
					<text v-if="language == 0">고객 센터 핫라인 으로 전화 할 수 있 습 니 다.：</text>
					<text v-else>客服热线可拨打：</text>
					<text class="phone">{{configInfo.service_phone}}</text>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var cityInfo = "";
	var did = 0;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityInfo: [],//用户城市信息
				server_bg_png: base_url+'bg/server_bg.png',//预约服务图片
				points_bg_png: base_url+'bg/points_bg.png',//积分图片
				configInfo:'',
				language:1,// 1 中文 ，0韩文
			}
		},
		computed:{
			prefectInfoText(){
				return this.userInfo.id ? '修改信息' : '完善信息'
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");//{'id':1,'nick_name':'李易峰'};//
			// console.log(that.userInfo);
			that.language = uni.getStorageSync("language");
			
			//获取用户信息
			// that.getUserInfo();
			
			//用户城市信息
			cityInfo = uni.getStorageSync('cityInfo');
			if(cityInfo){
				that.cityInfo = cityInfo;
			}
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");//{'id':1,'nick_name':'李易峰'};//
			// console.log(that.userInfo);
			that.language = uni.getStorageSync("language");
			//获取用户信息
			// that.getUserInfo();
			
			//获取配置信息	
			that.getConfigInfo();
		},
		methods: {
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo', {'user_id':userInfo.id}, (error, result) => {
					if (result.errorCode == 0) {
						var userData = result.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				})
			},
			
			//获取配置信息
			getConfigInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getConfigInfo', {}, (error, res) => {
					if (res.errorCode == 0) {
						that.configInfo = res.data;
					}
				})
			},
			
			//个人信息
			editUser: function() {
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				uni.navigateTo({
					url: "/pages/userCenter/editUser/editUser"
				})
			},
			
			prefectInfo:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				uni.navigateTo({
					url: "/pages/userCenter/prefectInformation/prefectInformation"
				})
			},
			
			//登陆
			userLogin: function() {
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				};
			},
		
			//地址管理
			addressList:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				uni.navigateTo({
				    url: '/pages/address/addressList/addressList'
				})
			},
			
			//收藏管理
			likeList:function(){
				var that = this;
				//判断用户授权
				// if(!tools.isWeixinLogin()){
				// 	return false;
				// }
				uni.navigateTo({
				    url: '/pages/like/likeList'
				})
			},
			//订单列表
			orderList:function(state){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				uni.navigateTo({
				    url: '/pages/userCenter/orderList/orderList?state='+state
				})
			},
			
		}
	}
</script>
<style>
	@import url("./userCenter.css");
</style>

