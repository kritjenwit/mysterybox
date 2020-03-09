<template>
  <div id="app">

    <router-view />
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

body {
  max-height: 120%;
  height: auto;
  background: url(https://luckygame.in.th/asset/luckygame2/images/bg2.jpg)
    no-repeat center top fixed #091b03;
  background-size: cover;
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
</style>