<template>
  <v-layout class="create-ticket__container" align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="form__container elevation-12">
        <v-toolbar dark color="accent">
          <v-toolbar-title class="title text-xs-center">Create Ticket</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              color="accent"
              v-model="title"
              name="login"
              label="Ticket Title"
              type="text"
              :rules="titleRules"
              :error-messages="error_messages"
              required
            ></v-text-field>
            <v-select
              color="accent"
              v-model="selectedCategories"
              :items="categories"
              :filter="filter"
              :rules="categoriesRules"
              label="Please select the category for the ticket."
              chips
              deletable-chips
              multiple
              required
            ></v-select>
            <v-textarea
              color="accent"
              v-model="messages"
              name="message"
              :rules="messageRules"
              :error-messages="error_messages"
              label="Messages"
              required
            ></v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="accent" @click="submit">Submit</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
      <v-snackbar v-model="snackbar" class="error-message" bottom>
        {{ text }}
        <v-btn dark flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      title: "",
      titleRules: [v => !!v || "Title is required"],
      selectedCategories: null,
      categoriesRules: [
        v => {
          if (!v || v.length < 1) return "Category is required";
          else if (v.length > 3) {
            return "Maximum 3 categories";
          } else return true;
        }
      ],
      messages: "",
      messageRules: [v => !!v || "Message is required"],
      error_messages: [],
      categories: [
        "API DevOps",
        "Chart as a Service",
        "Recruiment Platform",
        "Aesop",
        "Travel Marketplace",
        "Banking Lifesyle App",
        "AR Car Visualizer",
        "AR Car Manual",
        "AR Gamification",
        "AR Threatre",
        "AR Menu",
        "AI Wealth Manager",
        "Multilingual Chatbot",
        "AI Translator",
        "Digital Butler",
        "Video Analytics",
        "Sentiment Analysis",
        "ACNAPI MFA Login",
        "Ticketing Platform",
        "Smart Lock",
        "Smart Home",
        "Smart Parkiing",
        "Smart Restaurant",
        "Queuing System",
        "IoT LED Wall",
        "Others"
      ],
      snackbar: false,
      timeout: 3000,
      text: "Unable to create the ticket. Please try again."
    };
  },
  methods: {
    filter(item, queryText, itemText) {
      if (item.header) return false;
      const hasValue = val => (val != null ? val : "");
      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      );
    },
    submit() {
      const pass = this.$refs.form.validate();
      if (pass) {
        const title = this.title;
        const category = this.selectedCategories.join();
        const message = this.messages;

        this.$store
          .dispatch("tickets/createTicket", {
            title,
            category,
            message
          })
          .then(status => {
            if (status === 1) {
              this.$router.replace({ name: "TicketListing" });
            } else {
              this.snackbar = true;
            }
          });
      }
    }
  }
};
</script>

<style>
.create-ticket__container {
  height: 100%;
}

.form__container {
  border-radius: 10px;
}

.error-message {
  left: 230px;
}
</style>
