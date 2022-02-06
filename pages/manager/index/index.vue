<template>
	<view class="wrap">
		<!-- 搜索框 -->
		<view class="search-area space-between">
			<view class="search-list space-between-item">
				<view class="search-info">
					<text class="iconfont icon-sousuo"></text>
					<input type="text" class="inp" placeholder="输入姓名、手机号搜索" placeholder-style="color:#999;font-size:13px;" @input="keywordsInput" />
				</view>
				<view class="search-right" @click="seachServer">搜索</view>
			</view>
			<view class="search-date space-between-item">
				<picker mode="date" :value="date" @change="addDateChange">
					<view class="uni-input" v-if="date">{{date}}</view>
					<view class="uni-input" v-else>请选择</view>
					<text class="iconfont icon-icon-up1"></text>
				</picker>
			</view>
		</view>
		<!-- 服务列表 -->
		<view class="server-list">
			<block v-for="(item, index) in list">
				<view class="server-item">
					<view class="server-order space-between">
						<view class="server-order-left space-between-item flex-row">
							<image class="server-order-head flex-row-item" :src="item.orderInfo.head_img_url"></image>
							<text class="server-order-name flex-row-item">{{item.orderInfo.nick_name}}</text>
						</view>
						<view class="server-order-right space-between-item">预约上门：{{item.order_time}}</view>
					</view>
					<view class="server-good order-mid">
						<view class="good-list" @click="goodDetail" :data-gid="item.orderInfo.gid">
							<view class="good-img">
								<image mode="widthFix" :src="base_url+item.orderInfo.good_img"></image>
							</view>
							<view class="order-good">
								<view class="good-top">
									<view class="good-name">{{item.orderInfo.good_name}}</view>
								</view>
								<view class="good-mid" v-if="item.orderInfo.type != 3">
									<view class="desc">
										<text>{{item.orderInfo.good_desc}}</text>
										<text style="padding-left:10rpx;">{{item.orderInfo.good_label==1?'日间':'夜间'}}</text>
									</view>
									<view class="person">服务人员：{{item.orderInfo.server_person}}人</view>
								</view>
								<view class="good-mid" v-else></view>
								<view class="good-bot">￥{{item.orderInfo.good_price}}</view>
							</view>
						</view>
					</view>
					<view class="server-worker">
						<view class="server-user-name">
							<text>姓名：{{item.orderInfo.address.name}}</text>
							<text class="server-user-phone">联系方式：{{item.orderInfo.address.phone}}</text>
						</view>
						<view class="server-user-address flex-row">
							<text class="worker-address-name flex-row-item">地址：</text>
							<text class="worker-address-value flex-row-item">{{item.orderInfo.address.city}} {{item.orderInfo.address.region}} {{item.orderInfo.address.address}} {{item.orderInfo.address.village}}{{item.orderInfo.address.building}}栋{{item.orderInfo.address.unit}}单元{{item.orderInfo.address.room}}室</text>
						</view>
						<view class="server-worker-name">服务师傅：{{item.worker_name}}</view>
					</view>
					<view class="server-price space-between">
						<view class="server-price-left space-between-item">
							<text class="server-price-left-count">共1项服务</text>
							<text>合计：</text>
							<text class="server-price-left-value">￥{{item.orderInfo.total_price}}</text>
						</view>
						<view class="server-price-right space-between-item flex-row">
							<view class="server-price-right-control flex-row-item" @click="qualityControl" :data-id="item.id">品控</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<!-- tabbar -->
		<view class="uni-tabbar space-around">
			<view class="uni-tabbar-item space-around-item">
				<image src="/static/images/manager/tab-index-select.png" v-if="active == 1"></image>
				<image src="/static/images/manager/tab-index.png" v-else></image>
				<view class="uni-tabbar-name">师傅服务</view>
			</view>
			<navigator url="/pages/manager/managerCenter/managerCenter" open-type="navigate" class="uni-tabbar-item uni-tabbar-center space-around-item">
				<image src="/static/images/manager/tab-center-select.png" v-if="active == 2"></image>
				<image src="/static/images/manager/tab-center.png" v-else></image>
				<view class="uni-tabbar-name">个人中心</view>
			</navigator>
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
			keywords: that.keywords,
			date: that.date,
		}
		//请求数据
		tools.httpClient('home/WxStore/pagingManagerOrderRecord', data, (error, res) => {
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
				
				console.log(list);
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
				active: 1,//导航
				keywords: '',//关键词
				date: '',//预约日期
				list: [],//列表
				no_content: false,//无内容是否显示
				is_control: 0,//是否品控页面返回
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰','manager_id':1};//uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//加载分页信息
			page = 1;
			allPages = 0;
			that.list = [];
			GetList(that, 0);
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰','manager_id':1};//uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//品控页面返回
			if(that.is_control == 1){
				//加载分页信息
				page = 1;
				allPages = 0;
				that.list = [];
				GetList(that, 0);
				//重置品控状态
				that.is_control = 0;
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
			
			//输入关键词
			keywordsInput:function(e){
				var that = this;
				var keywords = e.detail.value;
				that.keywords = keywords;
			},
			
			//搜索服务
			seachServer:function(e){
				var that = this;
				//重新加载分页信息
				page = 1;
				that.list = [];
				GetList(that, 0);
			},
			
			//选择日期
			addDateChange:function(e){
				var that = this;
				var date = e.detail.value;
				that.date = date;
				//重新加载分页信息
				page = 1;
				that.list = [];
				GetList(that, 0);
			},
			
			//品控
			qualityControl:function(e){
				var that = this;
				var rid = e.currentTarget.dataset.id;
				uni.navigateTo({
					url: '/pages/manager/qualityControl/qualityControl?rid='+rid
				})
			},
			
			//订单商品详情
			goodDetail:function(e){
				var gid = e.currentTarget.dataset.gid;
				if(gid){
					uni.navigateTo({
						url:'/pages/store/goodsDetail/goodsDetail?id='+gid
					})
				}
			},
			
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
