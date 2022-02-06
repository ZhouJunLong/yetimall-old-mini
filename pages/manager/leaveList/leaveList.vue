<template>
	<view class="wrap">
		<!-- 请假记录 -->
		<view class="leave-area" v-if="list.length > 0">
			<block v-for="(item, index) in list">
				<view class="leave-list">
					<view class="leave-top">
						<view class="time-area">
							<text :class="[item.type == 1?'iconfont icon-qingjia type-one':'iconfont icon-qingjia type-two']"></text>
							<text class="type-text" v-if="item.type == 1">请假</text>
							<text class="type-text" v-else-if="item.type == 2">调休</text>
							<text>{{item.add_time}}</text>
						</view>
						<view class="state-one" v-if="item.is_check == 0">待审核</view>
						<view class="state-two" v-else-if="item.is_check == 1">已通过</view>
						<view class="state-thd" v-else-if="item.is_check == 2">未通过</view>
					</view>
					<view class="leave-mid" v-if="item.type == 1">
						<view class="date-area">
							<view class="date-desc">请假日期:</view>
							<view class="date-one">{{item.date_one}}</view>
						</view>
						<view class="content-area">
							<view class="content-desc">请假理由:</view>
							<view class="content">{{item.content}}</view>
						</view>
					</view>
					<view class="leave-mid" v-else>
						<view class="date-area">
							<view class="date-desc">调休日期:</view>
							<view class="date-one">{{item.date_one}}</view>
							<view class="date-desc-two">原休息日期:</view>
							<view class="date-two">{{item.date_two}}</view>
						</view>
						<view class="content-area">
							<view class="content-desc">调休理由:</view>
							<view class="content">{{item.content}}</view>
						</view>
					</view>
					<view class="leave-bot"v-if="item.is_check == 2">
						<view class="reason-desc">原因:</view>
						<view class="reason">{{item.reason}}</view>
					</view>
				</view>
			</block>
		</view>
		<view class="leave-area" v-else>
			<view class="no-more">暂无数据</view>
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
			manager_id:userInfo.manager_id,
		}
		//请求数据
		tools.httpClient('home/WxStore/pagingManagerLeave', data, (error, res) => {
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
			
		}
	}
</script>

<style>
	@import url("./leaveList.css");
</style>
