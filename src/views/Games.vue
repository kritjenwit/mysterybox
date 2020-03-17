<template>
  <div class="container">
    <div id="boxes">
      <div class="row">
        <div class="col-6 offset-3">
          <h3 class="text-center" style="color: #555555; font-size: 30px;"><u>{{ $t('project_name') }}</u></h3>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-6 col-6 mt-2" v-for="box in getBoxes" :key="box.id" >
          <div class="box-container" v-if="box.cntproduct > 0">
            <span class="price-tag" @click="$router.push(`/box/${box.id}?d=${getParams.data}&key=${getParams.key}`)">{{ box.price }} </span>       
            <Games :cntitem="box.cntproduct" :itemid="box.id" :param_data="getParams.data" :param_key="getParams.key" :itemname="box.namebox" :img_url="'https://luckygame.in.th/asset/luckygame2/images/' + box.boxpic" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Games from "@/components/Games";
import { mapGetters,mapActions } from 'vuex';
import helper from './../assets/function';
export default {
  components: { Games },
  data() {
    return {}
  },
  computed : mapGetters(['getBoxes','userdata','getParams','getLanguage']),
  methods : {
    ...mapActions(['setUserData']),
    writeLog(message) {
      helper.writeLog(this.userdata.useridx,message)
    },
  },
  created() {
    this.writeLog('===============================');
    this.writeLog(`[DATETIME]:\t${helper.dateTime()}`)
    this.writeLog(`[INIT APP]:\t${helper.time()}`);
  }
};
</script>

<style scpoed lang="scss">

#boxes {
  padding-top: 20px;
}

._1Nm8gCdU {
    min-height: 35px;
    padding: 10px 30px 11px;
    font-weight: inherit;
    font-style: inherit;
    letter-spacing: 0;
    font-family: Montserrat,-apple-system,BlinkMacSystemFont,Segoe UI,Fira Sans,Helvetica Neue,Arial,sans-serif;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    margin-top: auto;
    margin-bottom: auto;
    white-space: nowrap;
    outline: 0;
    border: none;
    border-radius: 6px;
    display: inline-block;
    cursor: pointer;
    line-height: 1em;
    transition: all .2s ease-in-out;
    background-color: #f73859;
    color: #fff;
}

.dot2 {
    color: white;
    padding: 3px;
    text-align: center;
    font-family: 'Sarabun';
    margin-bottom: 5px;
}

.price-tag {
  // position: absolute;
  // text-align: center;
  // right: 0;
  // -webkit-clip-path: polygon(27% 0, 72% 0, 100% 100%, 0% 100%);
  // clip-path: polygon(27% 0, 82% 0, 100% 100%, 0% 100%);
  // background: linear-gradient(45deg, #ff832b 0%, #c71818 100%);
  // -webkit-transform: rotate(45deg);
  // transform: rotate(40deg);
  // width: 110px;
  // margin-top: 14px;
  // margin-right: -6px;
  // cursor: pointer;
    position: absolute;
    text-align: center;
    right: 0;
    -webkit-clip-path: polygon(27% 0, 72% 0, 100% 100%, 0% 100%);
    clip-path: polygon(37% 0, 74% 0, 100% 100%, 0% 100%);
    background: linear-gradient(45deg, #e2f548 0%, #ff0000 100%);
    -webkit-transform: rotate(45deg);
    transform: rotate(40deg);
    width: 116px;
    margin-top: 5px;
    margin-right: -10px;
    cursor: pointer;
    height: 36px;
    font-size: 19px;
    color: aliceblue;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.125rem;
}

.card-body {
  flex: 1 1 auto;
  padding: 1.25rem;
}

.div-test {
  border-radius: 0px !important;
  width: 75%;
  border-radius: 8px !important;
  margin-top: 30px;
  box-shadow: 3px 6px 11px 0px rgb(24, 24, 49);
}

.img-fluid {
  max-width: 100%;
  height: 30px;
}

.img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.mod-card {
  background: #b3b3b394;
}

.img-box-container {
  //-webkit-box-shadow: 0px 0px 19px 3px rgba(0,0,0,0.75);
  //-moz-box-shadow: 0px 0px 19px 3px rgba(0,0,0,0.75);
  //box-shadow: 0px 0px 19px 3px rgba(0,0,0,0.75);
  box-shadow: 0px 5px 8px 3px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  margin-bottom: 10px;
}

.img-box-container:hover {
  transition: .3s ease-in-out;
}

.img-box-container.no-item {
  opacity: 0.5;
  cursor: pointer;
}

.no-item-container {
  position: absolute;
  top: 40%;
  z-index: 100;
  width: 100%;
  border: 1px;
  font-size: 50px;
}

.txt-no-item {
  color: red;
  text-align: center !important;
}

</style>