<template>
	<view class="wrap">
	  <view class="login-image">
	    <image mode="widthFix" src="/static/images/weixin_logo.png" />
	  </view>
	  <view class="login-info">
	    <view class="login-title">微信授权登录</view>
	    <view class="login-tip">本小程序需要您授权登录才能使用相关功能</view>
	  </view>
	  <view class="login-btn">
	    <button @click="getUserProfile">登录</button>
	  </view>
	</view>
</template>

<script>
	import CONFIG from '../../common/config.js';
	import tools from '../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var canClick = 1;
	
	export default {
		data() {
			return {
				
			}
		},
		onLoad(options) {
			var that = this;
		},
		methods: {
			//登录
			getUserProfile() {
				//判断用户是否授权
				var userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					canClick = 0;
				} else {
					canClick = 1;
				}
				if (canClick == 1) {
					canClick = 0;
					var did = uni.getStorageSync("did");
					uni.getUserProfile({
						desc: '用于获取用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
						success: function(res) {
							// console.log(res);
							var userInfo = res.userInfo;//用户信息对象
							var rawData = res.rawData;//不包括敏感信息的原始数据字符串
							var signature = res.signature;//使用 sha1( rawData + sessionkey ) 得到字符串
							var encryptedData = res.encryptedData;//包括敏感数据在内的完整用户信息的加密数据
							var iv = res.iv; //加密算法的初始向量
							// 调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid） 及本次登录的 
							// 会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。
							// 注：调用 login 会引起登录态的刷新，之前的 sessionKey 可能会失效。
							uni.login({
								success: function(res) {
									if (res.code) {
										var code = res.code;
										// console.log(code);
										uni.request({
											url: base_url + 'home/WxStore/wxLogin',
											data: {
												js_code: code
											},
											method: 'GET',
											success: function(res) {
												var code2Session = res.data;
												// console.log(JSON.stringify(code2Session));
												var sendData = {
												  code2Session: JSON.stringify(code2Session),
												  userInfo: JSON.stringify(userInfo),
												}
												if (did) {
												  sendData.did = did;
												}
												uni.request({
													url: base_url + 'home/WxStore/decryptUserInfo',
													data: sendData,
													method: 'GET', // OPTIONS, GET, HEAD, POST
													header: {
														'content-type': 'application/json'
													}, // 设置请求的 header
													success: function(result) {
														console.log(result.data);
														if (result.data) {
															var ws = result.data;
															uni.setStorageSync("userInfo",result.data);
															uni.navigateBack({})
														}
													}
												})
											}
										})
									} else {
										console.log('获取用户登录态失败！' + res.errMsg)
									}
								}
							})
						},
					})
				} else {
					uni.navigateBack();
				}
			},
			
			
		}
	}
</script>

<style>
	@import url("./wxlogin.css");
</style>
