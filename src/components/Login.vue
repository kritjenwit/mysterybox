<template>
  <div class="container" style="position:fixed;top:25%;left:15%">
		<div class="row" v-if="key == ''">
			<div class="col-6 offset-3">
				<div class="card">
					<h2 style="color:red" class="text-center">{{ errorMessage }}</h2>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions,mapGetters } from 'vuex';
export default {
	data() {
		return {
			key : '',
			errorMessage : '',
			useridx : '',
		}
	},
	methods : {
		...mapActions(['setUserData']),
	},
	// mounted() {
	// 	const user = this.userdata;
	// 	if(Object.keys(user).length == 0){
	// 		this.errorMessage = user.message || "Invalid Key";
	// 		alert(this.errorMessage);
	// 		return;
	// 	} else {
	// 		this.useridx = user.useridx;
	// 		const url = `/?key=${this.key}&useridx=${this.useridx}`;
	// 		this.$router.go(url)
	// 	}
	// },
	// computed : mapGetters(['getBoxes','userdata']),
	// created() {
	// 	console.log('Created  Login')
	// 	console.log('Here');
	// }
};
</script>