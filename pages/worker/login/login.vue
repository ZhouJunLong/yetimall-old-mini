<template>
	<view class="main-area">
		<view class="top-area">
			<image :src="img" class="top-img" mode="widthFix"></image>
			<view class="top-info">
				<view class="title-one">师傅端</view>
				<view class="title-two">安徽勤家速达科技</view>
			</view>
		</view>
		<!-- 账号密码 -->
		<view class="login-area">
			<view class="input-area">
				<text class="iconfont icon-gerenzhongxin"></text>
				<input type="text" class="inp" placeholder="请输入账号" placeholder-style="font-size:13px;color:#C1CFDA" @input="getAccount" :value="account"/>
			</view>
			<view class="input-area">
				<text class="iconfont icon-yanzhengma"></text>
				<input type="password" class="inp" placeholder="请输入密码" placeholder-style="font-size:13px;color:#C1CFDA" @input="getPassword" :value="password"/>
			</view>
		</view>
		<!-- 提交 -->
		<view class="btn-area">
			<view class="submit" @click="submit">登录</view>
		</view>
		
		<view class="copy-right">安徽勤家速达科技有限公司 版权所有</view>
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
				img:base_url+'bg/login_bg.png',
				account:'',
				password:'',
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		onShow() {
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
				this.account=e.detail.value
			},
			
			//获取密码
			getPassword:function(e){
				this.password=e.detail.value
			},
			
			//提交
			submit:function(e){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				var account = that.account;
				var password = that.password;
				var data = {
					user_id:userInfo.id,
					account:account,
					password:password,
				};
				tools.httpClient('home/WxStore/login', data, (err, res) => {
					uni.hideLoading();
					if (res.errorCode == 0) {
						uni.showToast({
							title:'登录成功',
							icon:'success',
							success:function(){
								uni.redirectTo({
									url:'/pages/worker/index/index'
								});
							}
						})
					}
					else{
						uni.showToast({
							title:res.errorInfo,
							icon:'none',
							duration:1500
						})
					}
				});
				
			}
		}
	}

</script>

<style>
	@import url("./login.css");
	@import url("/app.css");
</style>
