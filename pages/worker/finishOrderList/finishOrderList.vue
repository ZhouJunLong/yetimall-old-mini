<template>
	<view class="wrap">
		<view class="tab-area">
			<view :class="[cur == 1 ? 'tab-list  cur':'tab-list']" data-cur="1" @click="changeState">当月完成订单</view>
			<view :class="[cur == 2 ? 'tab-list  cur':'tab-list']" data-cur="2" @click="changeState">总计完成订单</view>
		</view>
		<view class="order-area">
			<!-- 订单 --> 
			<view class="order-list" v-for="(item,index) in list" :key="1" @click="orderDetail" data-id="item.id">
				<view class="order-mid">
					<view class="good-list">
						<image :src="base_url+item.orderInfo.good_img" class="good-img"></image>
						<view class="order-good">
							<view class="good-top">
								<view class="good-name">{{item.orderInfo.good_name}}</view>
								<!-- <view class="good-count">x{{item.orderInfo.good_count}}</view> -->
							</view>
							<view class="good-mid" v-if="item.orderInfo.type != 3">
								<view class="desc">
									<text>{{item.orderInfo.good_desc}}</text>
									<text style="padding-left:10rpx;">{{item.orderInfo.good_label==1?'日间':'夜间'}}</text>
								</view>
								<view class="person">服务人员：{{item.orderInfo.server_person}}人</view>
							</view>
							<view class="good-bot">
								<view>￥{{item.orderInfo.good_price}}</view>
								<view>剩余次数:{{item.orderInfo.residue_num}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="address-area">
					<view class="address-top">
						<text>姓名：{{item.orderInfo.address.name}}</text>
						<text class="phone">联系方式：{{item.orderInfo.address.phone}}</text>
					</view>
					<view class="address-bot">地址：{{item.orderInfo.address.address}}</view>
				</view>
				<view class="order-bot">
					<view class="order-desc">
						<text>共1项服务</text>
						<text class="unit">合计：</text>
						<text class="total_price">￥{{item.orderInfo.total_price}}</text>
					</view>
					<view class="btn-area">
						<view class="btn-list" v-if="item.state == 1" @click="startServer" data-index="index">开始服务</view>
						<view class="btn-list" v-if="item.state == 2" @click="endServer" data-index="index">完成服务</view>
						<view class="btn-list finish" v-if="item.state == 3" data-index="index">已完成</view>
					</view>
				</view>
			</view>
			<view v-if="list.length==0" class="no-more">暂无订单</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var app = getApp();
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
			worker_id:userInfo.worker_id,
			state:3,
			cur:that.cur
		};
		wx.showLoading({
			title:'加载中'
		});
		tools.httpClient('home/WxStore/pagingOrderRecord',cData, (error, data) => {
			wx.hideLoading();
			bStop = true;
			var res = data;
			var data = data.data;
			var list = that.list;
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
				base_url: base_url,
				userInfo: [],//用户信息
				list:[],
				cur:1,
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//获取分页信息
			if(options.cur){
				page = 1;
				that.list = [];
				that.cur = options.cur;
				pagingOrderRecord(that);
			}
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
			
			//状态选择
			changeState:function(e){
				let that = this;
				let cur = e.currentTarget.dataset.cur;
				page = 1;
				that.list = [];
				that.cur = cur;
				pagingOrderRecord(that);
			},
		}
	}
</script>

<style>
	@import url("./finishOrderList.css");
	@import url("/app.css");
</style>
