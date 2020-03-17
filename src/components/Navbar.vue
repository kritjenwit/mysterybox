<template>
  <nav id="navbar" class="navbar">
    <div class="fixed-bottom" style="background-color:rgb(88, 87, 87);">
      <div class="row" style="padding:5px">
        <div class="col-2">
          <div class="icon" @click="goToApp()">
            <!-- <i class="fa fa-arrow-left fa-2x" aria-hidden="true"></i> -->
            {{ $t('btn_back') }}
          </div>
        </div>
        <div class="col-6 text-center">
          <table class="t-w-100p">
            <tbody>
              <tr>
                <td class="text-right">
                  <i aria-hidden="true" class="fab fa-bitcoin fa-2x" style="color: yellow;margin-right: 5px;"></i>
                </td>
                <td class="text-left" style="width:40%; color:yellow">{{ userdata.coupon }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-4">
          <table class="t-w-100p">
            <tbody>
              <tr>
                <td class="text-right">
                  <img class="img-fluid" style="margin-right: 5px;" :src="userdata.img_url" alt />
                </td>
                <td class="text-left" style="color:white; width: 45%;">{{ userdata.username }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </nav>
</template>
<style scoped lang="scss">
.fixed-bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030;
}

.icon {
  cursor: pointer;
      cursor: pointer;
    background: linear-gradient(-45deg, #f1935d 12%, #f33636 69%);
    width: 80px;
    height: 36px;
    border-radius: 13px;
    text-align: center;
    margin: auto;
    color: white;
    font-size: 21px;
}

.icon > i {
  color: red;
}

.img-fluid {
  max-width: 100%;
  height: 30px;
}

.img-thumbnail {
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  max-width: 100%;
  height: auto;
}
</style>
<script>
import { mapGetters,mapActions } from 'vuex';
import helper from './../assets/function'
export default {
  data() {
    return {
      
    };
  },
  methods: {
    ...mapActions(['setLanguage']),
    goToApp() {
      const routeName = this.$route.name;
      if(routeName == 'Games') {
        alert('To Mlive');
      } else {
        this.$router.go(-1);
      }
    },
    changeLanguage(lang) {
      this.setLanguage(lang);
    }
  },
  computed : mapGetters(['userdata'])
};
</script>