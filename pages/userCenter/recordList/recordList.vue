<template>
	<view class="wrap">
		<view class="order-area">
			<!-- 订单 -->
			<block v-for="(item, index) in list">
				<view class="order-list">
					<view class="order-top">
						<view class="order-num">提交时间: {{item.add_time}}</view>
						<view class="state" v-if="item.state == 0">预约中</view>
						<view class="state" v-else-if="item.state == 1">已接单</view>
						<view class="state" v-else-if="item.state == 2">进行中</view>
						<view class="state" v-else-if="item.state == 3">已完成</view>
					</view>
					<view class="order-mid">
						<view class="order-desc">预约服务时间: {{item.order_time}}</view>
						<view class="count">使用次数: {{item.use_count}}次</view>
						<view>服务师傅: {{item.worker_name?item.worker_name:'无'}}</view>
					</view>
					<view class="order-bot">
						<view class="order-desc">
							<text v-if="item.state == 2">服务结束时间: {{item.end_time}}</text>
						</view>
						<view class="btn-area">
							<view class="btn-list" v-if="item.state == 0 && item.is_over == 1" @click="editRecord" :data-index="index">改约</view>
							<view class="btn-list-two" v-if="item.state==0 && item.is_over ==0" @click="editRecord" :data-index="index">改约</view>
						</view>
					</view>
				</view>
			</block>
			<view v-if="list.length == 0" class="no-more">暂无记录</view>
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
			city_id: cityInfo.id?cityInfo.id:0,
		}
		//请求数据
		tools.httpClient('home/WxStore/pagingOrderRecordTwo', data, (error, res) => {
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
				list: [],//列表
				no_content: false,//无内容是否显示
				is_update: 0,//是否改约页面返回
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
			//改约页面返回
			if(that.is_update == 1){
				//加载分页信息
				page = 1;
				allPages = 0;
				that.list = [];
				GetList(that, 0);
				//重置修改状态
				that.is_update = 0;
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
			
			//订单改约
			editRecord:function(e){
				let that = this;
				let index = e.currentTarget.dataset.index;
				let list = that.list;
				if(list[index].is_over == 1){ //超过24h
					let id = list[index].id;
					uni.navigateTo({
						url:'/pages/userCenter/editRecord/editRecord?id='+id
					})
				}
				else if(list[index].is_over==0){  //不超过24小时
					uni.showModal({
						title:'提示',
						content:'订单改约时间少于24小时，需支付误工费，请联系客服人员进行改约',
						cancelColor:"#999999",
						confirmText:"继续改约",
						confirmColor:"#0079FF",
						success:function(res){
							
						}
					})
				}
			},
			
		}
	}
</script>

<style>
	@import url("./recordList.css");
</style>
