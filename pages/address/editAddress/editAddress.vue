<template>
	<view class="wrap">
		<view class="input-area">
			<view class="attr-area" v-if="language == 0">
				<text class="attr-name">수취인：</text>
				<input class="input" @input="getInfo" data-type="name" placeholder="请填写收货人姓名" placeholder-style="color:#DAE0E3;" :value="name"/>
			</view>
			<view class="attr-area" v-else>
				<text class="attr-name">收件人：</text>
				<input class="input" @input="getInfo" data-type="name" placeholder="수취인 의 성명 을 기입 해 주 십시오" placeholder-style="color:#DAE0E3;" :value="name"/>
			</view>
			<view class="attr-area" v-if="language == 0">
				<text class="attr-name">핸드폰 번호：</text>
				<input type="number" class="input" @input="getInfo" data-type="phone" placeholder="수취인 의 휴대 전화 번 호 를 기입 해 주 십시오" placeholder-style="color:#DAE0E3;" :value="phone"/>
			</view>
			<view class="attr-area" v-else>
				<text class="attr-name">手机号码：</text>
				<input type="number" class="input" @input="getInfo" data-type="phone" placeholder="请填写收货人手机号" placeholder-style="color:#DAE0E3;" :value="phone"/>
			</view>
			<view class="picker-area space-between attr-area" v-if="language == 0">
				<text class="attr-name">도시：</text>
				<input type="number" class="input" @input="getInfo" data-type="city" placeholder="도시" placeholder-style="color:#DAE0E3;" :value="txt"/>
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
			<view class="address-detail attr-area" v-if="language == 0">
				<text class="attr-name">상세 주소：</text>
				<input type="text" @input="getInfo" data-type="address_detail" placeholder="거리" placeholder-style="color:#DAE0E3;" :value="address_detail"/>
			</view>
			<view class="address-detail attr-area" v-else>
				<text class="attr-name">详细地址：</text>
				<input type="text" @input="getInfo" data-type="address_detail" placeholder="街道牌楼号等" placeholder-style="color:#DAE0E3;" :value="address_detail"/>
			</view>
			<view class="user_identify attr-area" v-if="language != 0">
				<text class="attr-name">身份证号：</text>
				<input type="text" @input="getInfo" data-type="identify" placeholder="请输入身份证号码" :value="identify" placeholder-style="color:#DAE0E3;"/>
			</view>
		</view>
		<view class="submit-area" @click="submit">
			<text class="submit" v-if="language == 0">주소 저장</text>
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
				address_detail: '',//地址名称
				address: '',//地址信息
				txt: '请选择省市区',//所选地址
				language:0,
				identify:'',
			}
		},
		onLoad(options) {
			var that = this;
			
			//页面携带参数
			var id = options.id;
			that.id = id;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			that.language = uni.getStorageSync("language");
			//获取地址信息
			that.getAddressInfo(id);
		},
		methods: {
			//获取地址信息
			getAddressInfo: function(id) {
				var that = this;
				tools.httpClient('home/WxStore/getAddressInfo', {'id': id}, (error, res) => {
					console.log(res.data)
					if (res.errorCode == 0) {
						that.name = res.data.name;
						that.phone = res.data.send_phone;
						that.txt = res.data.address;
						that.address_detail = res.data.address_detail;
						that.address = res.data.address;
						that.identify = res.data.identify_num;
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
				}else if(type == "city"){
					that.address = value;
				}else if(type == "address_detail"){
					that.address_detail = value;
				}else if(type == "identify"){
					that.identify = value;
				}
			},
			
			//提交
			submit: function(){
				var that = this;
				var name = that.name;
				var phone = that.phone;
				var address_detail = that.address_detail;
				var address = that.address;
				var user_id = userInfo.id;
				var id = that.id;
				var identify = that.identify;
				if(user_id == '' || user_id == 0 || user_id == undefined){
					uni.showToast({
						title:'请重新授权',
						icon:'none',
						duration:1500,
					})
					return false;
				}
				if(id == '' || id == 0 || id == undefined){
					uni.showToast({
						title:'请重新编辑',
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
				var data = {
					user_id: user_id,
					id: id,
					name: name,
					send_phone: phone,
					address_detail: address_detail,
					address: address,
					identify: identify,
				};
				uni.showLoading();
				tools.httpClient('home/WxStore/updateAddress',data, (error, res) => {
					uni.hideLoading();
					if(res.errorCode == 0){
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
							content: res.errorInfo,
							showCancel: false,
							confirmText: '确定',
							confirmColor: '#3056d1',
							success: function (res) {
								if (res.confirm) {} else if (res.cancel) {}
							}
						})
					}
				})
			}
			
			
		}
	}
</script>

<style>
	@import url("./editAddress.css");
</style>
