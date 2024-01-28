<template>
	<Popup :show="isDistrict" :width="width" :height='height' :padding="0" @hidePopup="hidePopupFunc" type='bottom'>
		<view class="d-b-c time_picker">
		 
			<view class="flex-1">
				<scroll-view style="height: 300rpx;" scroll-y="true">
					<template v-for="(item,index) in districts" :key='index'>
						<view @click="pickdistrict(item)" class="hours-active">
							{{item.label}} 
						</view>
					</template> 
				</scroll-view>
			</view>
		</view>

	</Popup>
</template>

<script>
	import Popup from '@/components/uni-popup.vue';
	export default {
		components: {
			Popup
		},
		data() {
			return {
				/*宽度*/
				width: 750,
				height: 600,
				/*数据对象*/
				dataModel: {},
				districts: [
					{label:"香港",id:2},{label: "九龍",id:3}, {label:"新界",id:4},
				], 
				mydistrict: []
			}
		},
		props: ['isDistrict'],
		onShow() {

		},
		watch: {
			'isDistrict': function(n, o) {
				 
				if (n != o) {
					this.getData()
				}
			}
			 
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this; 
			},
		 
			/*关闭弹窗*/
			hidePopupFunc(e) {
				this.$emit('close', '');
			},
			pickdistrict(n) {
				this.mydistrict = n;
				this.$emit('close', this.mydistrict); 
			},
			 
			/*复制*/
			copyQQ(message) {
				var input = document.createElement("input");
				input.value = message;
				document.body.appendChild(input);
				input.select();
				input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
				document.body.removeChild(input);
				uni.showToast({
					title: '复制成功',
					icon: 'success',
					mask: true,
					duration: 2000
				});
			}

		}
	}
</script>

<style scoped lang="scss">
	.hours-active {
		background: #FFFFFF;
		color: #000000;
		font-size: 4ex;
	}

	.hours {
		background-color: #f4f4f4;
		color: #666666;
	}

	.mpservice-wrap .mp-image {
		width: 560rpx;
		margin-top: 40rpx;
	}

	.mpservice-wrap .mp-image image {
		width: 100%;
	}

	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}

	.time_picker {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #ffffff;
	}
</style>