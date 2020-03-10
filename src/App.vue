<template>
  <div id="app">

    <transition
      name="fade"
      mode="out-in">
      <router-view />
    </transition>
    <Navbar />
  </div>
</template>
<script>
import Navbar from "@/components/Navbar";
import { mapActions, mapGetters } from 'vuex';
export default {
  components: { Navbar },
  data() {
    return {
      key : '',
    }
  },
  methods : {
    ...mapActions(['fetchBoxes','setUserData','setParams']),
  },
  computed : mapGetters(['userdata']),
  created() {
    this.key = this.$route.query.key;
    const userdata = JSON.parse(Buffer.from(this.$route.query.d,'base64').toString())
    this.setUserData(this.key,userdata);
    const data = {
      key : this.$route.query.key,
      data : this.$route.query.d,
    }
    this.setParams(data);
    this.fetchBoxes();
  }
};




</script>
<style lang="scss">
@import url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap-reboot.min.css);
@import url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap-grid.min.css);
@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css);
@import url(https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css);
@import url(https://fonts.googleapis.com/css?family=Lato|Prompt&display=swap);
@import url(https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css);

// <link href="https://fonts.googleapis.com/css?family=Lato|Prompt&display=swap" rel="stylesheet">
body {
  max-height: 120%;
  height: auto;
  background: url(https://luckygame.in.th/asset/luckygame2/images/BG_detail.jpg)
    no-repeat center top fixed #091b03;
  background-size: cover;
}

body {
font-family: 'Prompt', sans-serif;
// font-family: 'Lato', sans-serif;
} 

body::-webkit-scrollbar {
  display: none;
  -ms-overflow-style: none;
}

body {
  -ms-overflow-style: none;
}

#app {
  padding-bottom: 60px;
}

.text-center {
  text-align: center !important;
}

.text-left {
  text-align: left !important;
}
.text-right {
  text-align: right !important;
}

.d-inline {
  display: inline !important;
}

table.t-w-100p {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>