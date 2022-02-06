<template>
	<view class="wrap">
		<view class="like-list">
			<block v-for="item in likeList">
				<view class="like-item" @click="goodsDetail(item.id)">
					<view class="like-item-left"><image :src="base_url + item.img_url"></image></view>
					<view class="like-item-right">
						<view class="goods-brief">{{item.simple_desc}}</view>
						<view class="price">
							<text class="unit">￥</text>
							<text class="num">{{item.price}}</text>
						</view>
					</view>
				</view>
			</block>
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
				likeList: [],//收藏列表
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
			that.userInfo = uni.getStorageSync("userInfo");
	
			//获取用户信息
			// that.getUserInfo();

			//获取收藏列表
			that.getlikeList(that.userInfo.id);
	
			//分享朋友圈（小程序）
			// uni.showShareMenu({
			// 	withShareTicket: true,
			// 	menus: ['shareAppMessage', 'shareTimeline']
			// });
		},
		onShow() {
			var that = this;
	
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");
	
			//获取用户信息
			// that.getUserInfo();
		},
		//分享好友（小程序）
		// onShareAppMessage(res) {
		// 	var that = this;
		//     if (res.from === 'button') {// 来自页面内分享按钮
		// 		//console.log(res.target)
		//     }
		// 	var title = "三王贸易";
		// 	var user_id = userInfo.id;
		//     return {
		// 		title: title,
		// 		path: '/pages/index/index?user_id='+user_id
		//     }
		// },
		//分享朋友圈（小程序）
		// onShareTimeline: function () {
		//     var that = this;
		// 	var title = "三王贸易";
		//     var user_id = userInfo.id;
		//     return {
		// 		title: title,
		// 		query: {
		// 			'user_id': user_id
		// 		}
		//     }
		// },
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
			//获取收藏列表
			getlikeList: function(uid) {
				var that = this;
				tools.httpClient('home/WxStore/getWechatlikeList', {uid:uid}, (error, result) => {
					console.log(result);
					if (result.errorCode == 0) {
						var likeList = result.data.goodsList;
						that.likeList = likeList;
						console.log(that.likeList);
					}
				});
			},
			//商品详情
			goodsDetail: function(id) {
				if(id){
					uni.navigateTo({
						url: '/pages/store/goodsDetail/goodsDetail?gid=' + id
					})
				}
			},
		}
	}
</script>

<style>
	@import url("./likeList.css");
</style>
