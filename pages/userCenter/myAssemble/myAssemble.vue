<template>
	<view class="wrap">
		<!-- 顶部区域 -->
		<block v-if="type == 1">
			<view class="top-area">
				<view class="top-info">
					<view :class="[is_success == 99?'top-list top-list-one cur':'top-list top-list-one']" data-success="99" @click="selectSuccess">全部</view>
					<view :class="[is_success == 0?'top-list top-list-two cur':'top-list top-list-two']" data-success="0" @click="selectSuccess">进行中</view>
					<view :class="[is_success == 1?'top-list top-list-three cur':'top-list top-list-three']" data-success="1" @click="selectSuccess">已拼成</view>
				</view>
			</view>
		</block>
		<block v-else-if="type == 3">
			<view class="top-area">
				<view class="top-info">
					<view :class="[state == -1?'top-list cur':'top-list']" data-state="-1" @click="selectState">全部</view>
					<view :class="[state == 0?'top-list cur':'top-list']" data-state="0" @click="selectState">待付款</view>
					<view :class="[state == 1?'top-list cur':'top-list']" data-state="1" @click="selectState">已付款</view>
					<view :class="[state == 2?'top-list cur':'top-list']" data-state="2" @click="selectState">拼团成功</view>
				</view>
			</view>
		</block>
		<!-- 订单区域 -->
		<view class="order-area">
			<block v-for="(item, index) in list">
				<view class="order-list">
					<view class="order-top">
						<block v-if="type == 1">
							<view class="order-num">拼团ID: {{item.id}}</view>
							<view class="order-state" v-if="item.is_success == 0">进行中</view>
							<view class="order-state order-state-success" v-else-if="item.is_success == 1">已拼成</view>
							<view class="order-state" v-else-if="item.is_success == -1">拼单失败</view>
						</block>
						<block v-else-if="type == 2">
							<view class="order-num">拼团时间: {{item.add_time}}</view>
							<view class="order-state" v-if="item.state == 1">已付款</view>
							<view class="order-state order-state-success" v-else-if="item.state == 2">拼团成功</view>
						</block>
						<block v-else-if="type == 3">
							<view class="order-num">下单时间: {{item.add_time}}</view>
							<view class="order-state" v-if="item.state == 0">待付款</view>
							<view class="order-state" v-else-if="item.state == 1">已付款</view>
							<view class="order-state order-state-success" v-else-if="item.state == 2">拼团成功</view>
						</block>
					</view>
					<view class="order-mid">
						<view class="good-list" @click="goodDetail" :data-gid="item.gid">
							<view class="good-img">
								<image mode="widthFix" :src="base_url+item.good_img"></image>
							</view>
							<view class="order-good">
								<view class="good-top">
									<view class="good-name">{{item.good_name}}</view>
									<view class="good-count">x{{item.good_count}}</view>
								</view>
								<block v-if="type == 1">
									<view class="good-mid">团长：{{item.name}}</view>
									<view class="good-bot space-between">
										<view class="good-bot-have space-between-item">已有{{item.open_num-item.residue_num}}人参团</view>
										<view class="good-bot-need space-between-item">需2人拼团</view>
									</view>
								</block>
								<block v-else>
									<view class="good-mid">
										<view class="desc">
											<text>{{item.good_desc}}</text>
											<text style="padding-left:10rpx;">{{item.good_label==1?'日间':'夜间'}}</text>
										</view>
										<view class="person">服务人员：{{item.server_person}}人</view>
									</view>
									<view class="good-bot">￥{{item.good_price}}</view>
								</block>
							</view>
						</view>
					</view>
					<block v-if="type == 1 || type == 2">
						<view class="order-bot">
							<view class="order-desc" >
								<block v-if="item['orderList'].length > 0">
									<block v-for="(imageitem, imageindex) in 3">
										<image :src="item['orderList'][imageindex]['head_img_url']" class="head-img" v-if="item['orderList'][imageindex]"></image>
									</block>
								</block>
								<text class="iconfont icon-gengduo-a" @click="groupInfo" :data-id="item.group_id"></text>
							</view>
							<view class="btn-area" v-if="item.is_success == 0">
								<view class="btn-list" @click="groupInfo" :data-id="item.group_id">邀请好友</view>
							</view>
						</view>
					</block>
					<block v-else-if="type == 3">
						<view class="order-bot">
							<view class="state"></view>
							<view class="btn-area" v-if="item.state == 0">
								<view class="btn-list" @click="payOrder" :data-id="item.id">去付款</view>
							</view>
						</view>
					</block>
				</view>
			</block>
			<view class="no-more" v-if="list.length == 0">暂无订单</view>
		</view>
		<!-- 底部栏 -->
		<view class="bottom-area">
			<view class="bottom-area-content flex-row">
				<view :class="[type == 1?'bottom-area-item flex-row-item cur':'bottom-area-item flex-row-item']" data-type="1" @click="selectType">
					<view class="bottom-area-item-one">
						<view class="iconfont icon-fabu2 bottom-area-item-icon"></view>
						<view class="bottom-area-item-name">我发起的</view>
					</view>
				</view>
				<view :class="[type == 2?'bottom-area-item flex-row-item cur':'bottom-area-item flex-row-item']" data-type="2" @click="selectType">
					<view class="iconfont icon-tuandui1 bottom-area-item-icon"></view>
					<view class="bottom-area-item-name">我参与的</view>
				</view>
				<view :class="[type == 3?'bottom-area-item flex-row-item cur':'bottom-area-item flex-row-item']" data-type="3" @click="selectType">
					<view class="bottom-area-item-three">
						<view class="iconfont icon-shangchengxuanzhong bottom-area-item-icon"></view>
						<view class="bottom-area-item-name">我的拼团</view>
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
	var cityInfo = "";
	var did = 0;
	var is_click = true;
	
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
			type: that.type,
			is_success: that.is_success,
			state: that.state,
			city_id: cityInfo.id?cityInfo.id:0,
		}
		//请求数据
		tools.httpClient('home/WxStore/pagingAssembleOrder', data, (error, res) => {
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
				type: 1,//类型 1我发起的 2我参与的 3我的拼团
				is_success: 99,//拼团状态 0进行中 1已拼成 99全部
				state: -1,//订单状态 -1全部 0待付款 1已付款 2已拼成
				list: [],//列表
				no_content: false,//无内容是否显示
			}
		},
		onLoad(options) {
			var that = this;
			
			//页面携带参数
			if(options.state){
				that.state = options.state;
			}
			
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
			
			//切换拼团状态
			selectSuccess:function(e){
				var that = this;
				var is_success = e.currentTarget.dataset.success;
				that.is_success = is_success;
				
				//重新加载分页信息
				page = 1;
				that.list = [];
				GetList(that, 0);
			},
			
			//切换订单状态
			selectState:function(e){
				var that = this;
				var state = e.currentTarget.dataset.state;
				that.state = state;
				
				//重新加载分页信息
				page = 1;
				that.list = [];
				GetList(that, 0);
			},
			
			//邀请好友
			groupInfo:function(e){
				var that = this;
				var group_id = e.currentTarget.dataset.id;
				if(group_id){
					uni.navigateTo({
						url:'/pages/assemble/groupInfo/groupInfo?group_id='+group_id
					})
				}
			},
			
			//立即付款
			payOrder:function(e){
				var that = this;
				var oid = e.currentTarget.dataset.id;
				uni.request({
					url: base_url + '../extend/pay/request/WxAssemblePay.php',
					data: {'oid':oid,'pay_type':1},
					method: 'GET', 
					success: function (res) {
						uni.requestPayment({
							'timeStamp': res.data.timeStamp,
							'nonceStr': res.data.nonceStr,
							'package': res.data.package,
							'signType': 'MD5',
							'paySign': res.data.paySign,
							'success': function (res) {
								uni.showToast({
									title: '支付成功',
									icon: 'success',
									success: function () {
										//重新加载分页信息
										page = 1;
										that.list = [];
										GetList(that, 0);
									}
								})
							}
						})
					}
				})
			},
			
			//订单商品详情
			goodDetail:function(e){
				var that = this;
				var gid = e.currentTarget.dataset.gid;
				if(gid){
					uni.navigateTo({
						url:'/pages/assemble/goodDetail/goodDetail?id='+gid
					})
				}
			},
			
			
		}
	}
</script>

<style>
	@import url("./myAssemble.css");
</style>
