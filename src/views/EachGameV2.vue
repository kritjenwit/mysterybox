<template>
  <div :id="'box' + boxId">
    <div>
      <h1 class="text-center">
        <u>BOX {{ boxId }}</u>
      </h1>
    </div>
    <div class="spinner-container">
      <div class="spinner-wrapper">
        <div class="spinner-stack">
          <div class="spinner">
            <div class="spinner-centered" style="width: 800px;">
              <div class="spin">
                <div class="spin-pointer" style="  top: 57px;">
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
                  data-ishidden="0"
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
  // background-image: linear-gradient(
  //   90deg,
  //   hsla(0, 0%, 100%, 0),
  //   hsla(0, 0%, 100%, 0.99) 16%,
  //   #fff 84%,
  //   hsla(0, 0%, 100%, 0)
  // );
  background-image: linear-gradient(90deg, rgb(179, 178, 178), rgba(76, 74, 74, 0.99) 16%, #5a5757 84%, rgb(138, 134, 134));
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
  top: 57px;
  left: 50%;
  width: 150px;
  height: 180px;
  background-color: transparent;
  z-index: 200;
}

.button {
  margin: auto;
  box-shadow: 3px 4px 6px 0px #262626;
  width: auto;
  min-width: 140px;
  max-width: 200px;
  height: 49px;
  border: 0px none;
  background: linear-gradient(#ea5211 0%, #f1f500 92%);
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
import Mysterybox from '@/assets/mysterybox.js'
export default {
  data() {
    return {
      defaultUrl: "",
      items: [],
			boxId: 0,
			no : 0,
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
			currentPosition: 0,
			overFlowElement: null,
			overFlowElementObject: {},
			noOverflow: 0,
			lastPosition: 0,
			stepPosition: 200,
			stopPosition: 2000,
			checkOverFlow: 0,
			currentItemId: 0
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
				this.no = itemLength + 1;
      });
		},
		getItemById(id) {
			// let index = this.items.indexOf(id)
			return this.items.filter((v,i) => {
				return this.items[i].id == id;
			})
		},
		appendToLastElement(element,itemId) {
			let newElement = element.clone();
			this.lastPosition += this.stepPosition;
			$(newElement).attr('data-item-width',this.lastPosition);
			element.attr('data-ishidden',1);
			$('.spinner-row').append(newElement);
			
		},
		async getOverflowElement(currentStep, callback) {
			
			let overFlowElement = $('.spinner-item').filter((index, element) => {
				let itemWidth = $(element).data('item-width');
				let absCurrentPosition = Math.abs(currentStep);
				return itemWidth <= absCurrentPosition;
			});

			// console.log(overFlowElement);

			let newOverflowElement = {};
			let _itemId = undefined;
			if (overFlowElement.length > 0) {
				// Get ItemID
				$(overFlowElement).each((index, element) => {
					let itemId = parseInt($(element).data('itemid'));
					if (this.overFlowElementObject[itemId] == undefined) {
						this.overFlowElementObject[itemId] = element;
						newOverflowElement[itemId] = element;
						_itemId = itemId;
					} 
				})
			}

			if (typeof callback == 'function') {
				return callback(newOverflowElement,_itemId);
			}
		},
		async detectOverflowElement(currentStep) {
			await this.getOverflowElement(currentStep, (overFlowElement,itemId) => {
				console.log("New Over Flow : ",overFlowElement,'Item ID' , itemId)
				if (Object.keys(overFlowElement).length > 0) {
					let arrOverFlowElement = Object.values(overFlowElement);
					if (arrOverFlowElement.length > 0) {
						// this.appendToLastElement($(arrOverFlowElement),itemId);
						let newItem = this.getItemById(itemId)[0];
						this.no += 1;
						let newData = {
							createat:newItem.createat,
							id:newItem.id,
							id_box:newItem.id_box,
							name:newItem.name,
							no:this.no,
							pic:newItem.pic,
							price:newItem.price,
							red:newItem.red,
							type:newItem.type,
						};
						this.items.push(newData);
					}
				}
			});
		},
		async move() {
      console.log(this.sliderConfig);
      $(".spinner-direction").animate({left: -5000},{
				step: async (now, fx) => {
					let position = window.me.sliderConfig.defaultValue * -1 + now;
					$("#spinner").css({transform: "translate3d(" + position + "px, " + 0 + "px, 0px)"});
					me.detectOverflowElement(now);
				},
				duration: 10000,// this.sliderConfig.duration,
				easing: "swing",
				queue: false,
				complete: () => alert("Finished")
			},"linear");
    },
	},
	updated() {
		// this.$set(this.global,'stopPosition',this.getStopPosition())
		$("#spinner").css({transform:"translate3d(-" +this.sliderConfig.defaultValue +"px, " +0 +"px, 0px)"})
	},
  created() {
		this.boxId = this.$route.params.id;
		this.defaultUrl = "https://back.luckygame.in.th";
		window.me = this;
    this.getItems(this.boxId);
  },
  mounted() {

	}
};

</script>