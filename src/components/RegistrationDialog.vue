<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar card dark color="primary">
          <v-toolbar-title class="headline">Register new user</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    :error-messages="error_messages"
                    @update:error="toggle_error"
                    @input="update_error_message"
                    label="Username"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    :error-messages="error_messages"
                    @update:error="toggle_error"
                    @input="update_error_message"
                    label="Email"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :error-messages="error_messages"
                    @update:error="toggle_error"
                    @input="update_error_message"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    v-model="passwordCheck"
                    :rules="passwordCheckRules"
                    :error-messages="error_messages"
                    @update:error="toggle_error"
                    @input="update_error_message"
                    label="Confirm Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <vue-recaptcha
            ref="recaptchaRegister"
            sitekey="6LdRL54UAAAAANhFg4AV5GyluUCG2Wf9a9MDN5hs"
            @verify="onCaptchaClick"
            @expired="onCaptchaExpired"
          ></vue-recaptcha>
        </v-card-text>
        <v-card-actions class="buttons">
          <v-spacer></v-spacer>
          <v-btn color="purple darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn
            color="purple darken-1"
            flat
            :disabled="!valid || this.recaptchaToken == ''"
            @click="submit()"
          >Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmation" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Registration successful!</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="purple darken-1" flat="flat" @click="closeWindow()">Okay</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import EventBus from "@/store/eventBus.js";
import VueRecaptcha from "vue-recaptcha";

export default {
  components: {
    VueRecaptcha
  },
  data() {
    return {
      dialog: false,
      valid: false,
      error: false,
      email: "",
      username: "",
      emailRules: [
        v => !!v || "Email is required",
        v =>
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Email must be valid"
      ],
      passwordCheckRules: [
        v => !!v || "Confirmation password is required",
        v => v == this.password || "password must match"
      ],
      password: "",
      passwordCheck: "",
      passwordRules: [v => !!v || "Password is required"],
      usernameRules: [v => !!v || "Username is required"],
      error_messages: [],
      confirmation: false,
      recaptchaToken: ""
    };
  },
  methods: {
    onCaptchaClick: function(recaptchaToken) {
      this.recaptchaToken = recaptchaToken;
    },
    onCaptchaExpired: function() {
      this.recaptchaToken = "";
      this.$refs.recaptchaRegister.reset();
    },
    closeWindow() {
      this.confirmation = false;
      this.dialog = false;
      this.password = "";
      this.passwordCheck = "";
      this.username = "";
      this.email = "";
      this.valid = false;
      this.error = false;
    },
    submit() {
      const pass = this.$refs.form.validate();
      if (pass) {
        const email = this.email;
        const password = this.password;
        const username = this.username;
        const recaptchaToken = this.recaptchaToken;
        this.$store
          .dispatch("user/register", {
            email,
            username,
            password,
            recaptchaToken
          })
          .then(status => {
            if (status === 1) {
              this.confirmation = true;
              this.onCaptchaExpired();
            } else {
              this.error = true;
              this.email = "";
              this.password = "";
              this.passwordCheck = "";
              this.username = "";
              this.onCaptchaExpired();
              this.error_messages.push("Account already exists");
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
  },
  mounted() {
    EventBus.$on("openRegistrationDialog", () => {
      this.dialog = true;
      this.valid = false;
    });
  }
};
</script>

<style scoped>
.buttons {
  top: 0;
  margin-top: 0;
}
</style>
