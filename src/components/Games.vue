<template>
  <div :id="'box' + itemid">
    <div v-if="cntitem == 0" class="no-item-container">
      <p  class="txt-no-item"><b>No Item</b></p>
    </div>
    <div @click="redirect(`/box/${itemid}?d=${param_data}&key=${param_key}`)" class="img-box-container" :class="{ 'no-item' : cntitem == 0 }">
      <img :src="img_url" class="img-fluid img-center" :alt="itemname" style="height:auto" />
    </div>
  </div>
</template>
<script>
export default {
  props: ["itemid", "itemname", "img_url","param_data","param_key",'cntitem'],
  data() {
    return {
      id: this.$props.itemid,
      name: this.$props.itemname,
    };
  },
  methods: {
    redirect(routeName) {
      if(this.cntitem > 0) {
        this.$router.push(routeName);
      } else {
        alert('No Items');
      }
    }
  }
};
</script>