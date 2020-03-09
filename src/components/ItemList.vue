<template>
  <div class="mt-5">
    <h1 class="text-center">
      <u>รายการสินค้า</u>
    </h1>
    <div class="row">
      <div class="">
        <div class="item-list-container">
          <div class="item-list-wrapper">
            <div class="item-list" v-for="item in items" :key="item.id">
              <div class="header">
								<span class="item-name">{{ item.name }}</span>
							</div>
              <div class="body">
                <img :src="picUrl + item.pic" alt />
              </div>
              <div class="footer">
                <div class="left">
                  <div class="price">
										<span>{{ item.price }} Coupon</span>
									</div>
                </div>
                <div class="right">
                  <div class="percent">
										<span> {{ item.red }} %</span>
									</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.item-list-wrapper {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  padding: 0 20px;
  padding-bottom: 35px;
  scrollbar-width: thin;
  justify-content: center;
}

.item-list {
  padding: 15px;
  background: #ffffff;
  text-align: center;
  cursor: pointer;
  flex: 0 0 auto;
  margin: 5px;
  transition: all 0.2s ease-in;
  display: flex;
  flex-direction: column;
  width: 210px;
  height: 240px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  color: #696969;
  box-shadow: 5px 8px 27px 3px rgb(0, 0, 0);

  .header {

		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		padding: 3px 0;
		background-color: #a60505;

		.item-name {
			color: white;
			font-weight: bold;
			// text-decoration: underline;
		}
  }

  .body {
    position: absolute;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;

		> img {
			width :100%;
			height: auto;
		}

  }

  .footer {
		position: absolute;
		width: 100%;
		bottom: 0px;
		left: 0;

		.left {
			position: absolute;
			left: 0;
			bottom: 0;
		}

		.right {
			position: absolute;
			right: 0;
			bottom: 0;
		}

		.percent {
			font-style: italic;
		}

		.price {
			width: 100%;
			padding: 0 16px;
			background-color: #333 ;
			color: white;
		}

  }
}
</style>
<script>
export default {
	props : ['items','picUrl']
}
</script>