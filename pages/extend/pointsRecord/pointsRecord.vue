<template>
	<view class="wrap">
		<!-- 主内容 -->
		<view class="main-area" v-if="list.length > 0">
			<block v-for="(item, index) in list">
				<view class="main-list" @click="recordDetail" :data-index="index">
					<view class="head-area">
						<view>下单时间：{{item.orderInfo.add_time}}</view>
						<text class="iconfont icon-you2"></text>
					</view>
					<view class="cont-area">
						<view class="user-info">
							<image class="head-img" :src="item.orderInfo.head_img_url"></image>
							<view class="user-list">
								<view class="name">{{item.orderInfo.nick_name}}</view>
								<view class="time">时间: {{item.add_time}}</view>
							</view>
						</view>
						<view class="money">+{{item.points}}</view>
					</view>
				</view>
			</block>
		</view>
		<view class="no-more" v-else>没有更多了</view>
		
		<!--收入详情-->
		<view class="modal-area" v-if="isShow">
			<view class="modal-cont" v-if="recordInfo">
				<view class="modal-head" @click="closeModal">
					<view class="title">收益详情</view>
					<view class="iconfont icon-guanbi1"></view>
				</view>
				<view class="modal-mid">
					<view class="modal-user">
						<text class="desc-name">分享用户：</text>
						<text class="name">{{recordInfo.orderInfo.nick_name}}</text>
					</view>
					<view class="modal-fee">
						<text class="fee">{{recordInfo.points}}</text>
					</view>
				</view>
				<view class="order-goods">
					<view class="good-list">
						<view class="good">
							<view class="field">商品</view>
							<view class="value">{{recordInfo.orderInfo.good_name}}</view>
						</view>
						<view class="good">
							<view class="field">购买份数</view>
							<view class="value">{{recordInfo.orderInfo.good_count}}</view>
						</view>
					</view>
				</view>
				<view class="bottom-area">
					<view class="info-list">
						<view>订单号</view>
						<view>{{recordInfo.orderInfo.order_num}}</view>
					</view>
					<view class="info-list">
						<view>支付金额</view>
						<view>{{recordInfo.orderInfo.total_price}}</view>
					</view>
					<view class="info-list">
						<view>下单时间</view>
						<view>{{recordInfo.orderInfo.add_time}}</view>
					</view>
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
	var did = 0;
	
	//分页信息
	var page = 1;
	var pageSize = 10;
	var allPages = 0;
	
	//加载数据
	var GetList = function (that, orbottom) {
		//显示加载中
		uni.showLoading({
			title: '加载中',
		});
		//用户id
		var user_id = userInfo.id;
		if(user_id == undefined){
		  user_id = 0;
		}
		//data数据
		var data = {
			pageIndex: page,
			pageSize: pageSize,
			user_id: userInfo.id,
			type: 2,
		}
		//请求数据
		tools.httpClient('home/WxStore/pagingPointsRecord', data, (error, res) => {
			//console.log(res);
			if (res.errorCode == 0) {
				//隐藏加载中
				uni.hideLoading();
		
				var data = res.data;
				var dataList = data.dataList;
				allPages = data.pageInfo.all_pages;
				var total_count = data.pageInfo.total_count;
		
				//是否下拉触底
				var list = orbottom == 1 ? that.list : [];
		
				//for循环数据
				for (var i = 0; i < dataList.length; i++) {
					list.push(dataList[i]);
				}
				//渲染页面数据
				that.list = list;
				page++;
				//设置无内容
				if (total_count == 0) {
					that.no_content = true;
				} else {
					that.no_content = false;
				}
			}
		})
	}
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				list: [],//列表
				no_content: false,//无内容是否显示
				isShow: false,//是否显示收益详情
				recordInfo: '',//收益信息
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//加载分页信息
			page = 1;
			allPages = 0;
			that.list = [];
			GetList(that, 0);
		},
		onUnload: function () {
		    var that = this;
		    //初始化参数
		    page = 1;
		    pageSize = 10;
		    allPages = 0;
			that.list = [];
		},
		onReachBottom: function () {
		    var that = this;
		    if (page > allPages) {
				return false;
		    } else {
				GetList(that, 1);
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
				});
			},
			
			//收益统计详情
			recordDetail:function(e){
				var that = this;
				var index = e.currentTarget.dataset.index;
				var list = that.list;
				that.isShow = true;
				that.recordInfo = list[index];
			},
				
			//关闭收益详情
			closeModal:function(){
				var that = this;
				that.isShow = false;
			},
			
			//不关闭收益详情
			noCloseModal:function(){
				var that = this;
			},
			
		}
	}
</script>

<style>
	@import url("./pointsRecord.css");
</style>
