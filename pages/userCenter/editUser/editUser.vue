<template>
	<view class="wrap">
		<view class="main-area">
			<view class="input-area">
				<view>头像</view>
				<view class="input-list">
					<image class="head-img" :src="head_img_url"></image>
					<!-- <text class="iconfont icon-you"></text> -->
				</view>
			</view>
			<view class="input-area">
				<view>昵称</view>
				<view class="input-list">
					<view class="inp">{{nick_name}}</view>
					<!-- <text class="iconfont icon-you"></text> -->
				</view>
			</view>
			<view class="input-area">
				<view>姓名</view>
				<view class="input-list">
					<input type="text" class="inp" placeholder="请输入姓名" @input="getInfo" data-type="name" :value="name"></input>
					<text class="iconfont icon-you"></text>
				</view>
			</view>
			<view class="input-area">
				<view>手机号</view>
				<view class="input-list">
					<input type="number" class="inp" placeholder="请输入手机号" @input="getInfo" data-type="phone" :value="phone"></input>
					<text class="iconfont icon-you"></text>
				</view>
			</view>
			<!-- 保存 -->
			<view class="btn-area">
				<view class="submit" @click="submit">保存</view>
			</view>
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
				head_img_url: '',//用户头像
				nick_name: '',//用户昵称
				name: '',//用户姓名
				phone: '',//用户手机号
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		methods: {
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo',{'user_id':userInfo.id}, (error, res) => {
					if (res.errorCode == 0) {
						var userData = res.data;
						userInfo = userData;
						that.userInfo = userData;
						that.head_img_url = userData.head_img_url;
						that.nick_name = userData.nick_name;
						that.name = userData.name;
						that.phone = userData.phone;
					}
				})
			},
			
			//获取输入信息
			getInfo:function(e){
				var that = this;
				var type = e.currentTarget.dataset.type;
				var value = e.detail.value;
				if(type == "name"){
					that.name = value;
				}else if(type == "phone"){
					that.phone = value;
				}
			},
			
			//保存
			submit:function(){
				var that = this;
				var data = {
					user_id: userInfo.id,
					name: that.name,
					phone: that.phone,
				};
				uni.showLoading({
					title:'加载中'
				})
				tools.httpClient('home/WxStore/updateUser', data, (err, res) => {
					uni.hideLoading();
					if (res.errorCode == 0) {
						uni.showToast({
							title:'保存成功',
							icon:'success',
							success:function(){
								setTimeout(function(){
									uni.navigateBack();
								},1000)
							}
						})
					}else{
						uni.showModal({
							title: '提示',
							content: res.data.errorInfo,
							showCancel: false,
							confirmText: '确定',
							confirmColor: '#3056d1',
							success: function (res) {
								if (res.confirm) {} 
								else if (res.cancel) {}
							}
						})
					}
				});
			}
			
		}
	}	
</script>

<style>
	@import url("./editUser.css");
</style>
