<template>
	<Popup :show="isTimer" :width="width" :height='height' :padding="0" @hidePopup="hidePopupFunc" type='bottom'>
		<view class="d-b-c time_picker">
			<view class="" style="width: 40%;">
				<scroll-view style="height: 600rpx;" scroll-y="true">
					<template v-for="(item,index) in dates" :key='index'>
						<view  
							:class="pickdates&&item!=pickdates?'hours':'hours-active'" @click="pickH(item)">
							{{item }}
						</view>
					</template>

				</scroll-view>
			</view>
			<view class="flex-1">
				<scroll-view style="height: 600rpx;" scroll-y="true">
					<template v-for="(item,index) in ampm" :key='index'>
						<view
							class="hours-active"
							@click="picktime(pickdates+' '+item.value)">
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
				minute: [
					'10', '25', '40', '55',
				],
				dates:[  '2023-12-06','2023-12-08','2023-12-08','2023-12-08','2023-12-08','2023-12-08','2023-12-08','2023-12-08','2023-12-08','2023-12-08'],
				hours: [ 
					{
						start: '09',
						end: "12"
					},
					{
						start: '14',
						end: "18"
					},
					 
				],
				ampm:[{ label:'AM 09:00-12:00',value: '09:00'},{label: 'PM 14:00-18:00' ,value: '14:00' }],
				myDates: {
					 
				},
				myhours: '',
				myminute: '',
				pickhours: '',
				pickdates:'',
				mealtime: ''
			}
		},
		props: ['isTimer'],
		onShow() {

		},
		watch: {
			'isTimer': function(n, o) {
				if (n != o) {
					this.getData()
				}
			}
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				let myDate = new Date();
				let day = myDate.getDate().toString().padStart(2, "0");
				let month = (myDate.getMonth() + 1).toString().padStart(2, "0");
				let year = myDate.getFullYear().toString();
				
				self.dates.forEach((item, index) => {
				 	
				 	 day = myDate.getDate().toString().padStart(2, "0");
					 month = (myDate.getMonth()+1).toString().padStart(2, "0");
				 	 year = myDate.getFullYear().toString();
					 self.dates[index]=year+'-'+month+'-'+day; 
					 myDate.setDate(myDate.getDate()+1);
 
				})
			 this.pickH(self.dates[0]);
			},
			pickH(n) {
				this.pickdates = n;
			},
			/*关闭弹窗*/
			hidePopupFunc(e) {
				this.$emit('close', '');
			},
			picktime(n) {
				this.mealtime = n;
				this.$emit('close', this.mealtime);

			},
			inittime(n) {
				let time = n
				time = n * 1 - 1
				if (n <= 10) {
					return '0' + time
				} else {
					return time
				}
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
		font-size: 3ex;
	}

	.hours {
		background-color: #f4f4f4;
		color: #666666;
		font-size: 3ex;
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