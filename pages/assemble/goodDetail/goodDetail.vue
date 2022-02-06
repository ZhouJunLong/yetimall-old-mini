<template>
	<view class="wrap">
		<!--滑块视图-->
		<view class="img-area">
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
								<text class="begin">起</text>
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
		<view class="specs-selected flex-row" v-if="goodsInfo.is_specs == 1" @click="showSpecs">
			<view class="specs-selected-one flex-row-item">已选：</view>
			<view class="specs-selected-two flex-row-item">{{specs_name}}<text class="specs-selected-two-price" v-if="specs_name">（￥{{specs_price}}）</text></view>
			<text class="iconfont icon-gengduo-a specs-selected-three flex-row-item"></text>
		</view>
		<!-- 过渡高度 -->
		<view class="transition-height"></view>
		<!-- 拼团成功 -->
		<view class="group-success">
			<swiper class="group-swiper" vertical="true" circular="true" autoplay="true" interval="3000" duration="1000">
				<block v-for="(item, index) in 10">
					<swiper-item>
						<view class="group-success-item space-between">
							<view class="group-success-item-left space-between-item flex-row">
								<image class="group-head flex-row-item" :src="userInfo.head_img_url"></image>
								<view class="group-name flex-row-item">李易峰</view>
							</view>	
							<view class="group-success-item-right space-between-item">拼团成功！</view>
						</view>
					</swiper-item>
				</block>
			</swiper>
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
				<view class="btn-list" v-if="goodsInfo.is_specs == 1" @click="showSpecs">发起拼团</view>
				<view class="btn-list" v-else @click="showMessage">发起拼团</view>
			</view>
		</view>
		<!-- 遮罩层 -->
		<view class="shade" catchtouchmove="false" v-if="specs_show || city_show || message_show" @click="shadeHide"></view>
		<!-- 多规格 -->
		<view class="specs-fixed" catchtouchmove="false" v-if="specs_show">
			<view class="specs-fixed-goods flex-row">
				<view class="specs-goods-image flex-row-item">
					<image mode="widthFix" :src="base_url+goodsInfo.img_url"></image>
				</view>
				<view class="specs-goods-right flex-row-item">
					<view class="specs-goods-price">
						<text class="specs-goods-unit">￥</text>
						<text class="specs-goods-price-value">{{specs_price}}</text>
						<text class="specs-goods-ori-price">￥{{goodsInfo.ori_price}}</text>
					</view>
					<view class="specs-goods-multi">
						<text>已选：</text>
						<text class="specs-goods-multi-value">{{specs_name}}</text>
					</view>
					<text class="iconfont icon-guanbi1 specs-goods-hide" @click="shadeHide"></text>
				</view>
			</view>
			<view class="specs-fixed-multi">
				<view class="specs-fixed-multi-title">规格</view>
				<view class="specs-fixed-multi-list flex-row">
					<block v-for="(item, index) in goodsInfo.specsList">
						<view :class="[item.name == specs_name?'multi-list-item flex-row-item cur':'multi-list-item flex-row-item']" @click="selectSpecs(item.name,item.price)">{{item.name}}</view>
					</block>
				</view>
			</view>
			<view class="specs-buy-now" @click="showMessage">发起拼团</view>
		</view>
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
		<!-- 填写信息 -->
		<view class="message-fixed" catchtouchmove="false" v-if="message_show">
			<view class="message-fixed-content">
				<view class="message-fixed-title">填写信息</view>
				<view class="message-fixed-info">
					<view class="message-fixed-info-item">
						<input type="text" class="inp" @input="getInfo" data-type="name" :value="name" placeholder="请输入团长姓名" placeholder-class="tip"></input>
					</view>
					<view class="message-fixed-info-item">
						<input type="number" class="inp" @input="getInfo" data-type="phone" :value="phone" placeholder="请输入团长手机号" placeholder-class="tip"></input>
					</view>
					<view class="message-fixed-info-operation" @click="buy">发起拼团</view>
					<view class="message-fixed-info-operation message-fixed-info-cancel" @click="shadeHide">取消</view>
				</view>
			</view>
		</view>
		<!-- 分享海报 -->
		<view class="share-area" v-if="share_show">
			<view class="share-info">
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
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var cityInfo = "";
	var did = 0;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityInfo: [],//用户城市信息
				cityList: [],//城市列表
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
				share_img: '', //分享海报图片
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
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//用户城市信息
			cityInfo = uni.getStorageSync('cityInfo');
			if(cityInfo){
				that.cityInfo = cityInfo;
			}
			
			//获取城市列表
			that.getCityList();
			
			//页面携带参数
			var gid = options.id;
			that.gid = gid;
			
			//获取商品信息
			that.getGoodInfo();
			
			//分享朋友圈（小程序）
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		//分享好友（小程序）
		onShareAppMessage(res) {
			var that = this;
		    if (res.from === 'button') {// 来自页面内分享按钮
				//console.log(res.target)
		    }
			var gid = that.gid;
			var title = that.goodsInfo.name;
			var user_id = userInfo.id;
		    return {
				title: title,
				path: '/pages/store/goodsDetail/goodsDetail?id='+gid+'&user_id='+user_id
		    }
		},
		//分享朋友圈（小程序）
		onShareTimeline: function () {
		    var that = this;
		    var gid = that.gid;
		    var title = that.goodsInfo.name;
		    var user_id = userInfo.id;
		    return {
				title: title,
				query: {
					'id': gid,
					'user_id': user_id
				}
		    }
		},
		methods: {
			//获取商品信息
			getGoodInfo: function() {
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
						if(goodsData.is_specs == 1){
							that.specs_price = goodsData.assemble_price;
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
			
			//显示多规格
			showSpecs:function(){
				var that = this;
				that.specs_show = false;
				that.city_show = false;
				that.specs_show = true;
			},
			
			//选择多规格
			selectSpecs:function(specs_name,specs_price){
				var that = this;
				that.specs_name = specs_name;
				that.specs_price = specs_price;
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
			
			//显示填写信息
			showMessage:function(){
				var that = this;
				//判断商品多规格
				var is_specs = that.goodsInfo.is_specs;
				var specs_name = that.specs_name;
				var specs_price = that.specs_price;
				if(is_specs == 1 && specs_name == ""){
					uni.showModal({
						title: '提示',
						content: '请选择规格！',
						showCancel: false,
						confirmText: '确定',
						confirmColor: '#3056d1',
						success: function (res) {
							if (res.confirm) {} else if (res.cancel) {}
						}
					});
					return false;
				}
				that.specs_show = false;
				that.city_show = false;
				that.message_show = true;
			},
			
			//隐藏shade
			shadeHide:function(){
				var that = this;
				that.specs_show = false;
				that.city_show = false;
				that.message_show = false;
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
				}
			},
			
			//立即购买
			buy:function() {
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				};
				//获取商品信息
				var gid = that.goodsInfo.id;
				var goods_count = that.count;
				var good_price = that.goodsInfo.assemble_price;
				//判断商品多规格
				var is_specs = that.goodsInfo.is_specs;
				var specs_name = that.specs_name;
				var specs_price = that.specs_price;
				if(is_specs == 1){
					var good_price = that.specs_price;
					if(specs_name == ""){
						uni.showModal({
							title: '提示',
							content: '请选择规格！',
							showCancel: false,
							confirmText: '确定',
							confirmColor: '#3056d1',
							success: function (res) {
								if (res.confirm) {} else if (res.cancel) {}
							}
						});
						return false;
					}
				}
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
				//团长信息
				var name = that.name;
				var phone = that.phone;
				if(name == "" || phone == ""){
					uni.showToast({
						title: '填写团长信息！',
						icon: 'none',
						duration: 1500 
					})
					return false;
				}
				if(phone.length != 11){
					uni.showToast({
						title: '团长手机号格式不正确！',
						icon: 'none',
						duration: 1500 
					})
					return false;
				}
				//添加拼团信息
				var data = {
					user_id: userInfo.id,
					nick_name: userInfo.nick_name,
					head_img_url: userInfo.head_img_url,
					gid: gid,
					good_name: that.goodsInfo.name,
					good_price: good_price,
					good_is_specs: that.goodsInfo.is_specs,
					good_specs_name: that.specs_name,
					open_num: that.goodsInfo.team_num,
					residue_num: that.goodsInfo.team_num,
					city_id: city_id,
					city: city,
					name: name,
					phone: phone,
				};
				tools.httpClient('home/WxStore/addAssembleGroup',data, (error, res) => {
					if (res.errorCode == 0) { //获取商品分享码
						var group_id = res.data;
						//隐藏填写信息
						that.message_show = false;
						//提示购买
						uni.showModal({
							title: '提示',
							content: '拼团已发起，可前往购买!',
							cancelColor:'#666666',
							confirmText: '确定',
							confirmColor: '#3056d1',
							success (res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/assemble/confirmOrder/confirmOrder?gid=' + gid + '&count=' + goods_count + '&specs_name=' + specs_name + '&specs_price=' + specs_price+'&city_id='+city_id+'&city='+city+ '&group_id='+group_id,
									})
								}
							}
						})
					}
					else{
						uni.showToast({
							title:res.errorInfo,
							icon:'none',
							duration:2000
						})
					}
				})
			},
			
			//分享朋友圈(获取商品分享码)
			share: function() {
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				};
				var gid = that.gid;
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
												//绘制海报
												that.drawImg();
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
				var goodInfo = that.goodsInfo;//商品信息
				var goods_name = goodInfo.name;//商品名称
				var price = '￥' + goodInfo.assemble_price;//商品价格
				
				//白色背景色
				ctx.setFillStyle("#ffffff");
				ctx.fillRect(0, 0, 750, 1160); //白色背景大小
				
				//这里是把页面上的数据写入到画布里，具体的坐标需要各位自行调整
				ctx.drawImage(bg_img, 0, 0,750,1160);  //背景图
					
				//这里是把页面上的数据写入到画布里，具体的坐标需要各位自行调整
				var h = 750;
				ctx.drawImage(img_url, 0, 0,750,h);
				//商品名称
				if(goods_name.length > 12){
					var name_1 = goods_name.substring(0, 12);
				}
				else{
					var name_1 = goods_name;
				}
				ctx.setFontSize(30);
				ctx.setFillStyle('#000000');
				ctx.fillText(name_1, 30, h+80);
				if(goods_name.length > 12){
					var name_2 = goods_name.substring(12, goods_name.length);
					ctx.setFontSize(30);
					ctx.setFillStyle('#000000');
					ctx.fillText(name_2, 30, h+125);
				}
				
				//价格标签
				ctx.setFontSize(32);
				ctx.setFillStyle('#F72F50');
				if(goods_name.length > 12){
					ctx.fillText(price, 565, h+102);
				}
				else{
					ctx.fillText(price, 565, h+80);
				}
			
				//二维码
				ctx.drawImage(code_img, 540, h+190, 180, 180);
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
			
			//长按保存图片（公众号）
			savePublicImg:function(){
				var that = this;
				uni.showModal({
					title: '提示',
					content: '长按保存图片到相册！',
					showCancel: false,
					confirmText: '确定',
					confirmColor: '#3056d1',
					success (res) {
						if (res.confirm) {}
					}
				})
			},
				
			//关闭分享
			closeShare:function(){
				var that = this;
				that.share_show = false;
			},
			
			//分享（公众号）
			shareFriends:function(){
				var that = this;
				uni.showModal({
					title: '提示',
					content: '点击右上角进行分享！',
					showCancel: false,
					confirmText: '确定',
					confirmColor: '#3056d1',
					success (res) {
						if (res.confirm) {}
					}
				})
			},
			
		}
	}
</script>

<style>
	@import url("./goodDetail.css");
</style>
