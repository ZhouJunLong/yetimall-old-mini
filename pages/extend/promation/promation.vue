<template>
	<view class="wrap">
		<image class="promation_img" mode="widthFix" :src="base_url+promation_img"></image>
		<view class="btn-area" v-if="promation_img">
			<!-- <button class="share share-button" type="share">立即分享</button> -->
			<view class="share" @click="save">立即分享</view>
			<!-- <view class="share save" @click="save">保存图片</view> -->
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var did = 0;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				promation_img: '',//海报图
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//生成海报	
			that.createPromation();
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		//分享（小程序）
		onShareAppMessage(res) {
			var that = this;
			if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			}
			return {
			  title: '勤家速达',
			  path: '/pages/index/index?user_id='+serInfo.id
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
			
			//生成海报
			createPromation:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				};
				uni.showLoading({
					title:'加载中',
					mask:true
				})
				var data = {
					user_id:userInfo.id?userInfo.id:0
				};
				tools.httpClient('home/WxStore/createPromation',data, (error, res) => {
					uni.hideLoading();
					if (res.errorCode == 0) {
						that.promation_img = res.data;
					}
				})
			},
				
			//保存（小程序）
			save:function(){
				var that = this;
				uni.getImageInfo({
					src:base_url + that.promation_img,
					success:function(res){
						uni.saveImageToPhotosAlbum({
							filePath:res.path,
							success:function(){
								uni.showToast({
									title:'保存成功',
									icon:'success',
									duration:1500
								})
							}
						})
					}
				})
			},
			
		}
	}
	
</script>

<style>
	@import url("./promation.css");
</style>
