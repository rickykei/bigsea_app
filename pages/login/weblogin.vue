<template>
	<view class="login-container" :style="'height: '+phoneHeight+'px;'">
		<view class="skip" @click="gotoPage('/pages/index/index')">Skip→</view>
		<view class="p-30-75" v-if="is_login==2">
			<view class="login_topbpx">
				<view class="login_tit">Register</view>
				<view class="login_top">hv account，<text class="red" @click="is_login=1">Login now</text></view>
			</view>
			<view class="group-bd">
				<view class="form-level d-s-c">

					<view class="val flex-1 input_botom"><input type="text" v-model="register.mobile"
							placeholder="Input Username" :disabled="is_send" /></view>
				</view>
				<view class="form-level d-s-c">
					<view class="val flex-1 input_botom"><input type="text" password="true" v-model="register.password"
							placeholder="Input password" /></view>
				</view>
				<view class="form-level d-s-c">
					<view class="val flex-1 input_botom"><input type="text" password="true"
							v-model="register.repassword" placeholder="Re Password" /></view>
				</view>
			</view>
		</view>
		<view class="p-30-75" v-if="is_login==1">
			<view class="login_topbpx">
				<view class="login_tit">Login</view>
				 
			</view>
			<view class="group-bd">
				<view class="form-level d-s-c">
					<view class="val flex-1 input_botom"><input type="text" v-model="formData.mobile"
							placeholder="Username" /></view>
				</view>
				<view class="form-level d-s-c" >
					<view class="val flex-1 input_botom"><input type="text" password="true" v-model="loging_password"
							placeholder="Password" /></view>
				</view>
				<view class="gray9">  </view>
			</view>
		</view>
		<view class="p-30-75" v-if="is_login==0">
			<view class="login_topbpx">
				<view class="login_tit">Reset Password</view>
				<view class="login_top"><text class="red" @click="is_login=1">Login Now</text></view>
			</view>
			<view class="group-bd">
				<view class="form-level d-s-c">
					<view class="val flex-1 input_botom"><input type="text" v-model="resetpassword.mobile"
							placeholder="Input Username" :disabled="is_send" /></view>
				</view>
				<view class="form-level d-s-c">
					<view class="val flex-1 input_botom"><input type="text" password="true"
							v-model="resetpassword.password" placeholder="Input Password" /></view>
				</view>
				<view class="form-level d-s-c">
					<view class="val flex-1 input_botom"><input type="text" password="true"
							v-model="resetpassword.repassword" placeholder="ReInput Password" /></view>
				</view>
			</view>
		</view>
		<view style="padding-top: 80rpx;" class="btns p-30-75" v-if="is_login==2"><button type="default"
				@click="registerSub">Register</button></view>
		<view style="padding-top: 80rpx;" class="btns p-30-75" v-if="is_login==1"><button type="default"
				@click="formSubmit">Login</button></view>
		<view style="padding-top: 80rpx;" class="btns p-30-75" v-if="is_login==0"><button type="default"
				@click="resetpasswordSub">Reset Password</button></view>

	</view>
</template>

<script>
	import {
		gotopage
	} from '@/common/gotopage.js';
	export default {
		data() {
			return {
				/*表单数据对象*/
				formData: {
					/*手机号*/
					mobile: '',
				},
				loging_password: '',
				register: {
					mobile: '',
					password: '',
					repassword: '',
				},
				resetpassword: {
					mobile: '',
					password: '',
					repassword: '',
				},
				/*是否已发验证码*/
				is_send: false,
				/*发送按钮文本*/
				send_btn_txt: '驗證碼',
				/*当前秒数*/
				second: 60,
				ip: '',
				isShow: true,
				is_login: 1,
				is_code: false,
				phoneHeight: 0,
			};
		},
		onLoad() {

		},
		onShow() {
			this.init()
		},
		methods: {
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
					}
				});
			},
			/*提交*/
			formSubmit() {
				let self = this;
				let formdata = {
					mobile: self.formData.mobile,
				}
				let url = ''
				if (!/\d{8}$/.test(self.formData.mobile)) {
					uni.showToast({
						title: '登入有錯！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				if (self.loging_password == '') {
					uni.showToast({
						title: '密碼不能為空！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				formdata.password = self.loging_password;
				url = 'user.useropen/phonelogin'

				uni.showLoading({
					title: '正在提交'
				});
				self._post(
					url,
					formdata,
					result => {
						// 记录token user_id
						uni.setStorageSync('token', result.data.token);
						uni.setStorageSync('user_id', result.data.user_id);
						// 执行回调函数
						 
						this.gotoPage('/pages/product/list/takeaway?orderType=takeout')
						// uni.navigateBack({
						//	delta: 2
						//});
					},
					false,
					() => {
						uni.hideLoading();
					}
				);
			},
			/*注册*/
			registerSub() {
				let self = this;
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.register.mobile)) {
					uni.showToast({
						title: 'Username Wrong,please refill！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				if (self.register.password.length < 6) {
					uni.showToast({
						title: 'password at least six characters！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				if (self.register.password !== self.register.repassword) {
					uni.showToast({
						title: 'password not same！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				self.register.invitation_id = uni.getStorageSync('invitation_id') || 0;
				self.register.referee_id = uni.getStorageSync('referee_id') || 0;
				uni.showLoading({
					title: '正在提交'
				});
				self._post(
					'user.useropen/register',
					self.register,
					result => {
						uni.showToast({
							title: '注册成功',
							duration: 3000
						})
						self.formData.mobile = self.register.mobile;
						self.register = {
							mobile: '',
							password: '',
							repassword: '',
						};
						self.second = 0;
						self.changeMsg();
						self.is_login = 1;
					},
					false,
					() => {
						uni.hideLoading();
					}
				);
			},
			resetpasswordSub() {
				let self = this;
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.resetpassword.mobile)) {
					uni.showToast({
						title: 'Wrong username format！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				if (self.resetpassword.password.length < 6) {
					uni.showToast({
						title: 'password at least six characters！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				if (self.resetpassword.password !== self.resetpassword.repassword) {
					uni.showToast({
						title: 'not same password！',
						duration: 2000,
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '正在提交'
				});
				self._post(
					'user.useropen/resetpassword',
					self.resetpassword,
					result => {
						uni.showToast({
							title: '重置成功',
							duration: 3000
						})
						self.formData.mobile = self.resetpassword.mobile;
						self.resetpassword = {
							mobile: '',
							password: '',
							repassword: '',
						};
						self.second = 0;
						self.changeMsg();
						self.is_login = 1;
					},
					false,
					() => {
						uni.hideLoading();
					}
				);
			},
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #FFFFFF;
	}

	.p-30-75 {
		padding: 30rpx 75rpx;
	}

	.p-0-75 {
		padding: 0 75rpx;
	}

	.t-r {
		text-align: right;
	}

	.login-container {
		position: relative;
		background: #ffffff;
	}

	.login-container input {
		height: 88rpx;
		line-height: 88rpx;
	}

	.wechatapp {
		padding: 80rpx 0 48rpx;
		border-bottom: 1rpx solid #e3e3e3;
		margin-bottom: 72rpx;
		text-align: center;
	}

	.wechatapp .header {
		width: 190rpx;
		height: 190rpx;
		border: 2px solid #fff;
		margin: 0rpx auto 0;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 1px 0px 5px rgba(50, 50, 50, 0.3);
	}

	.auth-title {
		color: #585858;
		font-size: 34rpx;
		margin-bottom: 40rpx;
	}

	.auth-subtitle {
		color: #888;
		margin-bottom: 88rpx;
		font-size: 28rpx;
	}

	.login-btn {
		padding: 0 20rpx;
	}

	.login-btn button {
		height: 88rpx;
		line-height: 88rpx;
		background: #04be01;
		color: #fff;
		font-size: 30rpx;
		border-radius: 999rpx;
		text-align: center;
	}

	.no-login-btn {
		margin-top: 20rpx;
		padding: 0 20rpx;
	}

	.no-login-btn button {
		height: 88rpx;
		line-height: 88rpx;
		background: #dfdfdf;
		color: #fff;
		font-size: 30rpx;
		border-radius: 999rpx;
		text-align: center;
	}

	.get-code-btn {
		width: 200rpx;
		height: 80rpx;
		line-height: 76rpx;
		padding: 0rpx 30rpx;
		border-radius: 40rpx;
		white-space: nowrap;
		// border: 1rpx solid $dominant-color;
		background-color: #FFFFFF;
		color: $dominant-color;
		font-size: 30rpx;
	}

	.get-code-btn[disabled='true'] {
		// border: 1rpx solid #cccccc;
		background-color: #FFFFFF;
	}
	.get-code-btn::after{
		display: none;
	}
	.btns button {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		border-radius: 45rpx;
		background: $dominant-color;
		color: #ffffff;
	}

	.login_topbpx {
		padding: 181rpx 0;
		padding-bottom: 110rpx;
	}

	.login_tit {
		font-size: 52rpx;
		font-weight: 600;
		margin-bottom: 33rpx;
	}

	.login_top {
		font-size: 24rpx;
		color: #adafb3;
	}

	.input_botom {
		border-bottom: 1px solid #f4f4f4;
	}

	.bottom_nav {
		width: 100%;
		position: absolute;
		bottom: 100rpx;
	}

	.bottom-box {
		width: 70%;
		margin: 0 auto;
	}

	.other_tit {
		height: 1rpx;
		background-color: #CACACA;
		width: 100%;
		line-height: 1rpx;
		text-align: center;
	}

	.weixin_box {
		background-color: #04BE01;
		border-radius: 50%;
		width: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.weixin_box .icon-weixin {
		font-size: 40rpx;
		color: #FFFFFF;
	}

	// .btns .bg-green{
	// 	background-color: #04BE01;
	// }
	.skip {
		position: absolute;
		top: 80rpx;
		right: 30rpx;
		font-size: 28rpx;
		color: #999999;
	}
</style>