<template>
  <div class="messaging-room__container">
    <v-toolbar class="messaging-room__header" color="accent1">
      <v-btn icon @click="ticketListing">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>Ticket: {{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :disabled="resolved" @click="resolvingTicket = true">
        <v-icon>check</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="messages__container">
      <MessageBubble
        v-for="message in messages"
        :key="message.index"
        :message="message.message"
        :type="message.type"
        :reply="message.reply"
        :index="message.index"
        @download-media="downdloadMedia(message.index)"
      ></MessageBubble>
    </div>
    <div class="message-action">
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
        append-icon="send"
        color="accent"
        background-color="white"
        :disabled="resolved"
        @keyup.enter="sendMessage"
        @click:prepend-inner.stop="addFiles"
        @click:append.stop="sendMessage"
      ></v-textarea>
    </div>
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
    <v-dialog class="resolve-dialog" v-model="resolvingTicket" persistent max-width="350px" lazy>
      <v-card>
        <v-toolbar dark color="accent">
          <v-spacer/>
          <v-toolbar-title class="title text-xs-center">Confirm Resolve Ticket?</v-toolbar-title>
          <v-spacer/>
        </v-toolbar>
        <v-container>
          <v-card-actions>
            <v-btn color="red lighten-2" large @click="resolvingTicket = false">Cancel</v-btn>
            <v-spacer/>
            <v-btn color="accent" large @click="resolveTicket">Confirm</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="timeout" bottom>
      {{ snackbarText }}
      <v-btn dark flat @click="snackbar=false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import MessageBubble from "@/components/MessageBubble.vue";
import EventBus from "@/store/eventBus.js";

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
      dialog: false,
      resolved: false,
      resolvingTicket: false,
      title: ""
    };
  },
  props: ["id"],
  mounted() {
    this.resolved = this.$store.getters["tickets/getStatus"](this.id);
    this.title = this.$store.getters["tickets/getTicketTitle"](
      this.resolved,
      this.id
    );
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
      const messageContainer = document.querySelector(".messages__container");
      this.$store
        .dispatch("messages/getMessages", { id_channel: this.id })
        .then(messages => {
          this.messages = [...messages];
          setTimeout(() => {
            messageContainer.scrollTop = messageContainer.scrollHeight;
          }, 1);
        });
    },
    downdloadMedia(index) {
      this.$store.dispatch("messages/downloadMedia", { index }).then(() => {
        EventBus.$emit("finishDownload", index);
      });
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
            this.uploading = false;
            this.fileSize = 0;
            this.files = [];
            this.dialog = false;
          }
        });
    },
    resolveTicket() {
      const id_ticket_hash = this.id;
      this.$store
        .dispatch("tickets/resolveTicket", { id_ticket_hash })
        .then(status => {
          if (status === 1) {
            this.$router.replace({ name: "TicketListing" });
          } else {
            this.snackbar = true;
            this.snackbarText = "Unable to reolve ticket, please try again.";
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
  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2),
    0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12);
}

.messaging-room__header {
  border-radius: 5px 5px 0 0;
}

.messages__container {
  margin: 0;
  padding: 15px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 150px;
  overflow: auto;
}

.message-action {
  flex: 0;
  padding: 15px;
  background-color: #f4f4f4;
  border-radius: 0 0 5px 5px;
}

.file-upload {
  display: none;
}

.upload-form {
  display: fixed;
  z-index: 300;
}
</style>
