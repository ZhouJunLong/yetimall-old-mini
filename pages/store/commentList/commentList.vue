<template>
	<view class="wrap">
		<view class="comment-area" v-if="list.length > 0">
			<block v-for="(item, index) in list">
				<view class="comment-list">
					<view class="comment-list-top">
						<view class="user-info">
							<image class="head-img" :src="item.head_img_url"></image>
							<view class="nick_name">{{item.nick_name}}</view>
						</view>
						<view class="score-area">
							<!-- <block v-for="(scoreitem, scoreindex) in (5-item.score)">
								<text class="iconfont icon-pingjia"></text>
							</block> -->
							<block v-for="(scoreitem, scoreindex) in (item.score)">
								<text class="iconfont icon-pingjia selected"></text>
							</block>
						</view>
					</view>
					<view class="comment-list-mid">{{item.content}}</view>
					<view class="comment-list-bot flex-row">
						<text class="comment-list-bot-time flex-row-item">{{item.add_time}}</text>
						<text class="comment-list-bot-specs flex-row-item" v-if="item.good_specs_name">| {{item.good_specs_name}}</text>
					</view>
				</view>
			</block>
		</view>
		<view v-else class="no-more">暂无数据</view>
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
		//data数据
		var data = {
			pageIndex: page,
			pageSize: pageSize,
			gid: that.gid,
			city_id: cityInfo.id?cityInfo.id:0,
		}
		//请求数据
		tools.httpClient('home/WxStore/pagingComment', data, (error, res) => {
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
				gid: 0,//商品id
				list: [],//列表
				no_content: false,//无内容是否显示
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰'};//uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//用户城市信息
			cityInfo = uni.getStorageSync('cityInfo');
			if(cityInfo){
				that.cityInfo = cityInfo;
			}
			
			//页面写到参数
			var gid = options.gid;
			that.gid = gid;
			
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
				tools.httpClient('home/WxStore/getUserInfo', {'user_id': userInfo.id}, (error, result) => {
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
	@import url("./commentList.css");
</style>
