<template>
  <v-layout class="create-ticket__container" align-center justify-center>
    <v-flex xs12 sm3 md12 lg6>
      <v-card class="elevation-12">
        <v-toolbar card color="accent1">
          <v-toolbar-title>Create Ticket</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              color="blue"
              v-model="title"
              name="login"
              label="Ticket Title"
              type="text"
              :rules="titleRules"
              :error-messages="error_messages"
              required
            ></v-text-field>
            <v-select
              color="blue"
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
              color="blue"
              v-model="messages"
              name="message"
              :rules="messageRules"
              :error-messages="error_messages"
              label="Messages"
              no-resize
              rows="8"
              required
            ></v-textarea>
            <input
              class="file-upload"
              type="file"
              multiple="true"
              ref="upload"
              @change="handleAddFiles($event.target.files)"
            >
            <v-select
              color="blue"
              v-model="files"
              label="Files"
              append-icon
              prepend-icon="attach_file"
              readonly
              return-object
              multiple
              :hint="uploadHint"
              persistent-hint
              item-text="name"
              item-value="name"
              :items="files"
              @click:prepend="addFiles"
            >
              <template slot="selection" slot-scope="props">
                <v-chip
                  class="chip--select-multi"
                  close
                  :key="props.item.name"
                  @input="removeFile(props.index)"
                  @click="preview(props.item)"
                >{{ props.item.name }}</v-chip>
              </template>
            </v-select>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                outline
                round
                color="#0274ff"
                :loading="creating"
                :disabled="creating"
                @click="submit"
              >Submit</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
      <!-- Prompt Error Message -->
      <v-snackbar v-model="snackbar" class="error-message" :timeout="timeout" bottom>
        {{ snackbarText }}
        <v-btn dark flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <!-- Preview Uploaded Files -->
      <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        fullscreen
        scrollable
        hide-overlay
      >
        <v-card>
          <v-toolbar dark color="0274ff">
            <v-btn icon dark @click="selected = null">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Preview</v-toolbar-title>
          </v-toolbar>
          <template v-if="fileData !== null && type !== null">
            <!-- Preview PDF file -->
            <embed
              v-if="type === 'application/pdf'"
              class="view-pdf"
              :type="type"
              :src="fileData"
              :key="fileData"
            >
            <!-- Preview Image file -->
            <v-card-text v-else-if="type.substring(0, 6) === 'image/'">
              <img :src="fileData" :key="fileData">
            </v-card-text>
            <!-- Unable to preview other format(should not happen) -->
            <v-card-text v-else>
              <v-alert type="error" :value="true">{{ type }} not supported.</v-alert>
            </v-card-text>
          </template>
        </v-card>
      </v-dialog>
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
          if (!v || v.length <= 0) return "Category is required";
          else if (v.length > 1) {
            return "Please select 1 category only";
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
      snackbarText: "",
      files: [],
      fileSize: 0,
      maxFileSize: 10485760, // 10MB
      acceptFileTypes: ["application/pdf", "image/jpeg", "image/png"],
      selected_: null,
      dialog: false,
      type: null,
      fileData: null,
      uploadHint: "Max limit 10MB. (Supported format: .pdf, .jpg, .jpeg, .png)",
      creating: false
    };
  },
  computed: {
    selected: {
      get() {
        return this.selected_;
      },
      set(value) {
        if (this.fileData) {
          // Release existing object URL which was previously
          // created by createObjectURL()
          URL.revokeObjectURL(this.fileData);
        }
        if (value) {
          this.fileData = URL.createObjectURL(value.file || value.blob);
          this.type = value.type;
          this.dialog = true;
        } else {
          this.dialog = false;
          this.type = null;
          this.fileData = null;
        }
        this.selected_ = value;
      }
    }
  },
  beforeDestroy() {
    this.selected = null;
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
        const category = this.selectedCategories;
        const message = this.messages;
        const files = this.files;

        // Block the submit button
        this.creating = true;
        this.$store
          .dispatch("tickets/createTicket", {
            title,
            category,
            message
          })
          .then(id_ticket => {
            if (id_ticket) {
              this.$store.dispatch("messages/updateChannels").then(status => {
                if (status === 1) {
                  this.$store
                    .dispatch("messages/sendMessage", {
                      message,
                      id_channel: id_ticket
                    })
                    .then(status => {
                      if (status === 1) {
                        if (files.length > 0) {
                          this.$store
                            .dispatch("messages/sendMedia", {
                              files,
                              id_channel: id_ticket
                            })
                            .then(status => {
                              this.creating = false;
                              this.files = [];
                              if (status > 0) {
                                this.$router.replace({ name: "TicketListing" });
                              } else {
                                this.snackbar = true;
                                this.snackbarText =
                                  "Ticket is created but the files are unable to upload.";
                              }
                            });
                        } else {
                          this.creating = false;
                          this.$router.replace({ name: "TicketListing" });
                        }
                      } else {
                        this.creating = false;
                        this.$router.replace({ name: "TicketListing" });
                        this.snackbar = true;
                        this.snackbarText =
                          "Ticket is created but the content is unable to send, please update at the Ticket Records.";
                      }
                    });
                }
              });
            } else {
              this.snackbar = true;
              this.snackbarText =
                "Unable to create the ticket. Please try again.";
            }
          });
      }
    },
    addFiles() {
      this.$refs.upload.click();
    },
    handleAddFiles(files) {
      let maxLimit;
      if (files.length === 0) {
        return;
      }

      const types = this.acceptFileTypes;

      for (let i = 0, file, push; i < files.length; i++) {
        file = files[i];
        // Check allowed file types
        push = this.acceptFileTypes.includes(file.type);
        // Check no duplicate files
        for (let j = 0, item; j < this.files.length; j++) {
          item = this.files[j];
          if (item.name === file.name) {
            push = false;
            break;
          }
        }
        // Check the total uploaded files size
        push = this.fileSize + file.size > this.maxFileSize ? false : push;
        maxLimit = this.fileSize + file.size > this.maxFileSize ? true : false;
        // if the file upload greater than the maximum limit
        // notify the user through snackbar
        if (maxLimit) {
          this.snackbar = true;
          this.snackbarText =
            "Some files are unable to upload due upload limit.";
        }
        if (push) {
          this.fileSize += file.size;
          this.files.push({
            name: file.name,
            type: file.type,
            size: file.size,
            file
          });
        }
      }
      this.$refs.upload.value = "";
    },
    removeFile(key) {
      const size = this.files[key].size;
      this.fileSize -= size;
      this.files.splice(key, 1);
      this.files = [...this.files]; // Replace with new object
    },
    preview(item) {
      if (item.file || item.blob) {
        this.selected = item;
      }
    }
  }
};
</script>

<style>
.create-ticket__container {
  height: 100%;
}

.error-message {
  left: 230px;
}

.file-upload {
  display: none;
}

.view-pdf {
  width: 100%;
  height: 100%;
}
</style>
