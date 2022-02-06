<template>
	<view class="wrap">
		<!-- 顶部区域 -->
		<view class="top-area">
			<image class="top-img" :src="mamager_center_png" mode="widthFix"></image>
			<view class="top-info" v-if="userInfo.id">
				<image :src="userInfo.head_img_url" class="head_img"></image>
				<view class="nick_name">{{userInfo.nick_name}}</view>
				<view class="count-area">
					<view class="count-list">
						<view class="count-num">{{total_num}}</view>
						<view class="count-tip">总品控数</view>
						<view class="bor"></view>
					</view>
					<view class="count-list">
						<view class="count-num">{{month_num}}</view>
						<view class="count-tip">月品控数</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 菜单 -->
		<view class="menu-area">
			<view class="menu-list" @click="addLeave">
				<view>请假</view>
				<text class="iconfont icon-you"></text>
			</view>
			<view class="menu-list" @click="addExchange">
				<view>调休</view>
				<text class="iconfont icon-you"></text>
			</view>
			<view class="menu-list" @click="leaveList">
				<view>请假调休进度</view>
				<text class="iconfont icon-you"></text>
			</view>
			<view class="menu-list" @click="leave">
				<view>物料申请</view>
				<text class="iconfont icon-you"></text>
			</view>
			<view class="menu-list" catchtap="leave">
				<view>工资进度</view>
				<text class="iconfont icon-you"></text>
			</view>
		</view>
		<!-- tabbar -->
		<view class="uni-tabbar space-around">
			<navigator url="/pages/manager/index/index" open-type="navigate" class="uni-tabbar-item space-around-item">
				<image src="/static/images/manager/tab-index-select.png" v-if="active == 1"></image>
				<image src="/static/images/manager/tab-index.png" v-else></image>
				<view class="uni-tabbar-name">师傅服务</view>
			</navigator>
			<view class="uni-tabbar-item uni-tabbar-center space-around-item">
				<image src="/static/images/manager/tab-center-select.png" v-if="active == 2"></image>
				<image src="/static/images/manager/tab-center.png" v-else></image>
				<view class="uni-tabbar-name">个人中心</view>
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
				active: 2,//导航
				mamager_center_png: base_url+'bg/mamager_center.png',//客户经理背景图片
				total_num: 0,//总品控数
				month_num: 0,//月品控数
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰','manager_id':1};//uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰','manager_id':1};//uni.getStorageSync("userInfo");
			
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
						
						//统计客户经理品控数量
						that.getManagerControlNum();
					}
				})
			},
			
			//统计客户经理品控数量
			getManagerControlNum:function(){
				var that = this;
				tools.httpClient('home/WxStore/getManagerControlNum', {'manager_id':userInfo.manager_id}, (error, res) => {
					//console.log(res);
					if (res.errorCode == 0) {
						var total_num = res.total_num;
						var month_num = res.month_num;
						that.total_num = total_num;
						that.month_num = month_num;
					}
				})
			},
			
			//请假
			addLeave:function(){
				var that = this;
				uni.navigateTo({
					url: '/pages/manager/addLeave/addLeave'
				})
			},
			
			//调休
			addExchange:function(){
				var that = this;
				uni.navigateTo({
					url: '/pages/manager/addExchange/addExchange'
				})
			},
			
			//请假调休进度
			leaveList:function(){
				var that = this;
				uni.navigateTo({
					url: '/pages/manager/leaveList/leaveList'
				})
			},
			
			
			
		}
	}
</script>

<style>
	@import url("./managerCenter.css");
</style>
