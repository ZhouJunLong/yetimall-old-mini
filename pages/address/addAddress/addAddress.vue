<template>
	<view class="wrap">
		<view class="input-area">
			<view class="attr-area" v-if="language == 2">
				<text class="attr-name">수취인：</text>
				<input class="input" @input="getInfo" data-type="name" placeholder="수취인 의 성명 을 기입 해 주 십시오" placeholder-style="color:#DAE0E3;"/>
			</view>
			<view class="attr-area" v-else>
				<text class="attr-name">收件人：</text>
				<input class="input" @input="getInfo" data-type="name" placeholder="请填写收货人姓名" placeholder-style="color:#DAE0E3;"/>
			</view>
			<view class="attr-area" v-if="language == 2">
				<text class="attr-name">핸드폰 번호：</text>
				<input type="number" class="input" @input="getInfo" data-type="phone" placeholder="수취인 의 휴대 전화 번 호 를 기입 해 주 십시오" placeholder-style="color:#DAE0E3;" />
			</view>
			<view class="attr-area" v-else>
				<text class="attr-name">手机号码：</text>
				<input type="number" class="input" @input="getInfo" data-type="phone" placeholder="请填写收货人手机号" placeholder-style="color:#DAE0E3;" />
			</view>
			<view class="picker-area space-between attr-area" v-if="language == 2">
				<text class="attr-name">도시：</text>
				<input type="number" class="input" @input="getInfo" data-type="city" placeholder="도시" placeholder-style="color:#DAE0E3;" />
			</view>
			<view class="picker-area space-between attr-area" v-else>
				<view class="attr-area-left space-between-item flex-row">
					<text class="attr-name">选择城市：</text>
				</view>
				<view class="select-area">
					<pickerAddress @change = "change">{{txt}}</pickerAddress>
				</view>
				<view><text class="iconfont icon-youjiantouda"></text></view>
			</view>
			<view class="address-detail attr-area" v-if="language == 2">
				<text class="attr-name">상세 주소：</text>
				<input type="text" @input="getInfo" data-type="address-detail" placeholder="거리" placeholder-style="color:#DAE0E3;"/>
			</view>
			<view class="address-detail attr-area" v-else>
				<text class="attr-name">详细地址：</text>
				<input type="text" @input="getInfo" data-type="address-detail" placeholder="街道牌楼号等" placeholder-style="color:#DAE0E3;"/>
			</view>
			<view class="user_identify attr-area" v-if="language != 2">
				<text class="attr-name">身份证号：</text>
				<input type="text" @input="getInfo" data-type="identify" placeholder="请输入身份证号码" placeholder-style="color:#DAE0E3;"/>
			</view>
		</view>
		<view class="alert-tip">
			<view class="tip">
				<text class="iconfont icon-fuxuankuang_xuanzhong" style="color: #57D0D9;" v-if="isshow" @click="show"></text>
				<text class="iconfont icon-fuxuankuang_weixuanzhong" v-else @click="show"></text>
				<text>同意平台获取我的地址信息用于发货使用。</text>
			</view>
		</view>
		<view class="submit-area" @click="submit">
			<text class="submit" v-if="language == 2">주소 저장</text>
			<text class="submit" v-else>保存地址</text>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';
	import pickerAddress from '../../components/wangding-pickerAddress/wangding-pickerAddress.vue';
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var did = 0;
	
	export default {
		components:{
			pickerAddress
		},
		data() {
			return {
				base_url: base_url,//BASE_URL
				name: '',//联系人
				phone: '',//联系号码
				txt: '请选择省市区',//所选地址
				address_detail: '',//地址名称
				address: '',//地址信息
				userInfo:[],
				language:1,
				identify:'',
				isshow:0
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");
			that.language = uni.getStorageSync("language");
			if(that.language == 2){
				
			}else{
				that.language = 1;
			}
			// console.log(that.userInfo)
			//获取用户信息
			// that.getUserInfo();
		
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");
			that.language = uni.getStorageSync("language");
			if(that.language == 2){
				
			}else{
				that.language = 1;
			}
			// console.log(that.userInfo)
			
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
			
			change(data){
				this.txt = data.data.join(' ');
			},
			show(){
				if(this.isshow == 1){
					this.isshow = 0;
				}else{
					this.isshow = 1;
				}
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
				}else if(type == "city"){
					that.txt = value;
				}else if(type == "address-detail"){
					that.address_detail = value;
				}else if(type == "identify"){
					that.identify = value;
				}
			},
			
			//提交
			submit: function(){
				var that = this;
				//判断用户授权
				// if(!tools.isWeixinLogin()){
				// 	return false;
				// }
				if(that.isshow == 0){
					uni.showToast({
						title:'请勾选并同意平台使用你的收货地址！',
						icon:'none',
						duration:1500,
					})
					return false;
				}
				var name = that.name;
				var phone = that.phone;
				var address_name = that.txt;
				var address_detail = that.address_detail;
				var user_id = that.userInfo.id;
				var identify = that.identify;
				if(user_id == '' || user_id == 0 || user_id == undefined){
					uni.showToast({
						title:'请重新授权',
						icon:'none',
						duration:1500,
					})
					return false;
				}
				if(identify == '' || identify == 0 || identify == undefined){
					uni.showToast({
						title:'请输入身份证号码',
						icon:'none',
						duration:1500,
					})
					return false;
				}	
				if(name == ''){
					uni.showToast({
						title:'请输入联系人',
						icon:'none',
						duration:1500,
					})
					return false;
				}
				if(phone == ''){
					uni.showToast({
						title:'请输入联系号码',
						icon:'none',
						duration:1500,
					})
					return false;
				}
				if(phone.length != 11){
					uni.showToast({
						title:'联系号码格式不正确',
						icon:'none',
						duration:1500,
					})
					return false;
				}

				if(address_name == ''){
					uni.showToast({
						title:'请选择地址信息',
						icon:'none',
						duration:1500,
					})
					return false;
				}
				if(address_detail == ''){
					uni.showToast({
						title:'请完善详细地址',
						icon:'none',
						duration:1500,
					})
					return false;
				}
				var data = {
					user_id: that.userInfo.id,
					phone:that.userInfo.phone,
					name: name,
					send_phone: phone,
					address: address_name,
					address_detail: address_detail,
					identify:identify,
				};
				uni.showLoading();
				tools.httpClient('home/WxStore/insertAddress',data, (error, res) => {
					uni.hideLoading();
					if(res.errorCode == 0){
						uni.showToast({
							title:'提交成功',
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
				})
			}
			
			
		}
	}
</script>

<style>
	@import url("./addAddress.css");
</style>
