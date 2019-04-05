<template>
  <div class="dashboard__container">
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

export default {
  components: {
    NavigationBar,
    SidePanel
  },
  mounted() {
    // Check if the user has been authenticate
    this.$store.dispatch("user/authenticate", {}).then(status => {
      // Redirect to login page if the user is not authenticated
      if (status === 0) {
        this.$router.replace("/login");
      } else {
        // Get the Twilio access token (assume that it will success)
        this.$store.dispatch("messages/initClient");
        // Render the user page if the user is authenticated
        this.$router.push({ name: "TicketListing" });
      }
    });
  }
};
</script>

<style scoped>
.dashboard__container {
  height: 100%;
  width: 100%;
  background-color: #eeeeee;
}

.content {
  height: 100%;
  padding: 100px 50px 100px 280px;
}
</style>