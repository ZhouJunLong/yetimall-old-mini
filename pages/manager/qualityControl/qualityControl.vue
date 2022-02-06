<template>
	<view class="wrap">
		<!-- 内容区域 -->
		<view class="main-area">
			<!-- 其他信息 -->
			<view class="other-area">
				<view class="other-list">
					<input type="text" class="other-inp" placeholder="品控区域" placeholder-class="tip" data-type="control_area" @input="getInfo"/>
				</view>
				<view class="other-list">
					<input type="text" class="other-inp" placeholder="服务区域" placeholder-class="tip" data-type="service_area" @input="getInfo"/>
				</view>
				<view class="other-list other-list-actual">
					<input type="digit" class="other-inp" placeholder="实际面积" placeholder-class="tip" data-type="actual_area" @input="getInfo"/>
					<text class="actual-text">㎡</text>
				</view>
				<view class="other-list-family">
					<text class="family-text family-hall-text">家庭厅室</text>
					<input type="number" class="other-inp" placeholder="" placeholder-class="tip" data-type="room" @input="getInfo"/>
					<text class="family-text">室</text>
					<input type="number" class="other-inp" placeholder="" placeholder-class="tip" data-type="office" @input="getInfo"/>
					<text class="family-text">厅</text>
					<input type="number" class="other-inp" placeholder="" placeholder-class="tip" data-type="guard" @input="getInfo"/>
					<text class="family-text">卫</text>
				</view>
				<view class="other-feedback">
					<textarea class="content" placeholder="意见反馈..." placeholder-style="color:#B3C4D2;font-size:13px;" data-type="feedback" @input="getInfo"></textarea>
				</view>
				<view class="other-purpose space-between">
					<view class="other-purpose-left space-between-item">有无包年意向</view>
					<view class="other-purpose-right space-between-item space-between">
						<view class="purpose-right-item space-between-item flex-row" @click="selectPurpose" data-purpose="1">
							<text class="purpose-text flex-row-item">有</text>
							<text class="iconfont icon-xuanze-danxuan flex-row-item" v-if="year_purpose == 1"></text>
							<text class="iconfont icon-unselect-radio2 flex-row-item" v-else></text>
						</view>
						<view class="purpose-right-item space-between-item flex-row" @click="selectPurpose" data-purpose="0">
							<text class="purpose-text flex-row-item">无</text>
							<text class="iconfont icon-xuanze-danxuan flex-row-item" v-if="year_purpose == 0"></text>
							<text class="iconfont icon-unselect-radio2 flex-row-item" v-else></text>
						</view>
					</view>
				</view>
			</view>
			<view class="img-area">
				<view class="img-title">
					<text class="iconfont icon-shuxian1"></text>
					<text>上传照片</text>
				</view>
				<view class="img-info">
					<block v-for="(item, index) in imgList">
						<view class="img-list">
							<image :src="base_url+item.img_url" class="img"></image>
							<text class="iconfont icon-guanbi2 icon-delete" @click="deleteImg" :data-index="index"></text>
						</view>
					</block>
					<view class="img-list" @click="selectImg" v-if="imgList.length < 9">
						<text class="iconfont icon-tupianshangchuan"></text>
					</view>
				</view>
			</view>
			<!-- 提交 -->
			<view class="btn-area">
				<view class="submit" @click="submit">提交</view>
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
	var is_click = true;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				rid: 0,//预约记录id
				control_area: '',//品控区域
				service_area: '',//服务区域
				actual_area: '',//实际面积
				feedback: '',//意见反馈
				year_purpose: 0,//包年意向
				room: '',//室
				office: '',//厅
				guard: '',//卫
				imgList: [],//图片列表
			}
		},
		onLoad(options) {
			var that = this;
			
			//页面携带参数
			var rid = options.rid;
			that.rid = rid;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰','manager_id':1};//uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰','manager_id':1};//uni.getStorageSync("userInfo");
			
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
			
			//选择图片
			selectImg:function(){
				var that = this;
				uni.chooseImage({
					count: 9,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success (res) {
						// tempFilePath可以作为img标签的src属性显示图片
						var filePath = res.tempFilePaths;
						that.uploadImg(filePath);
					}
				})
			},
			//上传图片
			uploadImg:function(file){
				var that = this;
				var imgList = that.imgList;
				for(var i=0;i<file.length;i++){
					wx.uploadFile({
						url: base_url+'home/WxStore/uploadImage', //仅为示例，非真实的接口地址
						filePath: file[i],
						name: 'file',
						success (res){
							var res = res.data;
							var data = JSON.parse(res);
							if(data.errorCode==0){
								var arr = {
									img_url:data.data
								}
								imgList.push(arr);
								that.imgList = imgList;
							}
						}
					})
				}
			},
			//删除图片
			deleteImg:function(e){
				var that = this;
				var index = e.currentTarget.dataset.index;
				var imgList = that.imgList;
				var img_url = imgList[index].img_url;
				if(img_url){
					tools.httpClient("home/WxStore/deleteImage",{img_url:img_url},function(err,res){
						if(res.errorCode==0){
							imgList.splice(index,1);
							that.imgList = imgList;
						}
					})
				}
			},
				
			//填写信息
			getInfo:function(e){
				var that = this;
				var type = e.currentTarget.dataset.type;
				var value = e.detail.value;
				if(type == "control_area"){
					that.control_area = value;
				}else if(type == "service_area"){
					that.service_area = value;
				}else if(type == "actual_area"){
					that.actual_area = value;
				}else if(type == "feedback"){
					that.feedback = value;
				}else if(type == "room"){
					that.room = value;
				}else if(type == "office"){
					that.office = value;
				}else if(type == "guard"){
					that.guard = value;
				}
			},
			
			//选择包年意向
			selectPurpose:function(e){
				var that = this;
				var purpose = e.currentTarget.dataset.purpose;
				that.year_purpose = purpose;
			},
				
			//提交
			submit:function(){
				var that = this;
				var data = {
					rid: that.rid,
					user_id: userInfo.id,
					manager_id: userInfo.manager_id,
					control_area: that.control_area,
					service_area: that.service_area,
					actual_area: that.actual_area,
					feedback: that.feedback,
					year_purpose: that.year_purpose,
					room: that.room,
					office: that.office,
					guard: that.guard,
					img_list: JSON.stringify(that.imgList),
				};
				if(data.rid == 0){
					uni.showToast({
						title:'师傅服务不存在，无法提交',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(data.manager_id == '' || data.manager_id == null || data.manager_id == undefined){
					uni.showToast({
						title:'请重新授权',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(that.imgList.length == 0){
					uni.showToast({
						title:'请至少上传一张图片',
						icon:'none',
						duration:1500
					})
					return false;
				}
				uni.showLoading({
					title:'加载中'
				})
				if(is_click){
					is_click = false;
					tools.httpClient('home/WxStore/addQualityControl', data, (err, res) => {
						uni.hideLoading();
						if (res.errorCode == 0) {
							uni.showToast({
								title:'提交成功',
								icon:'success',
								success:function(){
									setTimeout(function(){
										is_click = true;
										//返回上一页并携带参数
										var pages = getCurrentPages();
										var prevPage = pages[pages.length - 2];
										prevPage.is_control = 1;
										uni.navigateBack({
											delta: 1
										})
									},1000)
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
	@import url("./qualityControl.css");
</style>
