<template>
	<view class="wrap">
		<!-- 顶部区域 -->
		<view class="top-area">
			<view class="top-info">
				<view :class="[type == 1?'top-list cur':'top-list']" @click="selectType" data-type="1">套餐服务</view>
				<view :class="[type == 2?'top-list cur':'top-list']" @click="selectType" data-type="2">单次服务</view>
				<view :class="[type == 4?'top-list cur':'top-list']" @click="selectType" data-type="4">包年服务</view>
			</view>
			<view class="record-btn" @click="recordList">服务记录</view>
		</view>
		<!-- 订单区域 -->
		<view class="order-area">
			<block v-for="(item, index) in list">
				<view class="order-list">
					<view class="order-top">
						<view class="order-num">提交时间：{{item.add_time}}</view>
						<view class="state">已付款</view>
					</view>
					<view class="order-mid">
						<view class="good-list"  @click="goodDetail" :data-gid="item.gid">
							<view class="good-img">
								<image mode="widthFix" :src="base_url+item.good_img"></image>
							</view>
							<view class="order-good">
								<view class="good-top">
									<view class="good-name">{{item.good_name}}</view>
									<view class="good-count">x{{item.good_count}}</view>
								</view>
								<view class="good-mid" v-if="item.type != 3">
									<view class="desc">
										<text>{{item.good_desc}}</text>
										<text style="padding-left:10rpx;">{{item.good_label==1?'日间':'夜间'}}</text>
									</view>
									<view class="person">服务人员：{{item.server_person}}人</view>
								</view>
								<view class="good-bot">￥{{item.good_price}}</view>
							</view>
						</view>
					</view>
					<view class="order-bot">
						<view class="order-desc">
							<text>共1项</text>
							<text class="unit">合计：</text>
							<text class="total_price">￥{{item.total_price}}</text>
						</view>
						<view class="btn-area" v-if="item.residue_num > 0 && item.is_top == 0">
							<view class="btn-list" @click="useServer" :data-id="item.id">预约服务</view>
						</view>
					</view>
				</view>
			</block>
			<view v-if="list.length == 0" class="no-more">暂无订单</view>
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
			state: 1,
			type: that.type,
			city_id: cityInfo.id?cityInfo.id:0,
		}
		//请求数据
		tools.httpClient('home/WxStore/pagingOrder', data, (error, res) => {
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
				cityInfo: [],//用户城市信息
				type: 1,//服务类型 1套餐服务 2单次服务 4包年服务
				list: [],//列表
				no_content: false,//无内容是否显示
				is_order: 0,//是否预约页面返回
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//用户城市信息
			cityInfo = uni.getStorageSync('cityInfo');
			if(cityInfo){
				that.cityInfo = cityInfo;
			}
			
			//加载分页信息
			page = 1;
			allPages = 0;
			that.list = [];
			GetList(that, 0);
		},
		onShow: function () {
		    var that = this;
			//预约页面返回
			if(that.is_order == 1){
				//加载分页信息
				page = 1;
				allPages = 0;
				that.list = [];
				GetList(that, 0);
				//重置修改状态
				that.is_order = 0;
			}
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
				})
			},
			
			//切换类型
			selectType:function(e){
				var that = this;
				var type = e.currentTarget.dataset.type;
				that.type = type;
				//重新加载分页信息
				page = 1;
				that.list = [];
				GetList(that, 0);
			},
			
			//服务记录
			recordList:function(){
				var that = this;
				uni.navigateTo({
					url:'/pages/userCenter/recordList/recordList'
				})
			},
			
			//预约服务
			useServer:function(e){
				var that = this;
				var id = e.currentTarget.dataset.id;
				if(id){
					uni.navigateTo({
						url:'/pages/userCenter/orderRecord/orderRecord?oid='+id
					})
				}
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
	@import url("./myServer.css");
</style>
