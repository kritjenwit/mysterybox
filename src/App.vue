<template>
  <div id="app">
    <div class="main" v-if="userdataArr.length > 0">
      <div class="app-version">Version 0.1.0 [Pre-Build]</div>
      <div style="position:absolute;top:0;left:0;">
        <LocaleChanger />
      </div>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
      <Navbar />
    </div>
    <div class="loading" v-else>
      <h1>Loading <i class="fa fa-spinner fa-spin" style="font-size:24px"></i></h1>
    </div>
  </div>
</template>
<script>
import crypto from './assets/crypto';
import Navbar from "@/components/Navbar";
import LocaleChanger from "@/components/LocaleChanger";
import { mapActions, mapGetters } from "vuex";
import Swal from 'sweetalert2';
import helper from './assets/function'
export default {
  components: { Navbar,LocaleChanger },
  data() {
    return {
      key: "",
      user : [],
    };
  },
  methods: {
    ...mapActions(["fetchBoxes", "setUserData", "setParams"]),
    alertConnection() {
      Swal.fire({
        icon: 'error',
        title : this.$t('connection_failed'),
        confirmButtonText : this.$t('connection_failed_to_mlive'),
      }).then(res => {
        if(res.dismiss) {
          this.alertConnection();
        } else {
          alert('Exit To Mlive');
        }
      });
    }
  },
  computed: mapGetters(["userdataArr","userdata"]),
  mounted() {
    setTimeout(() => {
      if(this.userdataArr.length == 0 || typeof this.userdata.key == 'undefined') {
        this.alertConnection();
      }
    }, 3000);
  },
  created() {
    this.key = this.$route.query.key;
    let userdata;
    try {
      userdata = JSON.parse(
        Buffer.from(this.$route.query.d, "base64").toString()
      );
    } catch(e) {
      userdata = null; 
    }

    this.setUserData(this.key, userdata);
    const data = {
      key: this.$route.query.key,
      data: this.$route.query.d
    };
    this.setParams(data);
    this.fetchBoxes();
    
    // const originalMessage = 'TEST';
    // const textEncrypted = crypto.encrypt(originalMessage);
    // const textDecrypted = crypto.decrypt(textEncrypted);
    // console.log('Original Message : ', originalMessage)
    // console.log('Encrypt : ',textEncrypted);
    // console.log('Decrypt : ',textDecrypted);

  }
};
</script>
<style lang="scss">
@import url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap-reboot.min.css);
@import url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap-grid.min.css);
@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css);
@import url(https://fonts.googleapis.com/css?family=Lato|Prompt&display=swap);
@import url(https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css);

body {
  max-height: 120%;
  height: auto;
  background: url(https://luckygame.in.th/asset/luckygame2/images/BG_detail.jpg)
    no-repeat center top fixed #091b03;
  background-size: cover;
}

body {
  font-family: "Prompt", sans-serif;
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
  opacity: 0;
}

.app-version {
  position: absolute;
  top: 0;
  right: 0;
}

.loading {
  position: absolute;
  top: 45%;
  left: 45%;
}

</style>