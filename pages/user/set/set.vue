<template>
	<view class="address-form"  :data-theme='theme()' :class="theme() || ''">
		<view class="bg-white p-0-30 f30">
			<view class="d-b-c border-b p-30-0 info-item avatar">
				<text class="key-name">頭像</text>
				<!-- #ifndef MP-WEIXIN -->
				<view class="d-e-c" @click="changeAvatarUrl">
					<view class="info-image"><image :src="userInfo.avatarUrl || '/static/default.png'" mode=""></image></view>
					<text class="icon iconfont icon-jiantou"></text>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="d-e-c wxup">
					<view class="info-image">
						<button style="padding: 0;" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							<image :src="userInfo.avatarUrl || '/static/default.png'" mode=""></image>
						</button>
					</view>
					<text class="icon iconfont icon-jiantou"></text>
				</view>
				<!-- #endif -->
			</view>
			<view class="d-b-c p-30-0 border-b">
				<text class="key-name">會員ID</text>
				<view class="d-e-c">
					<text class="mr20">{{ userInfo.user_id }}</text>
				</view>
			</view>
			<view class="d-b-c p-30-0 border-b" @click="changeName('nickName')">
				<text class="key-name">名</text>
				<view class="d-e-c">
					<text class="mr20">{{ userInfo.nickName }}</text>
					<text class="icon iconfont icon-jiantou"></text>
				</view>
			</view>
			<view class="d-b-c p-30-0 border-b">
				<text class="key-name">手提電話</text>
				<view class="d-e-c" v-if="userInfo.mobile">
					<text class="mr20">{{ userInfo.mobile }}</text>
				</view>
				<view class="d-e-c" v-if="!userInfo.mobile"><text class="mr20">未绑定</text></view>
			</view>
			<view class="setup-btn theme-btn" @tap="logout()">退出登錄</view>
		</view>
		<!-- 修改资料 -->
		<Popup :show="isPopup" type="bottom" :width="750" :padding="0" @hidePopup="hidePopupFunc">
			<form @submit="subName">
				<view class="d-s-s d-c p20 mpservice-wrap">
					<view class="tc f32 fb ww100">修改</view>
					<template v-if="type == 'mobile' || type == 'nickName' || type == 'user_name' || type == 'email' || type == 'idcard'">
						<view class="pop-input d-b-c">
							<!-- #ifdef MP-WEIXIN -->
							<input name="newName" :type="type == 'nickName' ? 'nickname' : 'text'" class="flex-1" placeholder="請輸入" :value="newName" @input="changeinput" />
							<!-- #endif -->
							<!-- #ifndef MP-WEIXIN -->
							<input type="text" name="newName" class="flex-1" placeholder="請輸入" :value="newName" @input="changeinput" />
							<!-- #endif -->
							<view class="icon-guanbi icon iconfont" @click="clearName"></view>
						</view>
					</template>
					<view class="d-a-c ww100">
						<button class="theme-borderbtn" @click="hidePopupFunc">取消</button>
						<button class="theme-btn" form-type="submit">確認</button>
					</view>
				</view>
			</form>
		</Popup>
		<!-- 上传头像 -->
		<Upload v-if="isUpload" :num="1" @getImgs="getImgsFunc"></Upload>
	</view>
</template>

<script>
import Popup from '@/components/uni-popup.vue';
import Upload from '@/components/upload/upload.vue';
import { gotopage } from '@/common/gotopage.js';
export default {
	components: {
		Popup,
		Upload
	},
	data() {
		return {
			userInfo: {},
			isPopup: false,
			imageList: [],
			newName: '',
			type:'',
			isUpload:false
		};
	},
	onShow() {
		/*获取个人中心数据*/
		this.getData();
	},
	methods: {
		changeName(type) {
			let self = this;
			console.log(type)
			if (type == 'mobile') {
				self.oldmobile = self.userInfo.mobile;
			}
			self.type = type;
			self.newName = self.userInfo[type];
			self.isPopup = true;
		},
		onChooseAvatar(e) {
			let self = this;
			console.log(e);
			self.uploadFile([e.detail.avatarUrl]);
		},
		/*获取数据*/
		getData() {
			let self = this;
			uni.showLoading({
				title: '加载中'
			});
			self._get('user.index/setting', {}, function(res) {
				self.userInfo = res.data.userInfo;
				uni.hideLoading();
			});
		},
		/* 修改头像 */
		changeAvatarUrl() {
			let self = this;
			self.isUpload = true;
		},
		changeinput(e) {
			this.newName = e.target.value;
		},
		subName(e) {
			let self = this;
			if (self.loading) {
				return
			}
			self.newName = e.detail.value.newName;
			self.userInfo[self.type] = this.newName;
			self.update()
			
		},
		/*上传图片*/
		uploadFile: function(tempList) {
			let self = this;
			let i = 0;
			let img_length = tempList.length;
			let params = {
				token: uni.getStorageSync('token'),
				app_id: self.getAppId()
			};
			uni.showLoading({
				title: '图片上传中'
			});
			tempList.forEach(function(filePath, fileKey) {
				uni.uploadFile({
					url: self.websiteUrl + '/index.php?s=/api/file.upload/image',
					filePath: filePath,
					name: 'iFile',
					formData: params,
					success: function(res) {
						let result = typeof res.data === 'object' ? res.data : JSON.parse(res.data);
						if (result.code === 1) {
							self.imageList.push(result.data);
						} else {
							self.showError(result.msg);
						}
					},
					complete: function() {
						i++;
						if (img_length === i) {
							uni.hideLoading();
							// 所有文件上传完成
							self.getImgsFunc(self.imageList);
						}
					}
				});
			});
		},
		/*获取上传的图片*/
		getImgsFunc(e) {
			let self = this;
			if (e && typeof e != 'undefined') {
				let self = this;
				self.userInfo.avatarUrl = e[0].file_path;
				self.update();
				self.isUpload = false;
			}
		},
		hidePopupFunc() {
			this.isPopup = false;
		},
		fbindDateChange(e) {
			this.birthday = e.detail.value;
		},
		logout() {
			uni.removeStorageSync('token');
			uni.removeStorageSync('user_id');
			this.gotoPage('/pages/index/index');
		},
		Bindbirthday() {
			this.isBirthday = true;
		},
		update() {
			let self = this;
			if (self.loading) {
				return;
			}
			uni.showLoading({
				title: '加载中'
			});
			let params = self.userInfo;
			self.loading = true;
			self._post('user.user/updateInfo', params, function(res) {
				self.showSuccess(
					'修改成功',
					function() {
						self.loading = false;
						self.isPopup = false;
						uni.hideLoading();
						self.getData();
					},
					function(err) {
						uni.hideLoading();
						self.loading = false;
						self.isPopup = false;
					}
				);
			});
		}
	}
};
</script>

<style lang="scss">
.address-form .key-name {
	width: 200rpx;
}

.address-form .btn-red {
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, 0.6);
}

.setup-btn {
	position: fixed;
	bottom: 20rpx;
	left: 5%;
	width: 90%;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 80rpx;
	background-color: #fd3826;
	color: #fff;
	font-size: 30rpx;
	display: flex;
	justify-content: center;
	margin: 0 auto;
}
.make-item {
	height: 60rpx;
}
.pop-input {
	width: 100%;
	margin: 26rpx 0;
	box-sizing: border-box;
	border-bottom: 2rpx solid #d9d9d9;
	line-height: 60rpx;
}

.pop-input input {
	width: 100%;
	padding-left: 15rpx;

	font-size: 26rpx;
	color: #333333;
	margin: 16rpx 0;
	text-align: left;
	height: 60rpx;
	line-height: 60rpx;
}

.pop-input .icon.icon-guanbi {
	width: 38rpx;
	height: 38rpx;
	background-color: #999999;
	color: #ffffff;
	font-size: 22rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	opacity: 0.8;
}
.info-image {
	width: 112rpx;
	height: 112rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;

	image {
		width: 112rpx;
		height: 112rpx;
		border-radius: 10rpx;
	}
}
</style>
