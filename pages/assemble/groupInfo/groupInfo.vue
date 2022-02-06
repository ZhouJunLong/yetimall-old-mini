<template>
	<view class="wrap">
		<!--滑块视图-->
		<!-- <view class="img-area">
			<swiper autoplay="true" interval="3000" circular="true" indicator-dots="true" indicator-active-color="#ffffff" indicator-color="rgba(0, 0, 0, 0.6)">
				<swiper-item>
					<image :src="base_url+goodsInfo.img_url"></image>
				</swiper-item>
				<block v-for="(item, index) in goodsInfo.imgList">
					<swiper-item>
						<image :src="base_url+item"></image>
					</swiper-item>
				</block>
			</swiper>
		</view> -->
		<!-- 商品图片 -->
		<view class="good-image-info">
			<image mode="widthFix" :src="base_url+goodsInfo.name_img_url"></image>
			<image mode="widthFix" :src="base_url+goodsInfo.welfare_img_url"></image>
		</view>
		<!-- 过渡高度 -->
		<view class="transition-height"></view>
		<!-- 拼团信息 -->
		<view class="good-group-info">
			<view class="good-group-info-top flex-row">
				<image class="flex-row-item" :src="groupInfo.head_img_url"></image>
				<view class="flex-row-item">团长：{{groupInfo.name}}</view>
			</view>
			<view class="good-group-info-center space-between">
				<view class="group-center-left space-between-item">
					<view class="group-center-total">需 {{groupInfo.open_num}} 人成团</view>
					<view class="group-center-num">拼团（ID：{{groupInfo.id}}）已有{{groupInfo.open_num-groupInfo.residue_num}}人参团</view>
				</view>
				<view class="group-center-right space-between-item">
					<view class="group-center-count">成团倒计时</view>
					<view class="group-center-time flex-row" v-if="finish_time">
						<text class="flex-row-item">{{finish_time.second}}</text>:
						<text class="flex-row-item">{{finish_time.minute}}</text>:
						<text class="flex-row-item">{{finish_time.hour}}</text>:
						<text class="flex-row-item">{{finish_time.dayTime}}天</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 拼团用户 -->
		<view class="group-user">
			<view class="group-desc group-success" v-if="groupInfo.is_success == 1">拼团已成功</view>
			<view class="group-desc" v-else>快邀请好友来参加拼团吧！</view>
			<view class="head-area" v-if="groupInfo.orderList">
				<block v-for="(item, index) in groupInfo.orderList">
					<view class="img-list">
						<image :src="item.head_img_url" class="head-img">
							<view class="team-head" v-if="item.user_id == groupInfo.user_id">团长</view>
						</image>
					</view>
				</block>
				<block v-if="groupInfo.is_success == 0 && groupInfo.residue_num > 0">
					<block v-for="(item, index) in groupInfo.residue_num">
						<view class="img-list">
							<view class="head-list">?</view>
						</view>
					</block>
				</block>
			</view>
		</view>
		<!-- 商品信息 -->
		<view class="good-info">
			<view class="good-rule">
				<view class="good-rule-title">拼团规则</view>
				<view class="good-rule-image">
					<image mode="widthFix" :src="rule_png"></image>
				</view>
			</view>
			<view class="good-top flex-row">
				<view class="good-image flex-row-item">
					<image mode="widthFix" :src="base_url+goodsInfo.img_url"></image>
				</view>
				<view class="good-name flex-row-item">{{goodsInfo.name}}</view>
				<view class="good-group flex-row-item">
					<view class="good-team-num">{{goodsInfo.team_num}}人成团价</view>
					<view class="good-price flex-row">
						<image class="tip-img flex-row-item" :src="tip_png"></image>
						<view class="price-info flex-row-item">
							<text class="unit">￥</text>
							<block v-if="goodsInfo.is_specs == 1 && specs_name">
								<text class="price">{{specs_price}}</text>
							</block>
							<block v-else>
								<text class="price">{{goodsInfo.assemble_price_text}}</text>
								<!-- <text class="begin">起</text> -->
							</block>
						</view>
					</view>
					<view class="good-ori-price">
						<text>原价：</text>
						<text class="ori-price">￥{{goodsInfo.ori_price_text}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 过渡高度 -->
		<view class="transition-height"></view>
		<!-- 已选规格 -->
		<view class="specs-selected flex-row" v-if="groupInfo.good_is_specs == 1">
			<view class="specs-selected-one flex-row-item">已选：</view>
			<view class="specs-selected-two flex-row-item">{{specs_name}}<text class="specs-selected-two-price" v-if="specs_name">（￥{{specs_price}}）</text></view>
			<!-- <text class="iconfont icon-gengduo-a specs-selected-three flex-row-item"></text> -->
		</view>
		<!-- 过渡高度 -->
		<view class="transition-height"></view>
		<!-- 商品详情 -->
		<block v-if="goodsInfo.goodInfo">
			<view class="goods-detail" v-if="goodsInfo.goodInfo.type != 3">
				<view class="goods-detail-title">商品详情</view>
				<view class="goods-detail-desc">
					<u-parse :content="detail_desc" />
				</view>
			</view>
		</block>
		<!-- 分享朋友圈 -->
		<view class="share-circle" @click="share">
			<view class="share-circle-one">分享</view>
			<view class="share-circle-two">朋友圈</view>
		</view>
		<!-- 底部栏 -->
		<view class="btn-area space-between">
			<view class="icon-area space-between-item">
				<view class="icon-list flex-row" @click="showCity">
					<text class="iconfont icon-dingweiweizhi flex-row-item"></text>
					<text class="btn-area-text flex-row-item">{{cityInfo['city']}}</text>
					<text class="iconfont icon-jiantou8 flex-row-item"></text>
				</view>
				<button class="icon-list icon-list-kefu flex-row" open-type="share">
					<text class="iconfont icon-fenxiang flex-row-item"></text>
					<text class="btn-area-text flex-row-item">分享</text>
				</button>
			</view>
			<view class="btn-info space-between-item">
				<view class="btn-list" @click="joinGroup">参团购买</view>
			</view>
		</view>
		<!-- 遮罩层 -->
		<view class="shade" catchtouchmove="false" v-if="specs_show || city_show || message_show" @click="shadeHide"></view>
		<!-- 选择城市 -->
		<view class="city-fixed" catchtouchmove="false" v-if="city_show">
			<view class="city-fixed-content">
				<view class="city-fixed-title">选择城市</view>
				<view class="city-fixed-list flex-row">
				<block v-for="(item, index) in cityList">
					<view :class="[cityInfo['city'] == item.city?'city-fixed-item flex-row-item cur':'city-fixed-item flex-row-item']" @click="selectCity" :data-index="index">{{item.city}}</view>
				</block>
				</view>
				<text class="iconfont icon-guanbi1 city-hide" @click="shadeHide"></text>
			</view>
		</view>
		<!-- 分享海报 -->
		<view class="share-area" v-if="share_show">
			<view class="share-info">
				<!-- 小程序 -->
				<image class="share-good-img" mode="widthFix" :src="share_img" @click="saveImg"></image>
				<view class="share-other">
					<view class="share-icon">
						<text class="iconfont icon-guanbi" @click="closeShare"></text>
					</view>
				</view>
			</view>
		</view>
		<canvas class="canvas-area" canvas-id="share" style="width:750px;height:1160px"></canvas>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';
	import timer from '../../../common/timer.js';
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var cityInfo = "";
	var start_down = "";
	var end_date = "";
	var did = 0;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityInfo: [],//用户城市信息
				cityList: [],//城市列表
				group_id: 0,//拼团id
				groupInfo: [],//拼团信息
				gid: 0,//商品id
				goodsInfo: [],//商品信息
				rule_png: base_url + 'bg/assemble_rule.png',//拼团规则图
				tip_png: base_url+'bg/tip.png',//拼团图片
				detail_desc: '',//商品详情
				specs_name: '',//多规格名称
				specs_price: 0.00,//多规格价格
				specs_show: false,//是否显示多规格
				city_show: false,//是否显示城市选择
				count: 1,//数量
				message_show: false,//是否显示填写信息
				name: '',//团长姓名
				phone: '',//团长手机号
				share_show: false,//是否显示分享海报
				bg_img: base_url + 'bg/good_bg.png',//背景图
				imgPath: '', //商品主图
				imgPath1: '', //商品名称图
				imgPath2: '', //商品福利图
				imgPathHead: '', //用户头像
				share_img: '', //分享海报图片
				finish_time: '', //结束时间
			}
		},
		onLoad(options) {
			var that = this;
			
			//判断用户是否通过推广而来
			if (options.user_id) {
				did = options.user_id;
				uni.setStorageSync("did", did);
			}
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");//{'id':1,'nick_name':'李易峰'};//
			
			//获取用户信息
			that.getUserInfo();
			
			//用户城市信息
			cityInfo = uni.getStorageSync('cityInfo');
			if(cityInfo){
				that.cityInfo = cityInfo;
			}
			
			//获取城市列表
			that.getCityList();
			
			//页面携带参数（需要修改）
			var group_id = options.group_id;//1;//
			that.group_id = group_id;
			
			//获取拼团信息
			that.getGroupInfo(group_id);
			
			//分享朋友圈（小程序）
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");//{'id':1,'nick_name':'李易峰'};//
			
			//获取用户信息
			that.getUserInfo();
		},
		//分享好友（小程序）
		onShareAppMessage(res) {
			var that = this;
		    if (res.from === 'button') {// 来自页面内分享按钮
				//console.log(res.target)
		    }
			var group_id = that.group_id;
			var title = that.goodsInfo.name;
			var user_id = userInfo.id;
		    return {
				title: title,
				path: '/pages/store/groupInfo/groupInfo?group_id='+group_id+'&user_id='+user_id
		    }
		},
		//分享朋友圈（小程序）
		onShareTimeline: function () {
		    var that = this;
		    var group_id = that.group_id;
		    var title = that.goodsInfo.name;
		    var user_id = userInfo.id;
		    return {
				title: title,
				query: {
					'group_id': group_id,
					'user_id': user_id
				}
		    }
		},
		onUnload(){
			if (start_down) { //清除之前的倒计时
				clearInterval(start_down);
			}
		},
		methods: {
			//获取拼团信息
			getGroupInfo:function(group_id){
				var that = this;
				tools.httpClient('home/WxStore/getGroupInfo',{'group_id':group_id},(error,res)=>{
					if (res.errorCode == 0) {
						var groupData = res.data;
						that.groupInfo = groupData;
						//倒计时
						end_date = res.data.end_time;
						countDown(that);
						
						//获取商品信息
						var gid = res.data.gid;
						that.gid = gid;
						//多规格
						var good_is_specs = res.data.good_is_specs;
						var good_specs_name = res.data.good_specs_name;
						that.getGoodInfo(gid,good_is_specs,good_specs_name);
					}
				});
			},
			
			//获取商品信息
			getGoodInfo: function(gid,good_is_specs,good_specs_name) {
				var that = this;
				//用户id
				var user_id = userInfo.id;
				if(user_id == undefined){
				  user_id = 0;
				}
				//获取商品信息
				tools.httpClient("home/WxStore/getAssembleGoodInfo",{'id':that.gid,'user_id':user_id },function(err,res){
					//console.log(res);
					if(res.errorCode==0){
						var goodsData = res.data;
						//处理价格显示
						goodsData['assemble_price_text'] = parseInt(goodsData['assemble_price']);
						goodsData['ori_price_text'] = parseInt(goodsData['ori_price']);
						//多规格
						if(good_is_specs == 1){
							that.specs_name = good_specs_name;
							var specs_price = goodsData['assemble_price'];
							var specsList = goodsData.specsList;
							for (var a=0;a<specsList.length;a++) {
								if(specsList[a]['name'] == good_specs_name){
									specs_price = specsList[a]['price'];
								}
							}
							that.specs_price = specs_price;
						}
						//商品详情
						var detail_desc = goodsData.detail_desc;
						if (!detail_desc) {
							var detail_desc  = "<view style='text-align: center'>暂无信息</view>"
						}
						that.goodsInfo = goodsData;
						that.detail_desc = detail_desc;
					}
				})
			},
			
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo', {'user_id': userInfo.id}, (error, result) => {
					if (result.errorCode == 0) {
						var userData = result.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				})
			},
			
			//获取城市
			getCityList: function() {
				var that = this;
				tools.httpClient('home/WxStore/getCityList', {}, (error, res) => {
					//console.log(res);
					if (res.errorCode == 0) {
						var cityData = res.data;
						that.cityList = cityData;
					}
				});
			},
			
			//显示城市
			showCity:function(){
				var that = this;
				that.specs_show = false;
				that.message_show = false;
				that.city_show = true;
			},
			
			//选择城市
			selectCity:function(e){
				var that = this;
				var index = e.currentTarget.dataset.index;
				var cityList = that.cityList;
				var newCityInfo = cityList[index];
				that.cityInfo = newCityInfo;
				cityInfo = newCityInfo;
				uni.showToast({
					title: '城市切换成功',
					icon: 'success',
					duration: 1500
				});
				setTimeout(function(){
					that.city_show = false;
				},1500);
			},
			
			//隐藏shade
			shadeHide:function(){
				var that = this;
				that.specs_show = false;
				that.city_show = false;
				that.message_show = false;
			},
			
			//参团购买
			joinGroup:function() {
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				};
				//获取拼团信息
				var group_id = that.group_id;
				//获取商品信息
				var gid = that.goodsInfo.id;
				var goods_count = that.count;
				//判断商品多规格
				var is_specs = that.goodsInfo.is_specs;
				var specs_name = that.specs_name;
				var specs_price = that.specs_price;
				//城市信息
				var city_id = cityInfo.id?cityInfo.id:0;
				var city = cityInfo.city?cityInfo.city:'';
				if(city_id == 0 || city == ""){
					uni.showToast({
						title: '填选择城市信息！',
						icon: 'none',
						duration: 1500 
					})
					return false;
				}
				if(group_id > 0){
					uni.navigateTo({
						url: '/pages/assemble/confirmOrder/confirmOrder?gid=' + gid + '&count=' + goods_count + '&specs_name=' + specs_name + '&specs_price=' + specs_price+'&city_id='+city_id+'&city='+city+ '&group_id='+group_id,
					})
				}
			},
			
			//分享朋友圈(获取商品分享码)
			share: function() {
				var that = this;
				var gid = that.gid;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				};
				uni.showLoading({
					title:'加载中'
				});
				tools.httpClient('home/WxStore/shareGood', {'user_id': userInfo.id,'gid': gid,'type': 2}, (error, res) => {
					//console.log(res);
					if (res.errorCode == 0) {
						//小程序码
						uni.getImageInfo({
							src: base_url + res.data,
							success: function (res1) {
								that.code_img = res1.path;
								//背景图
								uni.getImageInfo({
									src: that.bg_img,
									success:function(res2){
										that.bg_img = res2.path;
										//商品主图
										uni.getImageInfo({
											src: base_url + that.goodsInfo.img_url,
											success: function (res3) {
												that.imgPath = res3.path;
												//商品名称图
												uni.getImageInfo({
													src: base_url + that.goodsInfo.name_img_url,
													success: function (res4) {
														that.imgPath1 = res4.path;
														//商品福利图
														uni.getImageInfo({
															src: base_url + that.goodsInfo.welfare_img_url,
															success: function (res5) {
																that.imgPath2 = res5.path;
																//绘制海报
																that.drawImg();
															}
														})
													}
												})
											}
										})
									}
								})
							}
						})
					}
				});
			},
				
			//绘制海报
			drawImg:function(){
				var that = this;
				//形成canvas绘图
				var ctx = wx.createCanvasContext('share');
				var bg_img = that.bg_img; //背景图
				var code_img = that.code_img;  //二维码
				var img_url = that.imgPath;  //商品图片
				var name_img_url = that.imgPath1;  //商品名称图片
				var welfare_img_url = that.imgPath2;  //商品福利图片
				var goodInfo = that.goodsInfo;//商品信息
				var goods_name = goodInfo.name;//商品名称
				var price = '￥' + goodInfo.assemble_price;//商品价格
				
				//白色背景色
				ctx.setFillStyle("#ffffff");
				ctx.fillRect(0, 0, 750, 1160); //白色背景大小
				
				//这里是把页面上的数据写入到画布里，具体的坐标需要各位自行调整
				ctx.drawImage(bg_img, 0, 0,750,1160);  //背景图
					
				//这里是把页面上的数据写入到画布里，具体的坐标需要各位自行调整
				var h = 400;
				ctx.drawImage(img_url, 0, 0,750,h);
				
				//商品名称图
				ctx.drawImage(name_img_url, 0, h,750,190);
				
				//商品福利图
				ctx.drawImage(welfare_img_url, 0, h+190,750,210);
				
				//商品名称
				if(goods_name.length > 12){
					var name_1 = goods_name.substring(0, 12);
				}
				else{
					var name_1 = goods_name;
				}
				ctx.setFontSize(30);
				ctx.setFillStyle('#000000');
				ctx.fillText(name_1, 30, h+450);
				if(goods_name.length > 12){
					var name_2 = goods_name.substring(12, goods_name.length);
					ctx.setFontSize(30);
					ctx.setFillStyle('#000000');
					ctx.fillText(name_2, 30, h+500);
				}
				
				//价格标签
				ctx.setFontSize(32);
				ctx.setFillStyle('#F72F50');
				if(goods_name.length > 12){
					ctx.fillText(price, 565, h+450);
				}
				else{
					ctx.fillText(price, 565, h+450);
				}
			
				//二维码
				ctx.drawImage(code_img, 540, h+530, 180, 180);
				ctx.draw(true, function () {
					setTimeout(function(){
						uni.canvasToTempFilePath({
							canvasId: 'share',
							success(res) {
								uni.hideLoading();
								that.share_img = res.tempFilePath;
								that.share_show = true;
							}
						})
					},100)
				});
			},
				
			//长按保存图片（小程序）
			saveImg:function(){
				var that = this;
				var share_img = that.share_img;
				uni.saveImageToPhotosAlbum({
					filePath:share_img,
					success() {
						uni.showToast({
							title: '保存至相册成功！',
							icon: 'none'
						})
					},
				})
			},
			
			//关闭分享
			closeShare:function(){
				var that = this;
				that.share_show = false;
			},
			
		}
	}
	
	/**
	 * 倒计时
	 */
	var countDown = function (that) {
	    if (start_down) {//清除之前的倒计时
	        clearInterval(start_down)
	    }
	    if(end_date != '' && end_date != null){
	        start_down = setInterval(function () {
				var finish_time = timer.down(end_date, null, 1);
				that.finish_time = finish_time;
	        }, 1000);
	    }
	}
</script>

<style>
	@import url("./groupInfo.css");
</style>
