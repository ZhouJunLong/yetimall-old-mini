<template>
	<view class="wrap">
		<view class="content">
			<u-parse :content="content" />
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
				content: '',//内容详情
			}
		},
		onLoad(options) {
			var that = this;
			
			//获取配置信息
			that.getConfigInfo();
		},
		methods: {
			//获取配置信息
			getConfigInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getConfigInfo', {}, (error, res) => {
					if (res.errorCode == 0) {
						var content = res.data.about_us;
						that.content = content;
					}
				})
			},
			
		}
	}
</script>

<style>
	@import url("./about.css");
</style>
