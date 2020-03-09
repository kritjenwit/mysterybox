<template>
  <div :id="'box' + boxId">
    <div>
      <h1 class="text-center"><u>BOX {{ boxId }}</u></h1>
    </div>
    <div class="spinner-container">
      <div class="spinner-wrapper">
        <div class="spinner-stack">
          <div class="spinner">
            <div class="spinner-centered" style="width: 800px;">
              <div class="spin">
                <div class="spin-pointer">
                  <div class="arrow-container">
                    <i style="color:#0f15cb;" class="fa fa-arrow-down fa-2x" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
              <div class="spinner-direction" style="position:absolute;left: 0px;display: none;"></div>
              <div class="spinner-row" id="spinner">
                <div
                  class="spinner-item"
                  style=" width: 200px; height: 150px; display: inline-block;"
                  :data-item-width="(200 * index) + 200"
                  v-for="(item,index) in items"
                  :key="item.no"
                  :data-itemid="item.id"
                  data-ishidden="false"
                  :data-key="item.no"
                >
                  <div class="spinner-image spinner-item-img">
                    <img
                      :src="'https://luckygame.in.th/asset/luckygame2/images/'+ item.pic"
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
    <div class="d-flex justify-content-center mt-3">
      <button id="click" class="button" @click="move()">Click</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import $ from "jquery";
export default {
  data() {
    return {
      defaultUrl: "",
      items: [],
      boxId: 0,
      sliderConfig: {
        picPerPage: 0,
        round: 5, // API
        stopPosition: 0,
        imageWidth: 200,
        increasePosition: 0,
        duration: 0, // API
        padding: 0,
        defaultValue: 500, // API
        randStopPost: 0,
        stopOnItems: 0
      },
      global: {
        currentPosition: 0,
        overFlowElement: null,
        overFlowElementObject: {},
        overFlowElementObject2: {},
        noOverflow: 0,
        lastPosition: 0,
        stepPosition: 200,
        stopPosition: 2000,
        overFlowElementObject3: {},
        checkOverFlow: 0,
        currentItemId: 0
      }
    };
  },
  methods: {
    getItems(boxId) {
      const url = `${this.defaultUrl}/apiapp/get_listboxrandom_detail?id=${boxId}`;
      axios.get(url).then(res => {
        let items = [],
          itemLength = 0;
        items = res.data;
        itemLength = res.data.length;

        this.items = items;
        this.$set(this.sliderConfig, "picPerPage", itemLength);
        this.$set(this.global, "currentItemId", itemLength + 1);
      });
    },

    async getOverFlowElement(now,callback) {
      let absNow = Math.abs(now);
      let items = $('.spinner-item').filter(async (v,i) => {
        let itemWidth = $(i).data('item-width');
        let itemId = $(i).data('itemid');
        return itemWidth <= absNow && $(i).data('ishidden') == false;
      });

      console.log(items);

      let newOverflowElement = {};
      if(items.length > 0) {
        $(items).each(async (index,element) => {
          let itemId = parseInt($(element).data('itemid'));
          if($(element).length > 0 ) {
            if(typeof this.global.overFlowElementObject[itemId] == 'undefined' || this.global.overFlowElementObject[itemId] == undefined) {
              if(typeof itemId == 'number' && itemId != ('' || undefined) && !isNaN(itemId)) {
                this.$set(this.global.overFlowElementObject,itemId,itemId);
                newOverflowElement['ele'] = element;
                newOverflowElement['itemId'] = itemId;
              }
            }
          }
        })
      }

      // let newOverflowElement = {};
      // if(items.length > 0) {
      //   $(items).each((index,element) => {
      //     let itemId = parseInt($(element).data('itemid'));
      //     if($(element).length > 0 ) {
      //       if(typeof this.global.overFlowElementObject[itemId] == 'undefined' || this.global.overFlowElementObject[itemId] == undefined) {
      //         if(typeof itemId == 'number' && itemId != ('' || undefined) && !isNaN(itemId)) {
      //           this.$set(this.global.overFlowElementObject,itemId,itemId);
      //           newOverflowElement['ele'] = element;
      //           newOverflowElement['itemId'] = itemId;
      //         } else {
      //           newOverflowElement['ele'] = undefined;
      //           newOverflowElement['itemId'] = undefined;
      //         }
      //       } else {
      //         newOverflowElement['ele'] = undefined;
      //         newOverflowElement['itemId'] = undefined;
      //       }
      //     }
      //   })
      // }

      if(typeof callback == 'function') {
        return callback(newOverflowElement['ele'],newOverflowElement['itemId']); 
      }
    },
    async appendElement(element,itemId,callback) {
      let newElement = $(element).clone();
      this.$set(this.global, 'lastPosition', this.global.lastPosition + this.global.stepPosition)
      $(newElement).attr("data-item-width", this.global.lastPosition);
      $(newElement).attr("data-ishidden", false);
      $(".spinner-row").append(newElement);
      $(element).attr('data-ishidden', true);
      
      if(typeof callback == 'function') {
        return callback(element,itemId);
      }

    },
    async detectOverflowElement(now,callback) {
      await this.getOverFlowElement(now,async (element,itemId) => {
        if(typeof element != 'undefined' && typeof itemId != 'undefined') {
          console.log("Element : ",element,'Item ID : ',itemId);
          await this.appendElement(element,itemId);
          // console.log('Do DELETE : ' , this.$delete(this.global.overFlowElementObject,itemId) ,' Item ID : ' , itemId)
          // console.log('Do DELETE 2: ' , delete this.global.overFlowElementObject['itemId'] ,' Item ID 2 : ' , itemId)
        }
        
      })
    },
    getStopPosition() {
      return (
        this.sliderConfig.imageWidth *
        this.sliderConfig.picPerPage *
        (this.sliderConfig.round - 1) +
        this.sliderConfig.imageWidth * (this.sliderConfig.stopPosition - 1) -
        this.sliderConfig.increasePosition
        // this.randStopPost -
        // this.sliderConfig.defaultValue -
        // 120 +
        // getRandomStopPosition()
      );
    },
    move() {
      // console.log(this.sliderConfig);
      $(".spinner-direction").animate(
        {
          // left: `-${this.global.stopPosition}`
          left: -2000
        },
        {
          step: function(now, fx) {
            let position = window.me.sliderConfig.defaultValue * -1 + now;
            $("#spinner").css({transform: "translate3d(" + position + "px, " + 0 + "px, 0px)"});
            window.me.detectOverflowElement(now);
          },
          duration: this.sliderConfig.duration,
          easing: "swing",
          queue: false,
          complete: () => alert("Finished")
        },
        "linear"
      );
    },
    randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    setSliderConfig() {
      const url = `${this.defaultUrl}/apiaction/`;
      this.$set(this.sliderConfig, "round", this.randomIntFromInterval(5, 7));
      this.$set(
        this.sliderConfig,
        "duration",
        this.randomIntFromInterval(10000, 10500)
      );
      this.$set(
        this.sliderConfig,
        "stopPosition",
        this.randomIntFromInterval(1, this.items.length)
      );
    }
  },
  updated() {
    this.$set(this.global,'stopPosition',this.getStopPosition())
    $("#spinner").css({
      transform:
        "translate3d(-" +
        this.sliderConfig.defaultValue +
        "px, " +
        0 +
        "px, 0px)"
    });
  },
  created() {
    this.boxId = this.$route.params.id;
    this.defaultUrl = "https://back.luckygame.in.th";
    window.me = this;
    this.getItems(this.boxId);
    this.setSliderConfig();
  }
};
</script>

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
  position: fixed;
  top: 60px;
  left: 50%;
  width: 150px;
  height: 180px;
  background-color: transparent;
  z-index: 200;
}

.button {
  margin: auto;
  box-shadow: 0px 5px 8px 0px #262626;
  width: auto;
  min-width: 140px;
  max-width: 200px;
  height: 49px;
  border: 0px none;
  background: linear-gradient(#f96d31ed 0%,#eef581 92%);
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