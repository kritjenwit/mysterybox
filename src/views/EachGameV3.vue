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
    <div class="d-flex justify-content-center mt-3 animated fadeInUpBig delay-2s" v-if="boxPropsArr.length > 0">
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
import { mapGetters,mapActions } from 'vuex';
import ItemList from '@/components/ItemList';
import crypto, { ECDH } from 'crypto';
import { log } from 'util';
import Swal from 'sweetalert2';
import Toastify  from 'toastify-js';
import config from './../assets/config';
import helper from './../assets/function'
export default {
	components : {ItemList},
  data() {
    return {
      defaultUrl: config.apiUrl,
      items: [],
      boxId: 0,
      itemId: 3,
      round: 10,
      imageWidth: 200,
      picPerPage: 0,
      chksumKey: config.chksumKey,
      stopPosition: 0,
      defaultValue: 500,
      duration: 10000,
      randStopPos: 0,
      sessionId: 0,
			useridx: 0,
			timestamp : 0,
			itemlist : [],
      picUrl : config.img_url,
      realItems : [],
      selectedItem : {},
      alertTypeItemOption : {},
      alertTypeCouponOption : {},
      boxProps : {},
      boxPropsArr : [],
      userProps : {},
      isexchange : 0,
      pointBefore : 0,
      pointAfter : 0,
      isItem : 0,
      productPong : 0,
    };
	},
	computed: mapGetters(['userdata','getBoxes','getLanguage']),
  methods: {
    ...mapActions(['updatePoint','setUserData','setParams']),
    async getItems(boxId) {
      const ckSum = md5(`${this.boxId}${this.timestamp}${this.chksumKey}`);
      const param = `idbox=${this.boxId}&timestamp=${this.timestamp}&ckSum=${ckSum}`;
      const url = `${this.defaultUrl}/${config.api.getItems}?${param}`;
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
    alertItemsToCoupon(options) {
      Swal.fire(options)
        .then(res => {
          if(res.value) {
            console.log(this.selectedItem);
            this.isexchange = 1;
            const productPong = this.selectedItem.product_Pong;
            this.isItem = 0;
            if(productPong > 0) {
              this.addpoint(+productPong)
                .then(res => {
                  console.log(res.data.data);
                  this.writeLog(`[BOXID(${this.boxId}) => RES ADD POINT]:\t ${JSON.stringify(res.data.data)}`)
                  const afterPoint = res.data.data.data;
                  this.pointAfter = afterPoint;
                  this.productPong = productPong;
                  console.log('[ITEM TO Coupon -> ADDPOINT] Point After : ', afterPoint)
                  this.updatePoint(afterPoint);
                  this.writeLog(`[BOXID(${this.boxId}) => CONVERT TO PONG]:\tPoint After ${afterPoint}`)
                })

                Swal.fire({
                  icon : 'success',
                  title : this.$t('alertItemsToCoupon.successful_exchange'),
                }).then(res2 => this.reset())

            } else {
              Swal.fire({
                icon : 'error',
                title : this.$t('alertItemsToCoupon.exchange_failed'),
              }).then(res2 => {
                this.writeLog(`[BOXID(${this.boxId}) => CONVERT TO PONG ERROR]:\tไม่สามารถแลกเป็นคูปองได้`)
                this.reset()
              })
            }
          } else {
            this.alertTypeItem();
          }
        });

    },
    alertTypeItem() {
      Swal.fire(this.alertTypeItemOption)
        .then(result => {
          if (result.value) {
            // กดแลกปอง
            let options = {
              icon : 'info',
              title: this.$t('exchange_to_coupon.title'),
              text : `${this.$t('exchange_to_coupon.text')} ${this.selectedItem.product_Pong} ${this.$t('coupon')}`,
              showCancelButton : true,
              confirmButtonColor : '#3085d6',
              cancelButtonColor : '#d33',
              confirmButtonText : this.$t('exchange_to_coupon.confirmButtonText'),
              cancelButtonText  : this.$t('exchange_to_coupon.cancelButtonText'),
            };
            this.alertItemsToCoupon(options)
          } else if(result.dismiss == 'cancel') {
            // กดรับไปเทม
            this.recvItem();
            Swal.fire({
              icon : 'success',
              title : this.$t('recvitem_status'),
            }).then(res => {
              this.toastType(`${this.$t('toast_recvitem')} ${this.selectedItem.name}`);
              this.isitem = 1;
              this.writeLog(`[BOXID(${this.boxId}) => PRESS RECV ITEM]:\tกดรับไอเทม ${this.selectedItem.name}`)
              this.reset();
            })
          } else if(result.dismiss == 'backdrop') {
            this.alertTypeItem();
          }
        })
    },
    alertTypeCoupon() {
      const itemPrice =  this.selectedItem.price;
      console.log('[ADDPOINT] Item Price : ',itemPrice);
      this.addpoint(itemPrice)
        .then(res => {
          const afterPoint =  res.data.data.data;
          this.updatePoint(+afterPoint);
          this.writeLog(`[BOXID(${this.boxId}) => RES ADD POINT]:\t ${JSON.stringify(res.data.data)}`)
          console.log('[ADD POINT] Point After : ', afterPoint);
        });
      
      Swal.fire(this.alertTypeCouponOption)
        .then(res => {
          this.reset()
        })
    },
    afterFinished() {
      this.writeLog(`[BOXID(${this.boxId}) => AFTER SPIN FINISHED]`)
      let message = String();
      message += `${this.$t('after_finished.recv_message')} ${this.selectedItem.name}`
      let alertOptions = {};
      this.writeLog(`[BOXID(${this.boxId}) => REVE ITEM]\t${message}`)
      alertOptions.title = message;
      alertOptions.imageUrl = this.picUrl + this.selectedItem.pic ;
      alertOptions.imageWidth = 200;
      alertOptions.imageHeight = 'auto';
      this.toastType(message,'blue');
      if(this.selectedItem.productType == 0) {
        alertOptions.text = this.$t('after_finished.text_exchange');
        alertOptions.showCancelButton = true;
        alertOptions.confirmButtonColor = '#3085d6';
        alertOptions.cancelButtonColor = '#28a745';
        alertOptions.confirmButtonText = this.$t('after_finished.confirmButtonText');
        alertOptions.cancelButtonText  = this.$t('after_finished.cancelButtonText');
        this.alertTypeItemOption = alertOptions;
        this.writeLog(`[BOXID(${this.boxId}) => ALERT RECV OPTION]\t${JSON.stringify(alertOptions)}`)
        this.alertTypeItem(alertOptions);

      } else if(this.selectedItem.productType == 1 ) {
        this.writeLog(`[BOXID(${this.boxId}) => ALERT RECV OPTION]\t${JSON.stringify(alertOptions)}`)
        this.alertTypeCouponOption = alertOptions;
        this.alertTypeCoupon(alertOptions)
      }



    },
    setRound() {
      this.round = this.randomIntFromInterval(5,7);
    },
    setTimeStamp() {
      this.timestamp = new Date().getTime().toString().substring(0,10);
    },
    async reset() {
      await this.insertLogBet();



      this.selectedItem = {};
      this.setRound();
      this.getRandomStopPosition();

      this.isexchange = 0;
      this.pointBefore = 0;
      this.pointAfter = 0;
      this.isItem = 0;
      this.productPong = 0;

      $("#spinner").css({
        transform: "translate3d(-" + this.defaultValue + "px, " + 0 + "px, 0px)"
      });

      $(".spinner-direction").css('left','0');

      $('#click').show();

      console.log('Reset Method is triggered')
    },
    move() {
      // Set Selected Item
      this.writeLog(`[BOXID(${this.boxId}) => CLICK]:\t=========================================`)
      this.setSelectedItem();
      // Calculate Where spinner shold stop
      this.calculateWidth();
      

      this.writeLog(`[BOXID(${this.boxId}) => SELECTED ITEM]:\t${JSON.stringify(this.selectedItem)}`)

      const spinnerItem = $(".spinner-item");
      const spinnerDirection = $(".spinner-direction");
      const spinner = $("#spinner");

      // console.log(this.userdata.coupo);
      if(typeof this.userdata.key == 'undefined' || isNaN(this.userdata.coupon)) {
        this.writeLog(`[BOXID(${this.boxId}) => ERROR]:\tกรุณาออกจากเกมและเข้าใหม่`)
        this.alertError($('re_open_game'));
        return;
      }

      if (spinnerItem.length == 0) {
        this.writeLog(`[BOXID(${this.boxId}) => ERROR]:\tNo Data (1)`)
        this.alertError("No Data");
        return;
      }

      if(Object.keys(this.selectedItem).length == 0) {
        this.writeLog(`[BOXID(${this.boxId}) => ERROR]:\tNo Data (2)`)
        this.alertError("No Data");
        return;
      }

      $('#click').hide();

      // console.log(this.boxProps);
      const boxPrice = this.boxProps.price;
      this.pointBefore = this.userdata.coupon;
      // Update Point on Navbar
      this.writeLog(`[BOXID(${this.boxId}) => UPDATE POINT]`)
      this.updatePoint(this.userdata.coupon - boxPrice);
      
      this.toastMoveSpin(`${this.$t('play')} ${boxPrice} ${this.$t('coupon')}`);
      // // API Add or Sub
      this.writeLog(`[BOXID(${this.boxId}) => CLICK SPIN AT]:\t ${helper.dateTime()} | Pay ${boxPrice}`);
      this.cutpoint(boxPrice)
        .then(res => {
          let afterPoint = +res.data.data.data;
          this.writeLog(`[BOXID(${this.boxId}) => RES CUT POINT]:\t ${JSON.stringify(res.data.data)}`)
          console.log('[CUTPOINT] Point After : ', afterPoint);
          this.pointAfter = afterPoint;
          this.writeLog(`[BOXID(${this.boxId}) => AFTER POINT]:\t ${afterPoint}`)
        });

      this.moveSpinner();
    },
    toastType(message,color = 'green',duration = '2000') {
      Toastify({
        text: `${message}`,
        duration: duration, 
        close: true,
        gravity: "bottom", 
        position: 'right', 
        backgroundColor: color,
        stopOnFocus: true, 
      }).showToast();
    },
    toastMoveSpin(message) {
      this.toastType(message);
    },
    moveSpinner() {
      const spinnerDirection = $(".spinner-direction");
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
      this.toastType(message,'red');
    },
    calculateWidth() {
      let firstItem = `11${this.boxId}${this.useridx}${this.chksumKey}${this.timestamp}`;
			let hashText = `${this.round}${this.itemId}${this.boxId}${this.useridx}${this.chksumKey}${this.timestamp}`;
      let selectedItemId = md5(hashText);
      let item = $(`#${selectedItemId}`);
      this.stopPosition = (this.imageWidth * this.picPerPage * (this.round - 2) + ((this.itemId - 1) * this.imageWidth )) - this.defaultValue - 305 - this.randStopPos ;
                        
      console.log(`Stop position`,this.stopPosition,'Random Stop',this.randStopPos);
    },
    getTimeStamp(end = 10,start = 0) {
      return new Date().getTime().toString().substr(start,end);
    },
    setSelectedItem() {

      const selectedItem = this.realItems.filter((e,i) => e.itemId == this.itemId);
      this.selectedItem = selectedItem[0];

      console.log('Selected Item',this.selectedItem)
    },
    setBoxProps() {
      const boxProps = this.getBoxes.filter((e,i) => e.id == this.boxId);
      this.boxProps = boxProps[0];
      this.boxPropsArr = boxProps;
    },  
    apiMliveAddOrSub(type,coupon) {
      return new Promise((resolve,reject) => {
        let idx = this.userdata.useridx;
        let key = this.userdata.key;
        let boxId = this.boxId;
        let crystal = this.userdata.coupon;
        let price = coupon;
        let timestamp = this.getTimeStamp();
        let itemId = +this.selectedItem.itemId;
        let chksumKey = config.addorsubChksumKey;
        let cksum = `${idx}${key}${type}${boxId}${crystal}${price}${timestamp}${itemId}${chksumKey}`;

        const url = `${this.defaultUrl}/${config.api.addOrSub}`;
        const data = {
          idx : +idx,
          key : this.userdata.key,
          type : type,
          idbox : +boxId,
          crystal : +crystal,
          price : +price,
          timestamp : +this.getTimeStamp(),
          itemId : itemId,
          ckSum : md5(cksum),
        } 
       
        const typeMessage = type == 0 ? 'RES CUTPOINT' : 'RES ADDPOINT'; 
        const sendMessage = type == 0 ? 'DATA CUTPOINT' : 'DATA ADDPOINT'; 
        this.writeLog(`[BOXID(${this.boxId}) => ${sendMessage}]:\t ${JSON.stringify(data)}`)
        const response = axios.post(url,data)
        resolve(response);
      })
    },
    recvItem() {
      let idx = this.userdata.useridx;
      let key = this.userdata.key;
      let boxId = this.boxId;
      let itemId = this.selectedItem.itemId;
      let timestamp = this.getTimeStamp();
      let chksumKey = config.addorsubChksumKey;
      let cksum = `${idx}${key}${itemId}${boxId}${timestamp}${chksumKey}`;
      // -------------------------
      const url = `${this.defaultUrl}/${config.api.recvItem}`;
      const data = {
        idx: idx,
        key: key,
        itemId: itemId,
        idbox : boxId,
        timestamp : timestamp,
        ckSum : md5(cksum),
      };
     
      axios.post(url,data)
        .then(res => {
          this.writeLog(`[BOXID(${this.boxId}) => RES RECV ITEM]:\t ${JSON.stringify(res.data.data)}`)
          console.log(res.data)
        })
    },
    addpoint(coupon) {
      this.writeLog(`[BOXID(${this.boxId}) => ADDPOINT]:\t ${helper.dateTime()}`);
      return this.apiMliveAddOrSub(1,coupon)
    },
    cutpoint(coupon) {
      this.writeLog(`[BOXID(${this.boxId}) => CUTPOINT]:\t ${helper.dateTime()}`);
      return this.apiMliveAddOrSub(0,coupon)
    },
    writeLog(message) {
      helper.writeLog(this.userdata.useridx,message)
    },
    async insertLogBet() {
      const useridx = this.userdata.useridx;
      const price = +this.boxProps.price;
      const boxId = +this.boxId;
      const itemId = +this.selectedItem.itemId;
      const isitem = this.selectedItem.productType == 0 ? 1 : 0;
      const isexchange = +this.isexchange;
      const crystalBefore = +this.pointBefore;
      const itemPong = +this.selectedItem.price;
      const productPong = +this.selectedItem.product_Pong;
      const timestamp = helper.time();
      const ckSum = md5(`${useridx}${price}${boxId}${itemId}${isitem}${isexchange}${crystalBefore}${timestamp}${config.addorsubChksumKey}`);

      let data = {};
      data.useridx = useridx;
      data.price = price;
      data.boxid = boxId;
      data.itemId = itemId;
      data.isitem = isitem;
      data.isexchange = isexchange;
      data.crystal_before = crystalBefore;
      data.itemPong = itemPong;
      data.product_Pong = productPong;
      data.timestamp = timestamp;
      data.ckSum = ckSum;

      console.log(data);

      const url = `${config.apiUrl}/${config.api.logbet}`

      await axios.post(url,data);

    }
  },
  
  mounted() {
		$("#spinner").css({transform: "translate3d(-" + this.defaultValue + "px, " + 0 + "px, 0px)"});
  },
  updated() {},
	async created() {
    // From Params
    this.boxId = this.$route.params.id;
		this.sessionId = md5(`${new Date().getTime()}${this.useridx}`);
		this.setTimeStamp();
		this.setRound();
    this.getRandomStopPosition();
    await this.getItems(this.boxId);
    this.setBoxProps();
    window.me = this;
    
    let messageLog = String();
    this.writeLog(`[BOXID(${this.boxId}) => DATETIME]:\t${helper.dateTime()}`)
    this.writeLog(`[BOXID(${this.boxId}) => IDX]:\t${this.userdata.useridx}`)
    this.writeLog(`[BOXID(${this.boxId}) => KEY]:\t${this.userdata.key}`)
    this.writeLog(`[BOXID(${this.boxId}) => COUPON]:\t${this.userdata.coupon}`)
  }
};
</script>