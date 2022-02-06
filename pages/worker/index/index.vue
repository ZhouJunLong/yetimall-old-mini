<template>
	<view class="wrap">
		<view class="header">
			<view class="left">订单列表</view>
			<view class="right">
				<view class="time">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}<text class="iconfont icon-icon-up1"></text></view>
					</picker>
				</view>
			</view>
		</view>
		<view class="box-area">
			<view v-for="(item,index) in list" :key="item.id">
				<view class="box">
					<view class="head" @click="orderDetail" :data-id='item.id'>
						<view class="left">
							<view class="head-img">
								<img :src="item.orderInfo.head_img_url">
							</view>
							<view class="nick_name">{{item.orderInfo.nick_name}}</view>
						</view>
						<view class="right">预约上门：{{item.order_time}}</view>
					</view>
					<view class="center" @click="orderDetail" :data-id='item.id'>
						<view class="left">
							<img :src="base_url+item.orderInfo.good_img">
						</view>
						<view class="right">
							<view class="tops">{{item.orderInfo.good_name}}</view>
							<view class="middle">规格：{{item.orderInfo.good_desc}}</view>
							<view class="middle">服务人员：{{item.orderInfo.server_person}}人</view>
							<view class="money">￥{{item.orderInfo.good_price}}</view>
						</view>
					</view>
					<view class="name-area" @click="orderDetail" :data-id='item.id'>
						<view class="name">姓名：{{item.orderInfo.address.name}}</view>
						<view class="phone">联系方式：{{item.orderInfo.address.phone}}</view>
					</view>
					<view class="address">地址：{{item.orderInfo.address.address}}</view>
					<view class="footer">
						<view class="left">
							共1项服务   合计：<text>￥{{item.orderInfo.total_price}}</text>
						</view>
						<view class="right">
							<view class="btn-list" v-if="item.state==1" @click="startServer" :data-index="index">开始服务</view>
							<view class="btn-list" v-if="item.state==2" @click="endServer" :data-index="index">完成服务</view>
							<view class="btn-list finish" v-if="item.state==3">已完成</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="list.length==0" class="no-more">暂无数据</view>
		</view>
		<view class="nav-list">
		    <navigator class="item home" open-type='reLaunch' url='/pages/worker/index/index'>
		        <text class="iconfont icon-dingdan"></text>
		        <view class='nav-title'>接单大厅</view>
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
	var userInfo = "";
	var base_url = CONFIG.BASE_URL;
	var page = 1;
	var pageSize = 10;
	var allPages = 0;
	var bStop = true;
	var is_click = true;
	
	//页面初始化数据
	var pagingOrderRecord = function(that) {
		var cData = {
			pageIndex:page,
			pageSize:pageSize,
			date:that.date,
			worker_id:userInfo.worker_id,
			state:''
		};
		uni.showLoading({
			title:'加载中'
		});
		tools.httpClient('home/WxStore/pagingOrderRecord',cData, (error, data) => {
			uni.hideLoading();
			bStop = true;
			var res = data;
			var data = data.data;
			var list = that.list;
			console.log('结果集', list);
			//成功查询到结果集
			if (res.errorCode == 0) { //查询成功
				for (var i = 0; i < data.dataList.length; i++) {
					list.push(data.dataList[i]);
				}
				allPages = data.pageInfo.all_pages;
			}
			that.list = list;
			page++;
		});
	}
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				list:[],
				array:[1,2,3,4],
				date:new Date().toISOString().slice(0, 10),
				startDate:'1911-01-01',
				endDate:'4999-12-31'
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			var native = {
				home:'active',
				center:''
			}
			that.native = native;
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");	
					
			//获取用户信息
			that.getUserInfo();
			
			//获取分页信息
			page = 1;
			that.list = [];
			pagingOrderRecord(that);
		},
		methods: {
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo',{'user_id':userInfo.id}, (error, result) => {
					if (result.errorCode == 0) {
						var userData = result.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				});
			},
			
			bindDateChange: function(e) {
				var that = this;
				that.date = e.target.value;
				page = 1;
				that.list = [];
				pagingOrderRecord(that);
			},
			
			//开始服务
			startServer:function(e){
				var that = this;
				var index = e.currentTarget.dataset.index;
				var list = that.list;
				var rid = list[index].id;
				var cus_lat = list[index].orderInfo.address.latitude;
				var cus_lon = list[index].orderInfo.address.longitude;
				var data = {
					latitude:that.latitude,
					longitude:that.longitude,
					cus_lat:cus_lat,
					cus_lon:cus_lon,
					type:1,
					rid:rid
				};
				uni.showLoading({
					title:'加载中'
				});
				tools.httpClient('home/WxStore/getDistance', data, (err, res) => {
					uni.hideLoading();
					if (res.errorCode == 0) {
						uni.navigateTo({
							url:'/pages/worker/finishService/finishService?type=1&rid='+rid
						})
					}
					else{
						uni.showModal({
							title:'提示',
							content:'不在订单服务区内，仍要确定开始服务吗?',
							confirmColor:"#0079FF",
							success:function(res){
								if(res.confirm){
									uni.navigateTo({
										url:'/pages/worker/finishService/finishService?type=1&rid='+rid
									})
								}
							}
						})
					}
				});
			},
			
			//完成服务
			endServer:function(e){
				var that = this;
				var index = e.currentTarget.dataset.index;
				var list = that.list;
				var rid = list[index].id;
				var cus_lat = list[index].orderInfo.address.latitude;
				var cus_lon = list[index].orderInfo.address.longitude;
				var data = {
					latitude:that.latitude,
					longitude:that.longitude,
					cus_lat:cus_lat,
					cus_lon:cus_lon,
					type:2,
					rid:rid
				};
				uni.showLoading({
					title:'加载中'
				});
				tools.httpClient('home/WxStore/getDistance', data, (err, res) => {
					uni.hideLoading();
					if (res.errorCode == 0) {
						uni.navigateTo({
							url:'/pages/worker/finishService/finishService?type=2&rid='+rid
						})
					}
					else{
						uni.showModal({
							title:'提示',
							content:'不在订单服务区内，仍要确定结束服务吗?',
							confirmColor:"#0079FF",
							success:function(res){
								if(res.confirm){
									uni.navigateTo({
										url:'/pages/worker/finishService/finishService?type=2&rid='+rid
									})
								}
							}
						})
					}
				})
			},
			
			//订单详情页面
			orderDetail:function(e){
				var oid = e.currentTarget.dataset.id;
				uni.navigateTo({
					url:"/pages/worker/orderDetail/orderDetail?oid="+oid
				})
			}
		}
	}
</script>

<style>
	@import url("./index.css");
	@import url("/app.css");
	@import url("/template.css");
</style>
