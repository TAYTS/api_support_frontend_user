<template>
  <v-navigation-drawer v-model="drawer" fixed permanent absolute width="200px">
    <div id="logo-bg">
      <div id="logo-main">
        <img src="../assets/img/Accenture_User_Logo.svg" >
      </img >
    </div>
    </div>
    <div id="name-bg">
      <div id="name-main">
        <b>{{ userName }}</b>
      </div>
    </div>
    <div>
      <button class="button">
        <img
          class="button-image"
          src="../assets/img/plus.svg"
          alt
        />
        <div class="button-text">
          Create Ticket
        </div>
      </button>
      <button class="button">
        <img
          class="button-image"
          src="../assets/img/faq.svg"
          alt
        />
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
      userName: "User 123"
    };
  }

};
</script>

<style scoped>
#logo-bg {
  background-color: #f7e8ff;
  padding-top: 10px;
}

#logo-main {
  width: 130px;
  margin: auto;
  padding-right: 4px;
}

#name-bg {
  background-color: #dedede;
  padding-top: 15px;
  padding-bottom: 15px;
}

#name-main {
  text-align: center;
}

.button-image {
  width: 30px;
  margin-top: 7px;
  float: left;
  margin-left: 30px;
}

.button-text {
  text-align: left;
  padding: 10px;
  margin-left: 60px;
  font-size: 18px;
  color: #000000;
}

.button {
  background-color: #ffffff;
  display: block;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  text-decoration: none;
  cursor: pointer;
  width: 100%;
}

.button:hover {
  background: #f0f0f0;
}

.button:active {
  background: #ffffff;
  transition-duration: 0.1s;
}

.button:focus {
  outline: 0;
  background: #f0ddf5;
  transition-duration: 0.1s;
}
</style>
