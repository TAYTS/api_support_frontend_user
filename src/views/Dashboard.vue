<template>
  <div class="dashboard__container" id="canvas">
    <Loader :ready="ready"></Loader>
    <NavigationBar></NavigationBar>
    <SidePanel></SidePanel>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue";
import SidePanel from "@/components/SidePanel.vue";
import Loader from "@/components/Loader.vue";

export default {
  components: {
    NavigationBar,
    SidePanel,
    Loader
  },
  data: () => {
    return {
      ready: false
    };
  },
  mounted() {
    let effect = VANTA.WAVES({
      el: "#canvas",
      color: 0xb765e7,
      waveHeight: 15,
      waveSpeed: 3
    });

    // Check if the user has been authenticate
    this.$store.dispatch("user/authenticate", {}).then(status => {
      // Redirect to login page if the user is not authenticated
      if (status === 1) {
        // Render the user page if the user is authenticated
        // Get the Twilio access token
        this.$router.push({ name: "TicketListing" });
        this.$store.dispatch("messages/initClient").then(status => {
          if (status) {
            this.ready = true;
          }
        });
      } else {
        this.$router.push({ name: "LoginPage" });
      }
    });
  }
};
</script>

<style scoped>
.dashboard__container {
  height: 100%;
  width: 100%;
}

.content {
  height: 100vh;
  padding: 100px 50px 30px 280px;
}
</style>
