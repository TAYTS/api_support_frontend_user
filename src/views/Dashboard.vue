<template>
  <div>
    <Navigation></Navigation>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";

export default {
  components: {
    Navigation
  },
  mounted() {
    // 1. Check if the user has been authenticate
    this.$store.dispatch("user/authenticate", {}).then(status => {
      // 1.2 Redirect to login page if the user is not authenticated
      if (status === 0) {
        this.$router.replace("/login");
      }
      // 1.1 Render the user page if the user is authenticated
    });
  }
};
</script>
