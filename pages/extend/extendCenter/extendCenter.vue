<template>
	<view class="wrap">
		<!-- 头部区域 -->
		<view class="top-area">
			<image :src="extend_bg_png" class="head-img"></image>
			<view class="head-area">
				<view class="desc">我的积分</view>
				<view class="fee">{{userInfo.points}}</view>
			</view>
		</view>
		<!-- 我的积分 -->
		<view class="middle-area">
			<view class="fee-area">
				<text class="fee-desc">我的积分</text>
				<text class="my-fee">{{userInfo.points}}</text>
			</view>
			<view class="withdraw" @click="goIndex">去使用</view>
		</view>
		<!-- 功能按钮 -->
		<view class="menu-area">
			<view class="menu-list" @click="pointsRecord">
				<view class="goto">
					<text class="iconfont icon-tongji"></text>
					<text>收益统计</text>
				</view>
				<view class="iconfont icon-you"></view>
			</view>
			<view class="menu-list" @click="promation">
				<view class="goto">
					<text class="iconfont icon-qrcode1"></text>
					<text>推广二维码</text>
				</view>
				<view class="iconfont icon-you"></view>
			</view>
			<view class="menu-list" @click="promotionRule">
				<view class="goto">
					<text class="iconfont icon-mianzeshengming"></text>
					<text>推广声明</text>
				</view>
				<view class="iconfont icon-you"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var did = 0;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				extend_bg_png: base_url+'bg/extend_bg.png',//推广中心图片
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
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
			
			//去使用
			goIndex:function(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
			},
			
			//收益统计
			pointsRecord:function(){
				uni.navigateTo({
					url:'/pages/extend/pointsRecord/pointsRecord'
				})
			},
			
			//海报
			promation:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				};
				uni.navigateTo({
					url:'/pages/extend/promation/promation'
				})
			},
			
			//推广声明
			promotionRule:function(){
				uni.navigateTo({
					url:'/pages/extend/promotionRule/promotionRule'
				})
			},
			
		}
	}
</script>

<style>
	@import url("./extendCenter.css");
</style>
