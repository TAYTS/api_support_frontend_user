<template>
  <div class="messaging-room__container">
    <v-toolbar class="messaging-room__header" dark color="accent">
      <v-btn icon class="hidden-xs-only" @click="ticketListing">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>Ticket: {{ id }}</v-toolbar-title>
    </v-toolbar>
    <div class="messages__container">
      <MessageBubble
        v-for="message in messages"
        :key="message.index"
        :message="message.message"
        :type="message.type"
        :reply="message.reply"
        @download-media="downdloadMedia(message.index)"
      ></MessageBubble>
    </div>
    <v-textarea
      class="input-field"
      v-model="message"
      solo
      flat
      hide-details
      no-resize
      rows="5"
      label="Type here..."
      prepend-inner-icon="attach_file"
      color="accent"
      background-color="lightbackground"
      @keyup.enter="sendMessage"
      @click:prepend-inner.stop="addFiles"
    ></v-textarea>
    <input
      class="file-upload"
      type="file"
      multiple="true"
      ref="upload"
      @change="handleAddFiles($event.target.files)"
    >
    <v-dialog class="upload-dialog" v-model="dialog" persistent max-width="600px" lazy>
      <v-card>
        <v-toolbar dark color="accent">
          <v-toolbar-title class="title text-xs-center">Confirm Upload</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-select
              color="accent"
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
              @click:prepend.stop="addFiles"
            >
              <template slot="selection" slot-scope="props">
                <v-chip
                  class="chip--select-multi"
                  close
                  :key="props.item.name"
                  @input="removeFile(props.index)"
                >{{ props.item.name }}</v-chip>
              </template>
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red lighten-2" :disabled="uploading" @click="cancelUpload">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="accent"
            :loading="uploading"
            :disabled="uploading"
            @click="confirmUpload"
          >Confirm</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" class="error-message" bottom>
      {{ snackbarText }}
      <v-btn dark flat @click="snackbar=false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import MessageBubble from "@/components/MessageBubble.vue";

export default {
  name: "MessaggingRoom",
  components: {
    MessageBubble
  },
  data() {
    return {
      message: "",
      messages: [],
      channel: null,
      files: [],
      fileSize: 0,
      maxFileSize: 10485760, // 10MB
      acceptFileTypes: ["application/pdf", "image/jpeg", "image/png"],
      uploadHint: "Max limit 10MB. (Supported format: .pdf, .jpg, .jpeg, .png)",
      uploading: false,
      snackbar: false,
      timeout: 3000,
      snackbarText: "",
      dialog: false
    };
  },
  props: ["id"],
  mounted() {
    const messageContainer = document.querySelector(".messages__container");
    this.channel = this.$store.getters["messages/getChannel"](this.id);
    this.$store
      .dispatch("messages/getMessages", { id_channel: this.id })
      .then(messages => {
        this.messages = [...messages];
        // Scroll to the bottom of the message container
        setTimeout(() => {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 1);
        if (this.channel) {
          this.channel.on("messageAdded", this.updateMessage);
        }
      });
  },
  methods: {
    ticketListing() {
      this.$router.replace({ name: "TicketListing" });
    },
    sendMessage() {
      const message = this.message;
      if (message.trim() !== "") {
        this.$store
          .dispatch("messages/sendMessage", {
            message,
            id_channel: this.id
          })
          .then(status => {
            if (status) {
              this.message = "";
            }
          });
      } else {
        this.message = "";
      }
    },
    updateMessage() {
      this.$store
        .dispatch("messages/getMessages", { id_channel: this.id })
        .then(messages => {
          this.messages = [...messages];
        });
    },
    downdloadMedia(index) {
      this.$store.dispatch("messages/downloadMedia", { index });
    },
    addFiles() {
      this.$refs.upload.click();
    },
    removeFile(key) {
      const size = this.files[key].size;
      this.fileSize -= size;
      this.files.splice(key, 1);
      this.files = [...this.files]; // Replace with new object
      if (this.files.length === 0) {
        this.uploading = true;
        this.dialog = false;
      }
    },
    handleAddFiles(files) {
      let maxLimit;
      let fileTypeErr = 0;
      if (files.length === 0) {
        return;
      }

      const types = this.acceptFileTypes;

      for (let i = 0, file, push; i < files.length; i++) {
        file = files[i];
        // Check allowed file types
        push = this.acceptFileTypes.includes(file.type);
        if (push === false) {
          this.snackbar = true;
          this.snackbarText =
            "Unsupported file format. (Supported format: .pdf, .jpg, .jpeg, .png)";
        }
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

      // Prompt dialog
      if (this.files.length > 0) {
        this.dialog = true;
        this.uploading = false;
      } else {
        this.dialog = false;
        this.uploading = false;
      }
    },
    cancelUpload() {
      this.fileSize = 0;
      this.files = [];
      this.dialog = false;
    },
    confirmUpload() {
      // Send media files
      const files = this.files;
      const id_channel = this.id;
      this.uploading = true;
      this.$store
        .dispatch("messages/sendMedia", { files, id_channel })
        .then(status => {
          if (status > 0) {
            // Success
            // Clear the buffer
            this.fileSize = 0;
            this.files = [];
            this.dialog = false;
          }
        });
    }
  }
};
</script>

<style scoped>
.messaging-room__container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.messaging-room__header {
  border-radius: 5px 5px 0 0;
}

.messages__container {
  margin: 0;
  padding: 10px;
  background-color: #e6e6e6;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 80%;
  min-height: 500px;
  max-height: 500px;
  overflow: auto;
}

.input-field {
  border-top: 1px solid #8c8c8c;
}

.file-upload {
  display: none;
}

.upload-form {
  display: fixed;
  z-index: 300;
}
</style>
