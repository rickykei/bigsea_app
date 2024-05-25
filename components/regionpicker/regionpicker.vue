<template>
	<Popup :show="isRegion" :width="width" :height='height' :padding="0" @hidePopup="hidePopupFunc" type='bottom'>
		<view class="d-b-c time_picker"> 
			<view class="flex">
				<scroll-view style="height: 400rpx;" scroll-y="true">
				<ul>
					<li v-for="(item,index) in regions" :key='index'>
						<view @click="pickregion(item)" class="hours-active">
							{{item.shortname}} 
						</view>
					</li> 
				</ul>
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
				regions: [{shortname: '-----', value: 0}], 
				myregion: {}   
			 
			}
		},
		props: {isRegion:Boolean,selectedDistrict:Number }, 
		watch: {
			'isRegion': function(n, o) { 
				if (n != o) {
					//this.getData();
					this.getData();
				}
			},
			'selectedDistrict': function(n, o) { 
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
				let self = this; 
				let dataType = self.dataType;
				self._get('region.region/list', {
					pid: this.selectedDistrict
				}, function(res) {
					//self.listData = res.data.list;
					self.regions = res.data.list;
					self.loadding = false;
					uni.hideLoading();
				});
			},
		 
			/*关闭弹窗*/
			hidePopupFunc(e) {
				this.$emit('close', '');
			},
			pickregion(n) {
				this.myregion = n;
				this.$emit('close', this.myregion);
				  
			},
			 
			 

		}
	}
</script>
 
<style scoped lang="scss">
	.hours-active {
		background: #FFFFFF;
		color: #000000;
		 font-size: 4ex;
		 width: 180;
	}

	.hours {
		background-color: #f4f4f4;
		color: #666666;
		 width: 100%;
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
	
	ul{
		list-style: none;
		width:450px;
		margin: auto;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		
	}
	
	li{
		text-align: center;
		width: 150px;
		height: 60px;
		outline: 1px;
	}
</style>