<template>
	<view class="wrap">
		
		<view class="top-area">
			<image class="top-img" mode="widthFix" :src="worker_center"></image>
			<view class="top-info" v-if="userInfo">
				<image :src="userInfo.head_img_url" class="head_img"></image>
				<view class="nick_name">{{userInfo.nick_name}}</view>
				<view class="count-area">
					<view class="count-list" @click="finishOrderList" data-cur="2">
						<view class="count-num">{{total_num}}</view>
						<view class="count-tip">总单量</view>
						<view class="bor"></view>
					</view>
					<view class="count-list" @click="finishOrderList" data-cur="1">
						<view class="count-num">{{month_num}}</view>
						<view class="count-tip">月总单量</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 主体 -->
		<view class="main-area">
			<!-- 购买的服务 -->
			<view class="main-six">
				<view class="six-top" @click="orderList" data-state="1,2">
					<view class="top-left">
						<text class="iconfont icon-shuxian1"></text>
						<text>全部订单</text>
					</view>
					<text class="iconfont icon-you"></text>
				</view>
				<view class="six-bot">
					<view class="six-right" @click="orderList" data-state="3">
						<image mode="widthFix" :src="order_right" class="six-img" ></image>
						<view class="six-info">
							<view class="six-name">已完成</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 菜单 -->
		<view class="menu-area">
			<view class="menu-list" @click="leave">
				<view>请假</view>
				<text class="iconfont icon-you"></text>
			</view>
			<view class="menu-list" @click="compensatoryLeave">
				<view>调休</view>
				<text class="iconfont icon-you"></text>
			</view>
			<view class="menu-list" @click="leaveSchedule">
				<view>请假调休进度</view>
				<text class="iconfont icon-you"></text>
			</view>
			<view class="menu-list" @click="workerMaterial">
				<view>物料申请</view>
				<text class="iconfont icon-you"></text>
			</view>
			<view class="menu-list" @click="salaryRecord">
				<view>工资进度</view>
				<text class="iconfont icon-you"></text>
			</view>
		</view>
		<view class="nav-list">
		    <navigator class="item home" open-type='reLaunch' url='/pages/worker/index/index'>
		        <text class="iconfont icon-dingdan"></text>
		        <view class='nav-title'>我的订单</view>
		    </navigator>
		    <navigator class="item center" open-type='reLaunch' url='/pages/worker/userCenter/userCenter'>
		        <i class="iconfont icon-gerenzhongxin1"></i>
		        <view class='nav-title'>个人中心</view>
		    </navigator>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo:[],
				account:'',
				password:'',
				worker_center:base_url+'bg/worker_center.png',
				order_right:base_url+'bg/order_right.png',
				month_num:0,
				total_num:0,
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			that.getUserInfo();
			
			that.getWorkerNum();
			
			//导航标识
			var native = {
				home:'',
				center:'active'
			}
			that.native = native;
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
			
			//全部订单列表页面
			orderList:function(e){
				var state = e.currentTarget.dataset.state;
				uni.navigateTo({
					url:"/pages/worker/orderList/orderList?state="+state
				})
			},
			
			//已完成订单页面
			finishOrderList:function(e){
				var cur = e.currentTarget.dataset.cur;
				uni.navigateTo({
					url:"/pages/worker/finishOrderList/finishOrderList?cur="+cur
				})
			},
			
			//获取师傅月单量和总单量
			getWorkerNum:function(){
				var that = this;
				var data = {
					worker_id:userInfo.worker_id
				};
				tools.httpClient('home/WxStore/getWorkerNum', data, (error, res) => {
					if (res.errorCode == 0) {
						that.month_num  = res.data.month_num;
						that.total_num = res.data.total_num;
					}
				});
			},
			
			//请假
			leave:function(){
				uni.navigateTo({
					url:"/pages/worker/leave/leave"
				})	
			},
			
			//调休
			compensatoryLeave:function(){
				uni.navigateTo({
					url:"/pages/worker/compensatoryLeave/compensatoryLeave"
				})	
			},
			
			//请假调休进度
			leaveSchedule:function(){
				uni.navigateTo({
					url:"/pages/worker/leaveSchedule/leaveSchedule"
				})	
			},
			
			//物料申请
			workerMaterial:function(){
				uni.navigateTo({
					url:"/pages/worker/workerMaterial/workerMaterial"
				})	
			},
			
			//工资进度
			salaryRecord:function(){
				uni.navigateTo({
					url:"/pages/worker/salaryRecord/salaryRecord"
				})	
			}
		}
	}
	
</script>

<style>
	@import url("./userCenter.css");
	@import url("/app.css");
	@import url("/template.css");
</style>
