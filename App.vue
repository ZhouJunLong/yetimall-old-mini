<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./static/icon.wxss");
	/* 富文本解析css */
	@import url("/components/gaoyia-parse/parse.css");
	/* flex布局 */
	.flex-row{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.flex-row .flex-row-item{
		align-self: center;
	}
	.space-between{
		display: flex;
		justify-content: space-between;
	}
	.space-between .space-between-item{
		align-self: center;
		width: 48%;
	}
	.space-around{
		display: flex;
		justify-content: space-around;
	}
	.space-around .space-around-item{
		align-self: center;
	}
	/* button */
	button {
		background-color: #ffffff;
		border-radius:0;
		padding: 0;
		margin: 0;
		line-height: 1.2;
		color: #333333;
	}
	button::after {
		border: none;
	}
	/* 暂无数据 */
	.no-more{
	    width: 100%;
	    padding: 30rpx 0rpx;
	    text-align: center;
	    color: #999999;
	    font-size: 26rpx;
	}
	page{
		background-color: #f3f6f9;
	}
</style>
