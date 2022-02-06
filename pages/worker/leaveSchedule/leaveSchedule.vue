<template>
	<view class="wrap">
		<view v-for="(item,index) in list" :key="item.id">
			<view class="box">
				<view class="header">
					<view v-if="item.type == 1">
						<view class="left"><text :class="[item.type == 1 ? 'iconfont  icon-qingjia  cur':'iconfont  icon-qingjia']"></text>请假 {{item.add_time}}</view>
					</view>
					<view v-if="item.type == 2">
						<view class="left"><text :class="[item.type == 2 ? 'iconfont  icon-qingjia  on':'iconfont  icon-qingjia']"></text>调休 {{item.add_time}}</view>
					</view>
					<view v-if="item.is_check == 0">
						<view :class="[item.is_check == 0 ? 'right  in':'right']">待审核</view>
					</view>
					<view v-if="item.is_check == 1">
						<view :class="[item.is_check == 1 ? 'right  cur':'right']">通过</view>
					</view>
					<view v-if="item.is_check == 2">
						<view :class="[item.is_check == 2 ? 'right  no':'right']">未通过</view>
					</view>
					
				</view>
				<view class="center">
					<block v-if="item.type == 2">
						<view class="date">
							<view class="left">休假日期：{{item.date_one}}</view>
							<view class="right">原休息日期：{{item.date_two}}</view>
						</view>
					</block>
					<block v-if="item.type == 1">
						<view class="date">请假日期：{{item.date_one}}</view>
					</block>
					<view class="reason-area">
						<view class="title">请假理由：</view>
						<view class="reason">{{item.content}}</view>
					</view>
					<view v-if="item.is_check == 2">
						<view class="failed-area">
							<view class="title">原因：</view>
							<view class="reason">{{item.reason}}</view>
						</view>
					</view>
				</view>
			</view>
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
	
	//页面初始化数据
	var pagingLeave = function(that) {
		var cData = {
			pageIndex:page,
			pageSize:pageSize,
			worker_id:userInfo.worker_id
		};
		uni.showLoading({
			title:'加载中'
		});
		tools.httpClient('home/WxStore/pagingLeave',cData, (error, data) => {
			uni.hideLoading();
			bStop = true;
			var res = data;
			var data = data.data;
			var list = that.list;
			//console.log('结果集', list);
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
				data_one:'',
				date_two:'',
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取分页信息
			page = 1;
			that.list = [];
			pagingLeave(that);
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
				let state = e.currentTarget.dataset.state;
				page = 1;
				that.list = [];
				that.state = state;
				pagingLeave(that);
			},
		}
	}
</script>

<style>
	@import url("./leaveSchedule.css");
	@import url("/app.css");
</style>
