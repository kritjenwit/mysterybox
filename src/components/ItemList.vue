<template>
  <div class="mt-5">
    <h1 class="text-center">
      <u>{{ $t('list_item') }}</u>
    </h1>
    <div class="row">
      <div class>
        <div class="item-list-container">
          <div class="item-list-wrapper">
            <div class="item-list" v-for="item in items" :key="item.id" @click="alertImage(item.id)">
              <div class="header">
                <span class="item-name">{{ item.name }}</span>
              </div>
              <div class="body" :class="{'super-rare' : item.price >=600}">
                <img :src="picUrl + item.pic" alt />
              </div>
              <div class="footer">
                <div class="left">
                  <div class="price">
                    <span>{{ item.price }} {{ $t('coupon') }}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="percent">
                    <span>{{ item.red }}%</span>
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
.text-center {
  color: #262626;
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
  box-shadow: 2px 4px 12px 1px black;

  .header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 3px 0;
    background: linear-gradient(-45deg, #f1935d 12%, #f33636 69%);

    .item-name {
      color: #2e322d;
      font-weight: bold;
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
    background: linear-gradient(-45deg, #fdcd4fab 12%, #f5f2ed 69%);

    > img {
      width: 100%;
      height: auto;
    }
  }

  .super-rare {
    background: linear-gradient(-45deg, #18a7fa 12%, #f8f8f8 69%);
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
      margin-right: 5px;
    }

    .price {
      width: 100%;
      padding: 0 16px;
      background: linear-gradient(-45deg, #ff9c62 12%, #f63737 69%);
      color: rgba(255, 255, 255, 0.99);
      clip-path: polygon(0 0, 95% 0, 100% 100%, 0% 100%);
    }
  }
}
</style>
<script>
import Toastify  from 'toastify-js';
import helper from './../assets/function'
export default {
  data() {
    return {
     
    }
  },
  props: ["items", "picUrl"],
  methods : {
    alertImage(id) {
      Toastify({
        avatar : 'http://mlive.in.th/event/rank_pic/fishprawncrab_o.png',
        text: 'Something Here',
        duration: 1500, 
        close: true,
        gravity: "bottom", 
        position: 'right', 
        backgroundColor: "background-image: linear-gradient(to right, #d91111, #ed390c);",
        stopOnFocus: true, 
      }).showToast();
    }
  },
};
</script>