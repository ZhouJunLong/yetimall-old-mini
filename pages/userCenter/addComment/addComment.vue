<template>
	<view class="wrap">
		<!-- 内容区域 -->
		<view class="top-area">
			<view class="top-fir">服务已完成</view>
			<view class="top-snd">请对本次服务做出评价吧</view>
			<view class="score-area">
				<block v-for="(item, index) in scoreArr">
					<view class="score-list">
						<text :class="[item == 1?'iconfont icon-xingxing cur':'iconfont icon-xingxing']" @click="selectScore" :data-index="index"></text>
					</view>
				</block>
			</view>
		</view>
		<view class="label-area">
			<block v-for="(item, index) in labelList">
				<view :class="[item.is_selected == 1?'label-list cur2':'label-list']" @click="selectLabel" :data-index="index">{{item.name}}</view>
			</block>
		</view>
		<view class="message-area">
			<textarea class="message" placeholder="写其他意见和建议" placeholder-style="font-size:15px;color:#bcbcbc;" @input="getMessage"></textarea>
		</view>
		<view class="tip">满意的话请打五星哦，谢谢您的支持!</view>
		<view class="btn-area">
			<view class="submit" @click="submit">评价完成</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var cityInfo = "";
	var did = 0;
	var is_click = true;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityInfo: [],//用户城市信息
				oid: 0, //订单id
				scoreArr: [0,0,0,0,0],//评分数组
				score: 0, //评分
				labelList: [], //评价标签列表
				content: '',//评价内容
			}
		},
		onLoad(options) {
			var that = this;
			
			//页面携带参数
			var oid = options.oid;
			that.oid = oid;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//用户城市信息
			cityInfo = uni.getStorageSync('cityInfo');
			if(cityInfo){
				that.cityInfo = cityInfo;
			}
			
			//获取评价标签列表
			that.getCommentLabel();
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		methods: {
			//获取地址信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo',{'user_id':userInfo.id}, (error, res) => {
					if (res.errorCode == 0) {
						var userData = res.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				})
			},
			
			//获取评价标签
			getCommentLabel:function(){
				var that = this;
				var data = {
					city_id: cityInfo.id?cityInfo.id:0,
				};
				tools.httpClient('home/WxStore/getCommentLabel',data, (error, res) => {
					if (res.errorCode == 0) {
						that.labelList = res.data;
					}
				})
			},
			
			//打分
			selectScore:function(e){
				var that = this;
				var index = e.currentTarget.dataset.index;
				var scoreArr = [0,0,0,0,0];
				for(var i=0;i<=index;i++){
					scoreArr[i] = 1;
				}
				var score = parseInt(index) + 1;
				that.scoreArr = scoreArr;
				that.score = score;
			},
				
			//选择评价标签
			selectLabel:function(e){
				var that = this;
				var index = e.currentTarget.dataset.index;
				var labelList = that.labelList;
				if(labelList[index].is_selected == 1){
					labelList[index].is_selected = 0;
				}
				else{
					labelList[index].is_selected = 1;
				}
				that.labelList = labelList;
			},
				
			//获取留言
			getMessage:function(e){
				var that = this;
				that.content = e.detail.value;
			},
				
			//提交
			submit:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				var data = {
					user_id: userInfo.id,
					nick_name: userInfo.nick_name,
					head_img_url: userInfo.head_img_url,
					oid: that.oid,
					score: that.score,
					content: that.content,
				};
				var labelList = that.labelList;
				var labelArr = [];
				for(var i = 0;i < labelList.length;i++){
					if(labelList[i].is_selected == 1){
						labelArr.push(labelList[i].name);
					}
				}
				data.label_list = labelArr.join(',');
				if(data.user_id=='' || data.user_id==null || data.user_id==undefined){
					uni.showToast({
						title:'请返回重新授权',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(data.oid=='' || data.oid==null || data.oid==undefined){
					uni.showToast({
						title:'请返回重新评价',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(data.score == 0){
					uni.showToast({
						title:'请选择评分',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(labelArr.length == 0){
					uni.showToast({
						title:'请选择标签',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(data.content == '' || data.content == null){
					uni.showToast({
						title:'请填写意见或建议',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(is_click){
					uni.showLoading({
						title:'加载中'
					})
					is_click = false;
					tools.httpClient('home/WxStore/addComment',data, (error, res) => {
						uni.hideLoading();
						if (res.errorCode == 0) {
							uni.showToast({
								title: "评价成功",
								icon:'success',
								success:function(){
									setTimeout(function(){
										is_click = true;
										uni.reLaunch({
											url:'/pages/userCenter/orderList/orderList?state=-1'
										});
									},1500);
								}
							})
						}
						else{
							is_click = true;
							uni.showToast({
								title: res.errorInfo,
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
	@import url("./addComment.css");
</style>
