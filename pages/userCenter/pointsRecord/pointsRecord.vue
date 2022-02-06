<template>
	<view class="wrap">
		<!-- 总积分 -->
		<view class="total-area">
			<view class="total-info">
				<view class="total-desc">总积分</view>
				<view class="total-fee">{{userInfo.points}}</view>
			</view>
		</view>
		<!-- 类型 -->
		<view class="tab-area">
			<view :class="[cur == 1?'tab-list cur':'tab-list']" @click="showCont" data-cur="1">获得积分</view>
			<view :class="[cur == 2?'tab-list cur':'tab-list']" @click="showCont" data-cur="2">积分抵扣</view>
		</view>
		<!-- 积分记录 -->
		<view class="main-area">
			<block v-if="list.length > 0">
				<block v-for="(item, index) in list">
					<view class="record-list">
						<view class="record-top">
							<view class="record-type" v-if="item.type < 5">{{item.orderInfo.good_name}}</view>
							<view class="record-type" v-else>{{item.remark?item.remark:'---'}}</view>
							<view class="record-money" v-if="cur == 1">+{{item.points}}</view>
							<view class="record-money-two" v-else>-{{item.points}}</view>
						</view>
						<view class="time">{{item.add_time}}</view>
					</view>
				</block>
			</block>
			<block v-else>
				<view class="no-more">暂无记录</view>
			</block>
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
			type: that.type,
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
				cur: 1,//积分选中标识 1获得积分 2积分抵扣
				type: "1,2,4,5",//积分类型
				list: [],//列表
				no_content: false,//无内容是否显示
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
			
			//切换类型
			showCont: function(e) {
				var that = this;
				var cur = e.currentTarget.dataset.cur;
				if(cur == 1){//1获得积分
					var type = "1,2,4,5";
				}else if(cur == 2){//2积分抵扣
					var type = "3,6";
				}
				that.cur = cur;
				that.type = type;
				
				//重新加载分页信息
				page = 1;
				that.list = [];
				GetList(that, 0);
			},
			
		}
	}
</script>

<style>
	@import url("./pointsRecord.css");
</style>
