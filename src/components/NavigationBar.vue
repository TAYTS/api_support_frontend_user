<template>
  <nav class="nav-bar__container">
    <img class="main-logo" src="../assets/img/Accenture_Logo.svg">
    <div class="options">
      <v-menu
        auto
        offset-y
        nudge-bottom="10"
        content-class="dropdown-menu"
        transition="slide-y-transition"
        z-index="10"
      >
        <v-icon class="account-icon" x-large dark color="accent" slot="activator">account_circle</v-icon>
        <v-icon class="arrow-icon" color="accent" slot="activator">keyboard_arrow_down</v-icon>
        <v-list dense class="options-list">
          <v-list-tile
            v-for="(item, index) in accountOptions"
            :key="index"
            @click="handle_func_call(item.func)"
          >
            <v-list-tile-action>
              <v-icon color="white">{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="options-text" v-text="item.title"/>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </nav>
</template>

<script>
export default {
  data: () => ({
    accountOptions: [
      { icon: "exit_to_app", title: "Sign Out", func: "signOut" }
    ]
  }),
  methods: {
    // Helper function for dynamic bind the function call to each list element
    handle_func_call(func_name) {
      this[func_name]();
    },
    signOut() {
      this.$store.dispatch("user/logout").then(status => {
        if (status === 1) {
          this.$router.replace("/login");
        } else {
          alert("Unable to logout");
        }
        // Handle the arrow animation
        const arrowIcon = document.querySelector(".arrow-icon");
        arrowIcon.classList.toggle("down");
      });
    }
  },
  mounted() {
    const arrowIcon = document.querySelector(".arrow-icon");
    window.addEventListener("click", e => {
      if (e.target.matches(".v-menu__activator, .arrow-icon, .account-icon")) {
        arrowIcon.classList.toggle("down");
      } else {
        arrowIcon.classList.remove("down");
      }
    });
  }
};
</script>

<style scoped>
.nav-bar__container {
  height: 70px;
  width: 100%;
  position: fixed;
  z-index: 100;
  background-color: #efc7fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 15px 0 #111111;
}

.main-logo {
  width: 230px;

  padding: 20px;

  display: inline-block;
}

.options {
  margin-right: 50px;
}

.account-icon {
  margin: 0;
}

.arrow-icon {
  -moz-transition: all 0.3s linear;
  -webkit-transition: all 0.3s linear;
  transition: all 0.3s linear;
}

.down {
  -ms-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

.options-list {
  background-color: rgba(169, 145, 182, 0.8);
}

.options-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
}
</style>

