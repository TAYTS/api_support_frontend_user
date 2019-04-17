<template>
  <div class="login" @keyup.enter="submit">
    <v-container fluid class="login__container">
      <v-layout align-center justify-center row fill-height>
        <v-flex xs7 class="text-xs-right">
          <img class="logo-main" src="../assets/img/Accenture_Support_Staff.svg" alt>
        </v-flex>
        <v-flex xs1 class="text-xs-center">
          <div class="main-divider"></div>
        </v-flex>
        <v-flex xs7 class="text-xs-left">
          <v-container class="form__container">
            <v-layout column fill-height>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-flex xs5>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    :error-messages="error_messages"
                    @update:error="toggle_error"
                    @input="update_error_message"
                    label="EMAIL"
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
                        <div>
                          <a class="register" @click="activateDialog()">New user? Register here!</a>
                        </div>
                        <registration-dialog/>
                      </v-layout>
                    </v-card-actions>
                  </v-card>
                </v-flex>
                <v-flex xs5 class="login-options_container">
                  <div class="separator">
                    <hr class="login-divider">
                    <p>
                      <em>OR</em>
                    </p>
                    <hr class="login-divider">
                  </div>
                  <div class="social-btns">
                    <button type="button" class="google-button" v-on:click="signIn">
                      <span class="google-button__icon">
                        <img src="../assets/icons/google_icon.svg">
                      </span>
                      <span class="google-button__text">Sign in with Google</span>
                    </button>
                  </div>
                </v-flex>
              </v-form>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
    <vue-recaptcha
      ref="recaptchaLogin"
      sitekey="6LdUL54UAAAAAMAh2UefbbeTtmJGd3fRk02dP9QK"
      @verify="onCaptchaClick"
      @expired="onCaptchaExpired"
      size="invisible"
    ></vue-recaptcha>
  </div>
</template>

<script>
import Vue from "vue";
import RegistrationDialog from "@/components/RegistrationDialog.vue";
import EventBus from "@/store/eventBus.js";
import VueRecaptcha from "vue-recaptcha";

export default {
  components: {
    RegistrationDialog,
    VueRecaptcha
  },
  data: () => {
    return {
      show: false,
      valid: false,
      error: false,
      email: "",
      emailRules: [
        v => !!v || "Email is required",
        v =>
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Email must be valid"
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
    setTimeout(() => {
      logo.classList.add("show");
      logo.classList.add("move");
    }, 10);
    setTimeout(() => {
      form.classList.add("show");
      form.classList.add("move");
    }, 10);
  },
  methods: {
    onCaptchaClick: function(recaptchaToken) {
      const pass = this.$refs.form.validate();
      if (pass) {
        const email = this.email;
        const password = this.password;
        const remember = this.remember;
        this.$store
          .dispatch("user/login", {
            email,
            password,
            remember,
            recaptchaToken
          })
          .then(status => {
            if (status === 1) {
              this.$store.dispatch("messages/initClient");
              this.$router.replace("/");
            } else {
              this.error = true;
              this.email = "";
              this.password = "";
              this.error_messages.push("Invalid email or password!");
            }
          });
      }
    },
    submit() {
      this.$refs.recaptchaLogin.execute();
    },
    onCaptchaExpired: function() {
      this.$refs.recaptchaLogin.reset();
    },
    toggle_error() {
      this.error = !this.error;
    },
    update_error_message() {
      this.error_messages.pop();
    },
    signIn() {
      Vue.googleAuth().signIn(authorizationCode => {
        this.$store
          .dispatch("user/glogin", {
            code: authorizationCode,
            redirect_uri: "postmessage"
          })
          .then(status => {
            if (status === 1) {
              this.$router.replace("/");
            } else {
              alert("Unable to login");
            }
          });
      });
    },
    activateDialog() {
      EventBus.$emit("openRegistrationDialog");
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
  width: 300px;
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

.main-divider {
  width: 5px;
  height: 500px;
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

.action__container {
  padding: 8px 12px;
}

.action__container > * {
  padding: 0;
  margin: 0;
  width: 60%;
}

.separator {
  margin: 16px 0px;
  line-height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.separator > p {
  display: inline-block;
  margin: 0 16px;
  font-size: 20px;
  color: white;
  font-weight: bold;
}

.separator > hr {
  border: 1.5px solid #9f2edf;
  border-radius: 1.5px;
  width: 42%;
  display: inline-block;
}

.register {
  padding-left: 1px;
  color: #0645ad;
  font-size: 15px;
}

.social-btns {
  height: 50px;
}

.google-button {
  height: 100%;
  width: 100%;
  background: white;
  color: #737373;
  border-radius: 5px;
  white-space: nowrap;
  box-shadow: 1px 1px 0px 1px rgba(0, 0, 0, 0.05);
  transition-property: background-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
  padding: 0;
  display: flex;
  justify-content: center;
}

.google-button:focus,
.google-button:hover {
  box-shadow: 1px 4px 5px 1px rgba(0, 0, 0, 0.1);
  outline: 0;
}

.google-button:active {
  background-color: #e5e5e5;
  box-shadow: none;
  transition-duration: 10ms;
}

.google-button__icon {
  display: inline-block;
  vertical-align: middle;
  width: 28px;
  height: 28px;
}

.google-button__text {
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
  font-weight: bold;
  margin: 0 15% 0 10%;
}
</style>
