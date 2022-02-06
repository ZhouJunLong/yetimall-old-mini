<template>
	<view class="warp">
		<image class="back-img" src="../../../static/images/login_back.png"></image>
		<view class="phone">
			<text class="title">完善用户信息，体验更多优享功能。</text>
			<!-- <input type="text" class="account" @input="getAccount" :value="userInfo.nickName" placeholder="请填写用户名"/> -->
			<!-- <input type="password" @input="getPassword" placeholder="请填写密码"/> -->
			<!-- <input type="password" @input="getCheckpass" placeholder="确认密码"/> -->
			<input class="phone_input" type="text" @input="getPhone" placeholder="请填写手机号"/>
			<view class="code">
				<view class="input-code">
					<input class="" type="text" v-if="language == 2" placeholder="인증번호" v-model="code" placeholder-class="input-place"/>
					<input type="text" v-else placeholder="验证码" v-model="code" placeholder-class="input-place"/>
				</view>
				<view class="getcode" @click="sendCode">
					<text v-if="language == 2">획득인증번호</text>
					<text v-else>获取验证码</text>
				</view>
			</view>
			<text class="submit" @click="addUser">提交</text>
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
				configInfo:'',
				phone:'',
				account:'',
				password:'',
				checkpass:'',
				code:'',//输入的验证码
				icode:'',//获取的验证码
				iphone:'',//获取验证码的手机号
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");//{'id':1,'nick_name':'李易峰'};//
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");//{'id':1,'nick_name':'李易峰'};//
		
		},
		methods: {
			//获取配置信息
			getConfigInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getConfigInfo', {}, (error, res) => {
					if (res.errorCode == 0) {
						that.configInfo = res.data;
					}
				})
			},
			getPhone:function(e){
				var that = this;
				that.phone = e.detail.value;
			},
			getPassword:function(e){
				var that = this;
				that.password = e.detail.value;
			},
			getCheckpass:function(e){
				var that = this;
				that.checkpass = e.detail.value;
			},
			getAccount:function(e){
				var that = this;
				that.account = e.detail.value;
			},
			sendCode:function(){
				var that = this;
				var phone = that.phone;
				if(phone == null || phone == '' || phone == undefined){
					uni.showModal({
						title:'提示',
						content:'请输入手机号',
						mask:true
					})
					return false;
				}
				uni.showLoading({
					title:'获取中。。。'
				})
				tools.httpClient('home/WxStore/sendPhoneVerifyNumber', {'phone':phone}, (error, result) => {
					uni.hideLoading();
					console.log(result);
					if (result.errorCode == 0) {
						uni.showToast({
							title:'获取成功'
						})
						that.icode = result.data;
						that.iphone = result.phone;
					}
				})
			},
			//个人信息
			addUser: function() {
				var that = this;
				var userInfo = that.userInfo;
				var phone = that.phone;
				if(that.password == that.checkpass){
					
				}else{
					uni.showToast({
						title:'两次输入密码不一致!',
						icon:'none'
					})
					return false;
				}
				if(phone == null || phone == '' || phone == undefined){
					uni.showToast({
						title:'请输入手机号',
						icon:'none'
					})
					return false;
				}else{
					// console.log(!RegExp(/^1[34578]\d{9}$/).test(phone));
					// return false;
					if(phone.length != 11){
						uni.showToast({
							title:'请输入正确的手机号',
							icon:'none'
						})
						return false;
					}
				}
				if(!this.code){
					uni.showModal({
						title:'提示',
						content:'请输入验证码',
						mask:true
					})
					return false;
				}
				if(this.code !== this.icode){
					uni.showModal({
						title:'提示',
						content:'输入验证码错误',
						mask:true
					})
					return false;
				}
				
				var data = {
					phone:phone,
					open_id:userInfo.openId || userInfo.open_id,
					gender:userInfo.gender || userInfo.sex,
					city:userInfo.city || '',
					country:userInfo.country || '',
					province:userInfo.province || '',
					account:userInfo.nickName || userInfo.nick_name,
					unionid:userInfo.unionid,
					user_id:userInfo.id || 0,
					// password:md5(that.password),
					head_img_url:userInfo.avatarUrl || userInfo.head_img_url,
				}
				console.log('---userInfo---',userInfo);
				// return false;
				tools.httpClient('home/WxStore/addAppUser',data, (error, res) => {
					if (res.errorCode == 0) {
						uni.showToast({
							title:'完善成功！',
							icon:'none'
						})
						uni.setStorageSync('userInfo',res.data);
						that.userInfo = uni.getStorageSync("userInfo");
					}else{
						uni.showToast({
							title:'完善失败！',
							icon:'none'
						})
					}
					uni.navigateBack({});
				})
				return false;
			},
		}
	}
</script>

<style>
	@import url("prefectInformation.css");
</style>
