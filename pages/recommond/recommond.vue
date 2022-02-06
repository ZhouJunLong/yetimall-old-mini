<template>
	<view class="wrap">
		<view class="recommond-list">
			<view class="left-area">
				<block v-for="(item,index) in recommondList">
					<view class="recommond-item" v-bind:class="[index%4==3 || index%4==0 ? 'recommond-item-type1' : 'recommond-item-type2']" @click="recommondDetail(item.id)" v-if="index%2 == 0">
						<image :src="base_url + item.img_url" mode="widthFix"></image>
						<view class="tilte">
							<text>{{item.title}}</text>
						</view>
						<view class="text-info">
							<!-- <text>{{item.author}}</text> -->
							<view class="recommond-item-left">
								<image src="/static/images/recommend_head.png"></image>
								<text>Leoooo37</text>
							</view>
							<view class="recommond-item-right">
								<i class="iconfont icon-dianzan"></i>
								<text class="point">{{item.points}}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
				<view class="right-area">
					<block v-for="(item,index) in recommondList">
					<view class="recommond-item" v-bind:class="[index%4==3 || index%4==0 ? 'recommond-item-type1' : 'recommond-item-type2']" @click="recommondDetail(item.id)" v-if="index%2 != 0">
						<image :src="base_url + item.img_url" mode="widthFix"></image>
						<view class="tilte">
							<text>{{item.title}}</text>
						</view>
						<view class="text-info">
							<!-- <text>{{item.author}}</text> -->
							<text><image src="../../static/images/recommend_head.png"></image>Leoooo37</text>
							<text class="point"><i class="iconfont icon-dianzan"></i>{{item.points}}</text>
						</view>
					</view>
					</block>
				</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../common/config.js';
	import tools from '../../common/tools.js';
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var cityInfo = "";
	var did = 0;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityList: [],//城市列表
				cityInfo: [],//用户城市信息
				slideList: [],//轮播图列表
				cateList: [],//分类列表
				assemble_png: base_url+'bg/assemble.png',
				more:'static/images/MORE.png',
				recommondList: [],//推荐商品列表
				tagList: [],//tag列表
				logo_png: base_url+'bg/logo.png',
				city_show: false,//是否显示城市选择
			}
		},
		onLoad(options) {
			var that = this;
	
			//判断用户是否通过推广而来
			if (options.user_id) {
				did = options.user_id;
				uni.setStorageSync("did", did);
			}
	
			//用户缓存信息
			// userInfo = uni.getStorageSync("userInfo");
	
			//获取用户信息
			// that.getUserInfo();
			
			that.getrecommondList();
			
			//分享朋友圈（小程序）
			// uni.showShareMenu({
			// 	withShareTicket: true,
			// 	menus: ['shareAppMessage', 'shareTimeline']
			// });
		},
		onShow() {
			var that = this;
	
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			that.getrecommondList();
			//获取用户信息
			// that.getUserInfo();
		},
		//分享好友（小程序）
		onShareAppMessage(res) {
			var that = this;
		    if (res.from === 'button') {// 来自页面内分享按钮
				//console.log(res.target)
		    }
			var title = "三王贸易";
			var user_id = userInfo.id;
		    return {
				title: title,
				path: '/pages/index/index?user_id='+user_id
		    }
		},
		//分享朋友圈（小程序）
		onShareTimeline: function () {
		    var that = this;
			var title = "三王贸易";
		    var user_id = userInfo.id;
		    return {
				title: title,
				query: {
					'user_id': user_id
				}
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
			//获取推荐列表
			getrecommondList: function() {
				var that = this;
				tools.httpClient('home/WxStore/getWechatrecommondList', {}, (error, result) => {
					console.log(result);
					if (result.errorCode == 0) {
						var recommondData = result.data;
						that.recommondList = recommondData;
					}
				});
			},
			//推荐详情
			recommondDetail: function(id) {
				if(id){
					uni.navigateTo({
						url: '/pages/recommond/recommondDetail?tid=' + id
					})
				}
			},
		}
	}
	
</script>

<style>
		@import url("./recommond.css");
</style>
