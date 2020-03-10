<template>
  <div :id="'box' + boxId">
    <div>
      <h1 class="text-center animated slideInDown fast">
        <u>BOX {{ boxId }}</u>
      </h1>
    </div>
    <div class="spin" >
      <div class="spin-pointer">
        <div class="arrow-container">
          <i class="fa fa-arrow-down fa-2x" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="spinner-container animated fadeInDownBig delay-1s	">
      <div class="spinner-wrapper">
        <div class="spinner-stack">
          <div class="spinner">
            <div class="spinner-centered" style="width: 800px;">
              <div class="spinner-direction" style="position:absolute;left: 0px;display: none;"></div>
              <div class="spinner-row " id="spinner">
                <div
                  class="spinner-item"
                  style=" width: 200px; height: 150px; display: inline-block;"
                  v-for="item in items"
                  :key="item.hashId"
									:id="item.hashId"
                  :data-itemid="item.itemId"
                  :data-key="item.no"
                >
                  <div class="spinner-image spinner-item-img">
                    <img
                      :src="picUrl + item.pic"
                      :alt="item.name"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center mt-3 animated fadeInUpBig delay-2s">
      <button id="click" class="button" @click="move()">Click</button>
    </div>
		<div class="container">
			<ItemList :items="itemlist" :picUrl="picUrl" />
		</div>
  </div>
</template>
<style scoped lang="scss">
.spinner-container {
  position: relative;
  width: 100%;
  z-index: 1;
  margin-top: 30px;
  overflow: hidden;
}

.spinner-wrapper {
  width: 99.98%;
}

.spinner-wrapper .spinner-stack {
  height: 170px;
  position: relative;
  background-image: linear-gradient(
    90deg,
    hsla(0, 0%, 100%, 0),
    hsla(0, 0%, 100%, 0.99) 16%,
    #fff 84%,
    hsla(0, 0%, 100%, 0)
  );
  overflow: inherit;
  padding: 10px 0;
}

.spinner-wrapper .spinner-stack .spinner {
  display: flex;
  width: 100%;
  justify-content: center;
}

.spinner-wrapper .spinner-stack .spinner .spinner-centered {
  width: 800px;
  display: flex;
  position: relative;
  min-height: 110px;
}

.spinner-wrapper .spinner-stack .spinner .spinner-centered .spinner-row {
  display: flex;
  will-change: transform;
}

.spinner-image {
  width: 200px;
  height: 150px;
  display: flex;
}

.spinner-wrapper
  .spinner-stack
  .spinner
  .spinner-centered
  .spinner-row
  .spinner-item
  img {
  max-width: 100%;
  height: auto;
}

.spinner-item {
  width: 98%;
  height: 98%;
  background-color: white;
  box-shadow: 5px 5px 5px lightgray;
  border: 1px gray solid;
}

.animate {
  animation: ease 0.5s;
  transition-delay: 0ms;
}

.spinner-direction {
  transform: translate(-50%, -50%);
}

.spin-pointer {
  position: absolute;
  top: 57px;
  left: 50%;
  background-color: transparent;
  z-index: 200;
	color: red;
}

.button {
  margin: auto;
  box-shadow: 0px 5px 8px 0px #262626;
  width: auto;
  min-width: 140px;
  max-width: 200px;
  height: 49px;
  border: 0px none;
  background: linear-gradient(#f96d31ed 0%, #eef581 92%);
  color: #555555d4;
  text-align: center;
  text-decoration: none;
  text-shadow: 0px -1px 0px black;
  font-size: 18px;
  letter-spacing: 0.5px;
  line-height: 50px !important;
  cursor: pointer;
  border-radius: 25px;
  padding: 0px 10px;
  white-space: nowrap;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
<script>
import axios from "axios";
import $ from "jquery";
import md5 from "md5";
import { mapGetters } from 'vuex';
import ItemList from '@/components/ItemList';
import crypto, { ECDH } from 'crypto';
import { log } from 'util';
import Swal from 'sweetalert2';
import Toastify  from 'toastify-js';
export default {
	components : {ItemList},
  data() {
    return {
      defaultUrl: "",
      items: [],
      boxId: 0,
      itemId: 3,
      round: 10,
      imageWidth: 200,
      picPerPage: 0,
      chksumKey: "aofkitapigamemysterbox2020",
      stopPosition: 0,
      defaultValue: 500,
      duration: 10000,
      randStopPos: 0,
      sessionId: 0,
			useridx: 0,
			timestamp : 0,
			itemlist : [],
      picUrl : 'https://luckygame.in.th/asset/luckygame2/images/',
      realItems : [],
      selectedItem : {},
    };
	},
	computed: mapGetters(['userdata']),
  methods: {
    async getItems(boxId) {
      const ckSum = md5(`${this.boxId}${this.timestamp}${this.chksumKey}`);
      const param = `idbox=${this.boxId}&timestamp=${this.timestamp}&ckSum=${ckSum}`;
      const url = `${this.defaultUrl}/apiaction/get_listboxrandom_detail?${param}`;
      const response = await axios.get(url);
      let items = [];

      if (response.status !== 200) {
        this.$router.go(-1);
        return;
      }
      let data = response.data.data;
      if (data.code !== 200) {
        this.alertError(data.message);
        this.$router.go(-1);
        return;
      }
      items = data.data;
      this.picPerPage = items.length;
      this.realItems = items;
			this.items = await this.getData(items)
			this.itemlist = await this.getListItems(items);
		},
		/** @param array items */
		async getData(items) {
			// console.log('Do It');
			return new Promise((resolve,rejects) => {
				let tmpdata = [];
				let total = 0;
				for(let i = 1; i <= this.round + 1; i++ ) {
					// console.log('For Loop : ',i);
					items.forEach(async item => {
						// console.log('Element',item);
						let newdata = {};
						let hashText = `${i}${item.itemId}${item.id_box}${this.useridx}${this.chksumKey}${this.timestamp}`;
						let hashId = md5(hashText);
						// console.log('++ TOTAL', ++total)
						newdata.hashId 	= hashId;
						newdata.keyno 	= total;
						newdata.id			= item.id;
						newdata.itemId	= item.itemId;
						newdata.id_box	= item.id_box;
						newdata.name		= item.name;
						newdata.rate		= item.red;
						newdata.pic			= item.pic;
						
						tmpdata.push(newdata);
					});
				}
				resolve(tmpdata);
			} )

		},
		/** @param array items */
		async getListItems(items) {
			return new Promise((resolve,reject) => {
				resolve(items.sort(async (a,b) => a.rate - b.rate));
			})
		},
    sha256(password) {
			return crypto.createHash('sha256').update(password).digest('hex');
		},
    getRandomStopPosition() {
      let min = 0;
      let max = 0;
      let num = 0;

      num = this.imageWidth / 2;
      min = num * -1;
      max = num;
      this.randStopPos = this.randomIntFromInterval(min, max);
    },
    randomIntFromInterval(min,max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    afterFinished() {
      let message = String();
      message += `คุณได้รับ ${this.selectedItem.name}`
      // Swal.fire({
      //   title: 'Success',
      //   text: message,
      //   icon: 'success',
      //   confirmButtonText: 'OK'
      // }).then(res => {
      //   this.reset();
      // });

      Swal.fire({
        title: message,
        text: "ต้องการแลกเป็นคูปองหรือไม่",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'แลกเป็นคูปอง',
        cancelButtonText : 'รับไอเทม',
      }).then((result) => {
        if (result.value) {
          alert('แลกคูปอง');
          this.reset();
        } else {
          alert('เลือกไอเทมนี้')
        }

        this.reset();

      })
      
    },
    setRound() {
      this.round = this.randomIntFromInterval(5,7);
    },
    setTimeStamp() {
      this.timestamp = new Date().getTime().toString().substring(0,10);
    },
    reset() {
      this.selectedItem = {};
      this.setRound();
      this.getRandomStopPosition();
    
      $("#spinner").css({
        transform: "translate3d(-" + this.defaultValue + "px, " + 0 + "px, 0px)"
      });

      $(".spinner-direction").css('left','0');

      $('#click').show();

    },
    move() {
			if(Object.keys(this.userdata).length == 0) {
				let errorMsg = 'stackabuse.com';
				let buff = new Buffer(errorMsg);
				let base64data = buff.toString('base64');
				window.location.href(`/error?text=${base64data}`);
				return;
			}

      this.setSelectedItem();
      this.calculateWidth();

      const spinnerItem = $(".spinner-item");
      const spinnerDirection = $(".spinner-direction");
      const spinner = $("#spinner");

      if (spinnerItem.length == 0) {
        this.alertError("No Data");
        return;
      }

      if(Object.keys(this.selectedItem).length == 0) {
        this.alertError("No Data");
        return;
      }

      $('#click').hide();

      spinnerDirection.animate(
        { left: `-${this.stopPosition}` },
        {
          step: (now, fx) => {
            let position = this.defaultValue * -1 + now;
            $("#spinner").css({
              transform: "translate3d(" + position + "px, " + 0 + "px, 0px)"
            });
          },
          duration: this.duration,
          easing: "swing",
          queue: false,
          complete: () => this.afterFinished(),
        }
      );
    },
    alertError(message = '') {
      Toastify({
        text: message,
        duration: 1500, 
        close: true,
        gravity: "bottom", 
        position: 'right', 
        backgroundColor: "background-image: linear-gradient(to right, #d91111, #ed390c);",
        stopOnFocus: true, 
      }).showToast();
    },
    calculateWidth() {
      let firstItem = `11${this.boxId}${this.useridx}${this.chksumKey}${this.timestamp}`;
			let hashText = `${this.round}${this.itemId}${this.boxId}${this.useridx}${this.chksumKey}${this.timestamp}`;
      let selectedItemId = md5(hashText);
      let item = $(`#${selectedItemId}`);
      this.stopPosition = (this.imageWidth * this.picPerPage * (this.round - 2) + ((this.itemId - 1) * this.imageWidth )) - this.defaultValue - 305 - this.randStopPos ;
                        
      console.log(`Stop position`,this.stopPosition,'Random Stop',this.randStopPos);
    },
    setSelectedItem() {

      const selectedItem = this.realItems.filter((e,i) => e.itemId == this.itemId);
      this.selectedItem = selectedItem[0];

      console.log('Selected Item',this.selectedItem)
    }
  },
  mounted() {
		$("#spinner").css({transform: "translate3d(-" + this.defaultValue + "px, " + 0 + "px, 0px)"});
  },
  updated() {},
	async created() {
    // From Params
    this.boxId = this.$route.params.id;
    // Set Default URL
    this.defaultUrl = "https://back.luckygame.in.th";

		this.sessionId = md5(`${new Date().getTime()}${this.useridx}`);
		this.setTimeStamp();
		this.setRound();
    this.getRandomStopPosition();
    await this.getItems(this.boxId);

    window.me = this;
  }
};
</script>