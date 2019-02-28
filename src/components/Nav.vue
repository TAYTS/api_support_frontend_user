<template>
  <v-navigation-drawer
    v-model="drawer"
    class="drawcolor"
    fixed
    permanent
    absolute
    width="200px"
  >
    <div id="logo-bg">
      <div id="logo-main">
        <img src="../assets/img/Accenture_User_Logo.svg" />
      </div>
    </div>
    <div id="name-bg">
      <div id="name-main">
        <b>{{ userName }}</b>
      </div>
    </div>
    <div class="whole">
      <button class="button my-2">
        <img class="button-image" src="../assets/img/plus.svg" alt />
        <div class="button-text">
          Create Ticket
        </div>
      </button>
      <button class="button">
        <img class="button-image" src="../assets/img/faq.svg" alt rounded />
        <div class="button-text">
          FAQ
        </div>
      </button>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      userName: "Kenneth"
    };
  }
};
</script>

<style scoped>
#logo-bg {
  background-color: #ffffff;
  padding-top: 10px;
}

#logo-main {
  width: 130px;
  margin: auto;
  padding-right: 4px;
}

#name-bg {
  background-color: #f2f2f2;
  padding-top: 15px;
  padding-bottom: 15px;
}

#name-main {
  padding-top: 10px;
  font-size: 18px;
  text-align: center;
}
#app1 {
  font-size: 10px;
  background-color: #ffffff;
  font-weight: bold;
  font-family: HelveticaNeueMedium;
  padding: 10px;
  margin-left: 40px;
  height: 45px;
}
#app2 {
  font-size: 15px;
  background-color: #ffffff;
  font-weight: bold;
  font-family: HelveticaNeueMedium;
  height: 100%;
  margin-left: 40px;
  padding: 10px;
  width: 100px;
}
.button-image {
  width: 30px;
  margin-top: 7px;
  float: left;
  margin-left: 15px;
}

.button-text {
  text-align: left;
  padding: 10px;
  margin-left: 20px;
  font-weight: bold;
  font-size: 15px;
  color: #000000;
}

.button {
  border-radius: 10px;
  background-color: #d9d9d9;

  display: round;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  text-decoration: none;
  cursor: pointer;
  width: 80%;
}

.whole {
  text-align: center;
  margin: auto;
}

.drawcolor {
  background-color: #f2f2f2;
}

.button:hover {
  background: #f0f0f0;
}

.button:active {
  background: #ffffff;
  transition-duration: 0.2s;
}

.button:focus {
  outline: 0;
  background: #f0ddf5;
  transition-duration: 0.1s;
}
</style>
