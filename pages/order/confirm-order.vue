<template>
	<view :data-theme="theme()" :class="theme() || ''">
		<view class="wrap" v-if="!loading">
			<view class="right" v-if="cart_type == 0">
				<template v-for="(item, index) in delivery_set" :key="index+'1'">
					<view class="takeout" v-if="item == '10'" :class="tab_type == 0 ? 'active' : ''"
						@click="tabFunc(0)">
						<text>配送訂單</text>
					</view>
				</template>
				<template v-for="(item, index) in delivery_set" :key="index+'2'">
					<view class="dinein" v-if="item == '20'" :class="tab_type == 1 ? 'active' : ''" @click="tabFunc(1)">
						<text>店內訂單</text>
					</view>
				</template>
			</view>
			<view class="right" v-if="cart_type == 1">
				<template v-for="(item, index) in store_set" :key="item">
					<view class="takeout" v-if="item == '30'"
						:class="tab_type == 3 ? 'active' : ''" @click="tabFunc(3)">
						<text>打包訂單</text>
					</view>
				</template>
				<template v-for="(item, index) in store_set" :key="item">
					<view class="dinein" v-if="item == '40'" :class="tab_type == 4 ? 'active' : ''" @click="tabFunc(4)">
						<text>店內訂單</text>
					</view>
				</template>
			</view>
			<br>
			<view class="meal_item">
				<view class="d-b-c item">
					  <view class="mr20 f36">會員編號：</view>
						<input class="flex-1 f36" type="text" v-model="cust_id" placeholder="請輸入會員編號" />  
				</view> 
			</view>
			<view class="d-b-c meal_item" @click="districtpick()" v-if="tab_type == 0 && delivery == 10">
				<view class="f36">港九：</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left f36 fb">
							<text class="blue">{{ mydistrict.label }}</text>
							<text class="icon iconfont icon-jiantou"></text>
						</view>
					</view>
				</view>
			</view>
			<view class="d-b-c meal_item" @click="regionpick()" v-if="tab_type == 0 && delivery == 10">
				<view class="f36">區：</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left f36 fb">
							<text class="blue">{{ myregion.shortname }}</text>
							<text class="icon iconfont icon-jiantou"></text>
						</view>
					</view>
				</view>
			</view>
			<view class="header" v-if="cart_type == 0">
				<view class="headr_top">
					<view class="flex-1" style="width: 100%;" v-if="tab_type != 1">
						<view class="left overflow-hidden">
							<view class="overflow-hidden f36 fb w-b-a" style="width: 600rpx;"
								@click="gotoPage('/pages/user/address/selectaddress?shop_supplier_id=' + options.shop_supplier_id+'&myregion='+this.myregion.id+'&cust_id='+this.cust_id)">
								<template v-if="Address != null">
									{{  Address.address  }}
								</template>
								<template v-else>
									請選擇配送地址
								</template>
							</view>
						</view>
					</view>
					<view class="header_bottom" v-if="tab_type == 1">
						<view class="uni-list-cell-left f36 fb"><input type="number" v-model="phone"
								placeholder="請輸入聯系電話" /></view>
					</view>
				</view>
			</view> 
			<view class="meal_item">
				<view class="d-b-c item">
					<view class="mr20 f36">公司名:</view>
					<input class="flex-2 f36" type="text" v-model="name" placeholder="" /> 
				</view>
			</view>
			<view class="meal_item">
				<view class="d-b-c item ">
					<view class="mr10 f36">聯絡人:</view>
				<input class="flex-2 f36" type="text" v-model="contact_person" placeholder="" /> 
				</view>
			</view>
			<view class="meal_item">
				<view class="d-b-c item">
					<view class="mr10 f36">收貨電話:</view>
						<input class="flex-1 f36" type="text" v-model="phone" placeholder="請輸入會員編號" /> 
				</view>
			</view>
			<view class="d-b-c meal_item" @click="tableNoPick()" v-if="tab_type == 0 && delivery == 10">
				<view class="f36">選車派送：</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left f36 fb">
							<text class="blue">{{ mytableno.label }}</text>
							<text class="icon iconfont icon-jiantou"></text>
						</view>
					</view>
				</view>
			</view>
			<view class="d-b-c meal_item" @click="timepick()" v-if="tab_type == 0 && delivery != 10">
				<view class="f36">送貨時間</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left f28 ">
							<text class="f32 fb ">{{ mealtime }}</text>
							<text class="icon iconfont icon-jiantou"></text>
						</view>
					</view>
				</view>
			</view>
			<view class="d-b-c meal_item" v-if="tab_type == 1 && delivery != 10">
				<view class="f36">預計取貨時間</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left f28 ">
							<text class="f32 fb ">{{ estitime }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="d-b-c meal_item" @click="timepick()" v-if="tab_type == 0 && delivery == 10">
				<view class="f36">預計送達時間：</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left f28 ">
							<text class="blue">{{ wmtime }}</text>
							<text class="icon iconfont icon-jiantou"></text>
						</view>
					</view>
				</view>
			</view>

			<!--购买的产品-->
			<view class="vender">
				<view class="left">
					<view class="store-name">
						<text>{{ supplier.name }}</text>
					</view>
				</view>
				<view class="list">
					<view class="item d-b-c" v-for="(item, index) in ProductData" :key="index">
						<view class="info d-s-s">
							<view class="cover">
								<image :src="item.image.file_path" mode="aspectFill"></image>
							</view>
							<view class="flex-1">
								<view class="title f32 fb mb16">{{ item.product.product_name }}</view>
								<view class="num-wrap pl-30 gray9 f32">{{ item.describe }}</view>
								<view class="f32 gray9">×{{ item.product_num }}</view>
							</view>
						</view>
						<view class="" style="height: 148rpx;text-align: right;">
							<view class="f32 order_item mb16">${{ item.price }}</view>
							<view class="f32 text-d-line gray9 mb16">${{ item.product_price }}</view>
						</view>
					</view>
				</view>
				<!--总数-->

				<view class="other_box">
					<view class="item">
						<text class="key">商品小計：</text>
						<text class="f32">${{ OrderData.order_total_price }}</text>
					</view>
					<view class="item" v-if="tab_type != 1 && OrderData.express_price != 0">
						<text class="key">配送費用：</text>
						<text class="f32">${{ OrderData.express_price }}</text>
					</view>
					<view class="item">
						<text class="key">包裝費用：</text>
						<text class="f32">${{ OrderData.order_bag_price }}</text>
					</view>
					<view class="item" v-if="OrderData.reduce">
						<text class="key">滿減({{ OrderData.reduce.active_name }})：</text>
						<text class="f32">-${{ OrderData.reduce.reduced_price }}</text>
					</view>
					<view class="item" v-if="OrderData.table_no">
						<text class="key">桌號：</text>
						<text class="f32">{{ OrderData.table_no }}</text>
					</view>
				</view>
				<view class="total-box">
					共{{ OrderData.order_total_num }}件商品 小計
					<text class="f32 fb ml15">${{ OrderData.order_pay_price }}</text>
				</view>
			</view>
			<view class="meal_item">
				<view class="d-b-c item">
					<view class="mr20 f32">備注:</view>
					<input class="flex-1 f32" type="text" v-model="remark" placeholder="請填寫您的其他要求" />
				</view>
			</view>
			<!--底部支付-->
			<view class="foot-pay-btns">
				<view class="price" v-if="!OrderData.force_points">
					$
					<text class="num">{{ OrderData.order_pay_price }}</text>
				</view>
				<button class="theme-bg" type="primary" @click="SubmitOrder">提交訂單</button>
			</view>
			<timepicker :isTimer="isTimer" @close="closetimer"></timepicker>
			<regionpicker :isRegion="isRegion" :selectedDistrict="selectedDistrict"  @close="closeregion"></regionpicker>
			<districtpicker :isDistrict="isDistrict" @close="closedistrict"></districtpicker>
			<tablenopicker :isTableNo="isTableNo" @close="closeTableNo"></tablenopicker>
		</view>
	</view>
</template>

<script>
	import timepicker from '@/components/timepicker/timepicker';
	import regionpicker from '@/components/regionpicker/regionpicker';
	import districtpicker from '@/components/districtpicker/districtpicker';
	import tablenopicker from '@/components/tablenopicker/tablenopicker'; 
	import {
		pay
	} from '@/common/pay.js';
	export default {
		components: {
			timepicker,
			districtpicker,
			regionpicker,
			tablenopicker,
		},
		data() { 
			return {
				/*是否加载完成*/
				loading: true,
				options: {},
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				tab_type: 0,
				/*商品id*/
				product_id: '',
				/*商品数量*/
				product_num: '',
				/*商品数据*/
				ProductData: [],
				/*订单数据数据*/
				OrderData: [],
				// 是否存在收货地址
				exist_address: false,
				/*默认地址*/
				Address: {
					region: []
				},
				
				extract_store: {},
				last_extract: {},
				product_sku_id: 0,
				/*配送方式*/
				/* 10配送20自提30打包40店内 */
				delivery: 0,
				/*自提店id*/
				store_id: 1,
				linkman: '',
				phone: '',
				 
				remark: '',
				deliverySetting: [],
				/*消息模板*/
				temlIds: [],
				/*是否显示支付宝支付，只有在h5，非微信内打开才显示*/
				showAlipay: false,
				takeout_address: {},
				isTimer: false,
				isRegion:false,
				isDistrict:false,
				isTableNo:false,
				selectedDistrict: 0,
				selectedShopSupplierId: 0, 
				mealtime: '',
				myregion: {label:'',id:0},
				mydistrict: {label:'',id:0},
				mytableno: {label:'YR897',id:'YR897'},
				cust_id:'',
				cust_name: '',
				wmtime: '',
				estitime: '',
				is_pack: 1,
				supplier: {},
				dinner_type: 10,
				cart_type: 0,
				store_set: [],
				delivery_set: [],
				table_id: 0,
				min_money: 0
			};
		},
		onLoad(options) {
			
			let self = this;
			self.options = options;
			self.cart_type = options.cart_type;
			self.table_id = options.table_id || 0;
			self.dinner_type = options.dinner_type;
			self.delivery = options.delivery;
			
			this.getData();
			let myDate = new Date();
			self.mealtime=myDate.getFullYear().toString()+'-'+(myDate.getMonth()+1).toString().padStart(2, "0")+'-'+myDate.getDate().toString().padStart(2, "0")+' 09:00'; 
			self.wmtime=myDate.getFullYear().toString()+'-'+(myDate.getMonth()+1).toString().padStart(2, "0")+'-'+myDate.getDate().toString().padStart(2, "0")+' 09:00'; 
		},
		onShow() {
			this.$fire.on('takeout', function(e) {
				self.takeout_address = e;
				self.orderType = 'takeout';
			});
			this.getData();
		},
		methods: {
			/**/
			hasType(e) {
				if (this.deliverySetting.indexOf(e) != -1) {
					return true;
				} else {
					return false;
				}
			},
			changeTime(n) {},
			getTime(type) {
				let myDate = new Date();
				let day = myDate.getDate().toString().padStart(2, "0");
				const month = (myDate.getMonth() + 1)
				              .toString()
				              .padStart(2, "0");
				const year = myDate.getFullYear().toString();
				let myhours = myDate.getHours(); //获取当前小时数(0-23)
				if (myhours < 10) {
					myhours = '0' + myhours;
				}
				let myminute = myDate.getMinutes(); //获取当前分钟数(0-59)
				if (myminute < 10) {
					myminute = '0' + myminute;
				}
				let wmhours = myDate.getHours();
				let wmminute = myDate.getMinutes() + 15;
				if (wmminute >= 60) {
					wmminute = wmminute - 60;
					wmhours = wmhours + 1;
				}
				if (wmminute < 10) {
					wmminute = '0' + wmminute;
				}
				if (wmhours < 10) {
					wmhours = '0' + wmhours;
				}
				if (type == 'my') {
					return  year+'-'+month+'-'+day+' 09:00'; 
				} else if (type == 'wm') {
					return wmhours + ':' + wmminute;
				}
			},
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: '加载中'
				});
				self.loading = true;
				let callback = function(res) {
					self.OrderData = res.data.orderInfo;
					self.min_money = res.data.orderInfo.supplier.min_money;
					self.temlIds = res.data.template_arr;
					self.exist_address = self.OrderData.exist_address;
					if (self.Address!="")
					{
						
						self.Address = self.OrderData.address; 
						self.cust_id=self.OrderData.address.user_id;
						self.contact_person=self.OrderData.address.name;
						self.phone=self.OrderData.address.phone;
						self.name=res.data.nickName;
					}
					else
					self.Address=null;
					
					self.extract_store = self.OrderData.extract_store;
					self.last_extract = self.OrderData.last_extract;
					self.ProductData = self.OrderData.product_list;
					self.supplier = res.data.orderInfo.supplier;
					//self.linkman = res.data.orderInfo.last_extract.linkman;
					//self.phone = res.data.orderInfo.last_extract.phone;
					self.delivery_set = res.data.orderInfo.supplier.delivery_set;
					self.store_set = res.data.orderInfo.supplier.store_set;
					if (self.OrderData.delivery == '10') {
						self.tab_type = 0;
					}
					if (self.OrderData.delivery == '20') {
						self.tab_type = 1;
					}
					if (self.OrderData.delivery == '30') {
						self.tab_type = 3;
					}
					if (self.OrderData.delivery == '40') {
						self.tab_type = 4;
					}
					if (self.cart_type == 0) {
						if (self.delivery_set.indexOf(self.delivery) == -1) {
							if (self.delivery_set[0] == '10') {
								console.log('執行');
								self.tabFunc(0, true);
							} else {
								self.tabFunc(1, true);
							}
						}
					} else {
						if (self.store_set.indexOf(self.delivery) == -1) {
							if (self.store_set[0] == '30') {
								self.tabFunc(3, true);
							} else {
								self.tabFunc(4, true);
							}
						}
					}
				 
					//self.wmtime = self.getTime('wm');
					//self.mealtime = self.getTime('my');
					self.estitime = self.getTime('wm');
					self.deliverySetting = self.OrderData.deliverySetting;
					self.loading = false;
				};

				// 请求的参数
				let params = {
					delivery: self.delivery || 0,
					store_id: 1,
					mealtime: '',
					mydistrict: '',
					myregion: '',
					pay_source: self.getPlatform()
				};
				if(self.table_id){
					params.table_id = self.table_id
				}
				//直接购买
				if (self.options.order_type === 'buy') {
					self._get(
						'order.order/buy',
						Object.assign({}, params, {
							product_id: self.options.product_id,
							product_num: self.options.product_num,
							product_sku_id: self.options.product_sku_id
						}),
						function(res) {
							callback(res);
						}
					);
				}
				// 购物车结算
				else if (self.options.order_type === 'cart') {
					self._get(
						'order.order/cart',
						Object.assign({}, params, {
							cart_ids: self.options.cart_ids || 0,
							shop_supplier_id: self.options.shop_supplier_id || 0,
							order_type: self.options.cart_type,
							table_id: self.table_id 
						}),
						function(res) {
							callback(res);
						},
						function(err) {
							if (self.tab_type == 1) {
								self.tabFunc(0);
							} else if (self.tab_type == 0) {
								self.tabFunc(1);
							}
						}
					);
				}
			},

			/*选择配送方式*/
			tabFunc(e, flag) {
				if (e == 0) {
					if (this.min_money * 1 > this.OrderData.order_pay_price * 1) {
						this.showError('未满足最低配送费用!');
						return;
					}
				}
				/* 0外卖 1自取  3打包 4店内 */
				this.tab_type = e;
				if (e == 0) {
					this.delivery = '10';
					this.dinner_type = 10;
				} else if (e == 1) {
					this.delivery = '20';
					this.dinner_type = 20;
				} else if (e == 3) {
					this.delivery = '30';
					this.dinner_type = 30;
				} else if (e == 4) {
					this.delivery = '40';
					this.dinner_type = 30;
				}
				if (!flag) {
					console.log('切换');
					this.getData();
				}
			},

			/*提交订单*/
			SubmitOrder() {
				let self = this;
				if (this.loading) {
					return;
				}

				let _linkman = null;
				let _phone = null;
				if (self.$refs != null) {
					if (self.$refs.getShopinfoData != null) {
						_phone = self.$refs.getShopinfoData.phone;
						_linkman = self.$refs.getShopinfoData.linkman;
					}
				}

				//check value
				if (this.wmtime==''){
					this.showError('未選送貨時間!');
					return
				}
				if (this.mytableno.id==''){
					this.showError('未選車!');
					return
				}
				
				let params = {
					delivery: self.delivery,
					store_id: 1,
					linkman: self.linkman,
					phone: self.phone,
					remark: self.remark,
					mealtime: self.mealtime,
					mydistrict: self.mydistrict,
					myregion: self.myregion,
					mytableno: self.mytableno.id,
					shop_supplier_id: self.options.shop_supplier_id,
					pay_source: self.getPlatform(),
					cust_id: self.cust_id
				};
				if (self.delivery == 10) {
					params.mealtime = self.wmtime;
				}
				if (self.tab_type == 1 && self.delivery != 10) {
					params.mealtime = self.getTime('my');
				}

				// 创建订单-直接下单
				let url = '';
				if (self.options.order_type === 'buy') {
					url = 'order.order/buy';
					params = Object.assign(params, {
						product_id: self.options.product_id,
						product_num: self.options.product_num,
						product_sku_id: self.options.product_sku_id
					});
				}

				// 创建订单-购物车结算
				if (self.options.order_type === 'cart') {
					url = 'order.order/cart';
					params = Object.assign(params, {
						cart_ids: self.options.cart_ids || 0,
						dinner_type: self.dinner_type,
						shop_supplier_id: self.options.shop_supplier_id || 0,
						order_type: self.options.cart_type,
						table_id: self.table_id
					});
				}
				let callback = function() {
					self.loading = true;
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					self._post(
						url,
						params,
						function(result) {
							//let pages = '/pages/order/cashier?order_type=10&order_id=' + result.data.order_id;
							let pages = '/pages/product/list/takeaway?orderType=takeout'
							self.gotoPage(pages, 'reLaunch');
						},
						err => {
							self.loading = false;
						}
					);
				};

				self.subMessage(self.temlIds, callback);
			},
			timepick() {
				this.isTimer = true;
			},
			regionpick() {
				this.isRegion = true;
				this.selectedDistrict=this.mydistrict.id;
				 
			},
			districtpick() {
				this.isDistrict = true; 
			},
			tableNoPick() {
				this.isTableNo = true; 
			},
			closetimer(e) {
				if (e != '') {
					this.wmtime = e;
					this.mealtime = e;
				}
				this.isTimer = false;
			},
			closedistrict(e) {
				if (e != '') {
					this.mydistrict = e;
					 
				}
				this.isDistrict = false;
			},
			closeregion(e) {
				if (e != '') {
					this.myregion = e;
					 
				}
				this.isRegion = false;
			},
			closeTableNo(e) {
				if (e != '') {
					this.mytableno = e;
					 
				}
				this.isTableNo = false;
			},
			packTypeFunc(n) {
				this.is_pack = n;
			}
		}
	};
</script>

<style lang="scss">
	.headr_top {
		height: 140rpx;
	}

	.header {
		width: 100%;
		box-sizing: border-box;
		padding: 35rpx;
		background-color: #ffffff;
		// box-shadow: 0 0 0.06rem 0 rgba(0, 0, 0, 0.1);
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		z-index: 20;
	}

	.left {
		flex: 1;
		display: flex;
		flex-direction: column;

		.store-name {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size: 26rpx;
			margin-bottom: 30rpx;

			.iconfont {
				margin-left: 10rpx;
				line-height: 100%;
			}
		}

		.store-location {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			color: $text-color-assist;
			font-size: $font-size-sm;

			.iconfont {
				vertical-align: middle;
				display: table-cell;
				color: $color-primary;
				line-height: 100%;
			}
		}
	}

	.wrap {
		padding: 25rpx;
		padding-bottom: 140rpx;
		@include background_linear('background_color', 'opacify_background_0', 180deg, 0, 100%);
	}

	.icon-box .icon-zhifubao {
		color: #1296db;
		font-size: 50rpx;
	}

	.order_item {
		width: 150rpx;
		text-align: right;
	}

	.other_box {
		border-radius: 0;
		box-shadow: 0;
	}

	.other_box .item {
		height: 88rpx;
		box-sizing: border-box;
		line-height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #eeeeee;
	}

	.header_bitem {}

	.f-r {
		float: right;
	}

	.meal_item {
		margin: 26rpx 0;
		height: 96rpx;
		line-height: 96rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding-left: 42rpx;
		padding-right: 30rpx;

		.icon-jiantou {
			font-size: 22rpx;
			margin-left: 26rpx;
		}
	}

	.pack_item {
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	.pack_item.active .icon-xuanze {
		@include font_color('font_color');
	}

	.right {
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		font-size: 32rpx;
		font-weight: bold;
		color: #282828;
		height: 68rpx;
		width: 100%;
		position: relative;
		margin-top: 34rpx;

		.dinein,
		.takeout {
			position: relative;
			display: flex;
			align-items: flex-start;
			width: 344rpx;
			height: 150rpx;
			box-sizing: border-box;
			padding-top: 25rpx;
			position: absolute;
			z-index: 0;
			top: -18rpx;
			background-color: #ffffff60;

			&.active {
				z-index: 1;
				width: 490rpx;
				height: 150rpx;
				@include font_color('font_color');
				background-color: #ffffff !important;
				flex-shrink: 0;
			}
		}

		.takeout {
			justify-content: flex-start;

			padding-left: 78rpx;
			left: 0;
			border-top-left-radius: 30rpx;

			&.active {
				padding-left: 153rpx;
				border-top-right-radius: 150rpx;
				border-top-left-radius: 30rpx;
			}
		}

		.dinein {
			right: 0;
			justify-content: flex-end;
			padding-right: 65rpx;
			border-top-right-radius: 30rpx;

			&.active {
				padding-right: 150rpx;
				border-top-left-radius: 150rpx;
				border-top-right-radius: 30rpx;
			}
		}
	}

	.foot-pay-btns button {
		padding: 0 50rpx;
		height: 84rpx;
		line-height: 84rpx;
		border-radius: 50rpx;
	}
</style>