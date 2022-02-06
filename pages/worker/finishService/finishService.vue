<template>
	<view class="wrap">
		<view class="main-area">
			<view class="top-area">
				<view class="title-one" v-if="type==1">上传服务前照片</view>
				<view class="title-one" v-if="type != 1">上传服务后照片</view>
				<view class="title-two">按照提示拍摄照片</view>
			</view>
			<view class="img-area">
				<view class="img-title">
					<text class="iconfont icon-shuxian1"></text>
					<text>上传照片</text>
				</view>
				<view class="img-info">
					<view class="img-list" v-for="(item,index) in imgList">
						<image :src="base_url+item.img_url" class="img">
							<text class="iconfont icon-guanbi2" @click="deleteImg" :data-index="index"></text>
						</image>
					</view>
					<view class="img-list" @click="selectImg" v-if="imgList.length < 9">
						<text class="iconfont icon-tupianshangchuan"></text>
					</view>
				</view>
			</view>
			<!-- 其他信息 -->
			<view class="other-area" v-if="type==2">
				<view class="other-list">
					<input type="text" class="other-inp" placeholder="实际平方" placeholder-class="tip" data-type="house_area" v-model="house_area" @input="getAreaInfo"/>
				</view>
				<view class="other-list">
					<input type="text" class="other-inp" placeholder="有无包年意向" placeholder-class="tip" data-type="year_intent" v-model="year_intent" @input="getYearInfo"/>
				</view>
				<view class="other-list">
					<input type="text" class="other-inp" placeholder="是否有其他服务意向" placeholder-class="tip" data-type="other_intent" v-model="other_intent" @input="getOtherInfo"/>
				</view>
			</view>
			
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
	var page = 1;
	var pageSize = 15;
	var allPages = 0;
	var bStop = true;
	var is_click = true;
	
	
	export default {
		data() {
			return {
				base_url: base_url,
				userInfo: [],//用户信息
				type:'',   //1：开始   2：结束
				rid:0,  //预约记录id
				imgList:[],
				house_area:'',
				year_intent:'',
				other_intent:''
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			if(options.type && options.rid){
				that.type = options.type;
				that.rid = options.rid;
				if(options.type==1){
					uni.setNavigationBarTitle({
						title:"开始服务"
					})
				}
				else{
					uni.setNavigationBarTitle({
						title:"完成服务"
					})
				}
			}
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
				tools.httpClient('home/WxStore/getUserInfo', {'user_id':userInfo.id}, (err, result) => {
					if (result.errorCode == 0) {
						var userData = result.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				});
			},
			
			//全部订单
			orderList:function(e){
				var state = e.currentTarget.dataset.state;
				uni.navigateTo({
					url:"/pages/worker/orderList/orderList?state="+state
				})
			},
			
			//选择图片
			selectImg:function(e){
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
					uni.uploadFile({
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
			getAreaInfo:function(e){
				var that = this;
				var house_area = that.house_area;
				that.house_area = house_area;
			},
			
			getYearInfo:function(e){
				var that = this;
				var year_intent = that.year_intent;
				that.year_intent = year_intent;
			},
			
			getOtherInfo:function(e){
				var that = this;
				var other_intent = that.other_intent;
				that.other_intent = other_intent;
			},
			
			//提交
			submit:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				var data = {
					rid:that.rid,
					type:that.type,
					house_area:that.house_area,
					year_intent:that.year_intent,
					other_intent:that.other_intent
				};
				if(that.type == 1){
					data.server_front_img = JSON.stringify(that.imgList);
				}
				else{
					data.server_after_img = JSON.stringify(that.imgList);
				}
				if(data.rid == 0){
					uni.showToast({
						title:'预约记录不存在，无法提交',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(that.data.imgList.length == 0){
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
					tools.httpClient('home/WxStore/updateRecordInfo', data, (err, res) => {
						uni.hideLoading();
					    if (res.errorCode == 0) {
							uni.showToast({
								title:'提交成功',
								icon:'success',
								success:function(){
									is_click = true;
									uni.reLaunch({
										url:'/pages/worker/orderList/orderList?state=1,2'
									})
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
					});
				}
			}
		}
	}
</script>

<style>
	@import url("./finishService.css");
	@import url("/app.css");
</style>
