<template>
  <div class="container" style="position:fixed;top:25%;left:15%">
    <div class="row">
      <div class="col-6 offset-3">
        <div class="card">
          <h2 style="color:red" class="text-center">{{ errorName }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      errorName: ""
    };
	},
	created() {
		this.errorName = Buffer.from(this.$route.query.text,'base64').toString();
	}
};
</script>