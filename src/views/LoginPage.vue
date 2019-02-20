<template>
  <div class="login">
    <v-container fluid class="login__container">
      <v-layout align-center justify-center row fill-height>
        <v-flex xs7 class="text-xs-right">
          <img class="logo-main" src="../assets/img/Accenture_Support_Staff.svg" alt>
        </v-flex>
        <v-flex xs1 class="text-xs-center">
          <div class="divider"></div>
        </v-flex>
        <v-flex xs7 class="text-xs-left">
          <v-container class="form__container">
            <v-layout column fill-height>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-flex xs5>
                  <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    :error-messages="error_messages"
                    @update:error="toggle_error"
                    @input="update_error_message"
                    label="USERNAME"
                    solo
                    prepend-inner-icon="person"
                    dark
                    color="secondary"
                    background-color="background"
                  ></v-text-field>
                </v-flex>
                <v-flex xs5>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :error-messages="error_messages"
                    @update:error="toggle_error"
                    @input="update_error_message"
                    label="PASSWORD"
                    :type="show ? 'text' : 'password'"
                    :append-icon="show ? 'visibility' : 'visibility_off'"
                    @click:append="show = !show"
                    solo
                    prepend-inner-icon="lock"
                    dark
                    color="secondary"
                    background-color="background"
                  ></v-text-field>
                </v-flex>
                <v-flex xs5>
                  <v-card color="background">
                    <v-card-actions class="action__container">
                      <v-layout column>
                        <v-checkbox v-model="remember" color="white" dark label="REMEMBER ME"></v-checkbox>
                        <v-btn block large color="accent" :disabled="!valid" @click="submit">SIGN IN</v-btn>
                      </v-layout>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-form>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      show: false,
      valid: false,
      error: false,
      username: "",
      usernameRules: [
        v => !!v || "Username is required",
        v => /.+@.+\..+/.test(v) || "Username must be valid"
      ],
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      remember: false,
      error_messages: []
    };
  },
  mounted() {
    const logo = document.querySelector(".logo-main");
    const form = document.querySelector(".form__container");
    setTimeout(function() {
      logo.classList.add("show");
      logo.classList.add("move");
    }, 10);
    setTimeout(function() {
      form.classList.add("show");
      form.classList.add("move");
    }, 10);
  },
  methods: {
    submit() {
      const pass = this.$refs.form.validate();
      if (pass) {
        const username = this.username;
        const password = this.password;
        const remember = this.remember;
        this.$store
          .dispatch("user/login", {
            username,
            password,
            remember
          })
          .then(status => {
            if (status === 1) {
              this.$router.replace("/");
            } else {
              this.error = true;
              this.username = "";
              this.password = "";
              this.error_messages.push("Invalid username or password!");
            }
          });
      }
    },
    toggle_error() {
      this.error = !this.error;
    },
    update_error_message() {
      this.error_messages.pop();
    }
  }
};
</script>

<style scoped>
.login {
  height: 100%;
  width: 100%;
  background-image: linear-gradient(to right bottom, #ffffff, #d099ef);
}

.login__container {
  position: absolute;
  top: 50%;
  width: inherit;
  height: 55%;
  transform: translateY(-50%);
}

.logo-main {
  width: 20vw;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  transform: translateX(-20%);
  opacity: 0;
}

.show {
  opacity: 1 !important;
}

.move {
  transform: translateX(0) !important;
}

.divider {
  width: 5px;
  height: 50vh;
  background-image: radial-gradient(white 60%, rgba(255, 255, 255, 0) 90%);
  display: inline-block;
  border-radius: 10px;
}

.form__container {
  padding: 0;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  transform: translateX(10%);
  opacity: 0;
}

.action__container > * {
  padding: 0;
  margin: 0;
  width: 60%;
}
</style>
