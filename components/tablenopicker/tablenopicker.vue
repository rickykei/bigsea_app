<template>
	<Popup :show="isTableNo" :width="width" :height='height' :padding="0" @hidePopup="hidePopupFunc" type='bottom'>
		<view class="d-b-c time_picker"> 
			<view class="flex-1">
				<scroll-view style="height: 300rpx;" scroll-y="true">
					<template v-for="(item,index) in tablenos" :key='index'>
						<view @click="picktableno(item)" class="hours-active">
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
				tablenos: [{label:'YR897',id:'YR897'},{label:'YG5976',id:'YG5976'},{label:'自提',id:'selfpick'}],
				mytableno: 'YR897'  
			 
			}
		},
		props: ['isTableNo'], 
		watch: {
			'isTableNo': function(n, o) { 
				if (n != o) {
					//this.getData();
					this.getData();
				}
			},
			'selectedTableNo': function(n, o) { 
				//if old value same as new value , no need to call api get data
				if (n != o) {
					this.getData();
					//call api to get districts json; 
				}
			} 
		 
		},
		methods: {
			/*获取数据*/
			getData() {
				  
					self.tablenos = [{label:'YR897',id:'YR897'},{label:'YG5976',id:'YG5976'},{label:'自提',id:'PICK'}];
					self.loadding = false;
					uni.hideLoading();
				 
			},
		 
			/*关闭弹窗*/
			hidePopupFunc(e) {
				this.$emit('close', '');
			},
			picktableno(n) {
				this.mytableno = n;
				this.$emit('close', this.mytableno);
				  
			},
			 
			 

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