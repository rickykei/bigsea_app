<template>
	<view v-if="!loadding" :data-theme='theme()' :class="theme() || ''">
		<view v-if="listData.length>0" class="pbenv">
			<view class="address-list bg-white">
				<view class="address p-30-0 border-b-d" v-for="(item,index) in listData" :key="index">
					<view class="info flex-1 mb10">
						<view class="user f36 d-b-c">
							<text>{{item.nickName}}</text>
							<text class="ml20 gray9 f36">Tel:{{item.phone}}</text>
						</view>
						<view class="pt20 f36 gray3">
							<text>{{item.name}}</text>
						</view>
						<view class="pt20 f36 gray3">
							{{item.detail}}{{item.address}}
						</view>
					</view>
					<view class="d-b-c">
						<view class="gray9 d-b-c"><text> </text></view>
						
						<view class="d-s-c">
							 <view class="icon-box plus d-c-c ml30" @click="radioChange(item.address_id)">
							 	<text class="gray9 ml10 f36">顧客編號:{{item.user_id}}</text>
							 </view>
							 <view class="none_line ml30"></view> 
							<view class="icon-box plus d-c-c ml30 mr40" @click="radioChange(item.address_id)">
								<image class="add_icon_img" src="/static/icon/edit.png" mode="aspectFill"></image>
								<text class="gray9 ml10 f36">選擇</text>
							</view>
						</view>
					</view>
				 
				</view>
			</view>
		 
		</view>
		<view v-else>
			<view class="none_add">
				<image class="no_add" src="../../../static/no_adress.png" mode="aspectFill"></image>
			</view>
			<view class="no_add_add red-btn" @click="addAddress()">新增收货地址</view>
			<view class="no_add_add gray-btn" @click="gotoPage('/pages/index/index')">返回首页</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*数据*/
				listData: [],
				/*默认地址id*/
				default_id: '0',
				options: {}
			}
		},
		onLoad: function(options) {
			this.options = options;
		},
		onShow: function() {
			uni.showLoading({
				title: '加载中'
			});
			/*获取地址列表*/
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				let dataType = self.dataType;
				self._get('user.address/list', {
					shop_supplier_id: self.options.shop_supplier_id,
					region_id: self.options.myregion,
					cust_id: self.options.cust_id
				}, function(res) {
					self.listData = res.data.list;
					self.default_id = res.data.default_id + '';
					 
					self.loadding = false;
					uni.hideLoading();
				});
			},

			/*跳转页面*/
			addAddress() {
				let delta = 1;
				if (this.options.source === 'order') {
					delta = 2;
				}
				uni.navigateTo({
					url: '/pages/user/address/add/add?delta=' + delta
				});
			},

			/*点击单选*/
			radioChange(e) {
				let self = this;
				self.default_id = e;
				 self._post('user.address/setDefault',{address_id: e,}, function(res) {
					
					// #ifndef H5
					uni.navigateBack();
					// #endif
					// #ifdef H5
					history.go(-1);
					// #endif
					 
					self.$fire.fire('takeout', true)
				}); 
				 
				return false;

			},

			/*编辑地址*/
			editAddress(e) {
				uni.navigateTo({
					url: '/pages/user/address/edit/edit?address_id=' + e,
				});
			},

			/*删除地址*/
			delAddress(e) {
				let self = this;
				uni.showModal({
					title: "提示",
					content: "您确定要移除当前收货地址吗?",
					success: function(o) {
						o.confirm && self._get('user.address/delete', {
							address_id: e
						}, function(result) {
							if (result.code == 1) {
								uni.showToast({
									title: '删除成功',
									duration: 2000
								});
								self.getData();
							}

						});
					}
				});

			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.address-list {
		border-top: 16rpx solid #F2F2F2;
		padding: 0 20rpx;
		padding-bottom: 90rpx;
	}

	.foot-btns {
		padding: 0;
	}

	.foot-btns .btn-red {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 0;
	}

	.none_add {
		padding: 314rpx 214rpx 60rpx 214rpx;
	}

	.no_add {
		width: 322rpx;
		height: 180rpx;
	}

	.no_add_add {
		width: 320rpx;
		height: 80rpx;
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		border: 2rpx solid;
		margin: 0 auto;
		margin-bottom: 20rpx;
	}

	.gray-btn {
		color: #666666;
		border-color: #666666;
	}

	.red-btn {
		@include font_color('font_color');
		@include border_color('border_color');
	}

	.add_add {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #0777CD;
		padding: 0 35rpx;
		border-bottom: 1rpx solid #D9D9D9;
	}

	.defaul_add {
		padding: 9rpx 14rpx 10rpx 15rpx;
		background: #FFE7E4;
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #F6220C;
		@include font_color('font_color');
	}

	.add_icon_img {
		width: 30rpx;
		height: 30rpx;
	}

	.none_line {
		width: 1rpx;
		height: 44rpx;
		background: #D9D9D9;
	}

	.add_add-btn{
		position: fixed;
		bottom: calc(env(safe-area-inset-bottom) + 20rpx);
		width:710rpx;
		margin: 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		height: 80rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.pbenv{
		padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
		box-sizing: border-box;
	}
</style>
