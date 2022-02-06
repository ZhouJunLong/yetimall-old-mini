<template>
	<view class="wrap">
		<!-- 登录区域 -->
		<view class="main-area">
			<view class="top-area">
				<image :src="login_bg_png" class="top-img" mode="widthFix"></image>
				<view class="top-info">
					<view class="title-one">客户经理端</view>
					<view class="title-two">安徽勤家速达科技</view>
				</view>
			</view>
			<!-- 账号密码 -->
			<view class="login-area">
				<view class="input-area">
					<text class="iconfont icon-gerenzhongxin"></text>
					<input type="text" class="inp" placeholder="请输入账号" placeholder-style="font-size:13px;color:#C1CFDA" @input="getAccount"/>
				</view>
				<view class="input-area">
					<text class="iconfont icon-yanzhengma"></text>
					<input type="password" class="inp" placeholder="请输入密码" placeholder-style="font-size:13px;color:#C1CFDA" @input="getPassword"/>
				</view>
			</view>
			<!-- 提交 -->
			<view class="btn-area">
				<view class="submit" @click="submit">登录</view>
			</view>
			<view class="copy-right">安徽勤家速达科技有限公司 版权所有</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var did = 0;
	var is_click = true;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				login_bg_png: base_url+'bg/login_bg.png',//登录图片
				account: '',//账号
				password: '',//密码
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰'};//uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰'};//uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
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
			
			//获取账号
			getAccount:function(e){
				var that = this;
				that.account = e.detail.value;
			},
			
			//获取密码
			getPassword:function(e){
				var that = this;
				that.password = e.detail.value;
			},
				
			//提交
			submit:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					//return false;
				}
				var data = {
					user_id: userInfo.id,
					account: that.account,
					password: that.password,
				};
				uni.showLoading({
					title:'加载中'
				})
				if(is_click){
					is_click = false;
					tools.httpClient('home/WxStore/managerLogin', data, (err, res) => {
						uni.hideLoading();
						if (res.errorCode == 0) {
							is_click = true;
							uni.setStorageSync("userInfo",res.data);
							uni.showToast({
								title:'登录成功',
								icon:'success',
								success:function(){
									setTimeout(function(){
										uni.redirectTo({
											url:'/pages/manager/index/index'
										});
									},1500)
								}
							})
						}
						else{
							is_click = true;
							uni.showToast({
								title:res.errorInfo,
								icon:'none',
								duration:1500
							})
						}
					})
				}
			},
			
			
		}
	}
</script>

<style>
	@import url("./login.css");
</style>
