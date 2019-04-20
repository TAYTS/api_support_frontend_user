<template>
  <div :class="(reply === false) ? 'message__container reply' : 'message__container'">
    <div class="message">
      <div v-if="type === 'text'">{{ message }}</div>
      <div v-else-if="type === 'media' && reply === false">
        <v-icon
          :class="(rotate === false) ? '' : 'rotating'"
          color="white"
          @click="downloadHandler"
        >{{ iconName }}</v-icon>
        {{ message }}
      </div>
      <div v-else-if="type === 'media' && reply === true">
        {{ message }}
        <v-icon
          :class="(rotate === false) ? '' : 'rotating'"
          color="white"
          @click="downloadHandler"
        >{{ iconName }}</v-icon>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "@/store/eventBus.js";

export default {
  name: "MessageBubble",
  props: ["message", "type", "reply", "index"],
  data: () => {
    return {
      rotate: false,
      iconName: "cloud_download"
    };
  },
  mounted() {
    EventBus.$on("finishDownload", index => {
      if (index === this.index) {
        this.iconName = "cloud_download";
        this.rotate = false;
      }
    });
  },
  methods: {
    downloadHandler() {
      this.iconName = "loop";
      this.rotate = true;
      this.$emit("download-media");
    }
  }
};
</script>

<style scoped>
.message__container {
  margin: 5px 0;
  width: 100%;
}

.message {
  display: inline-block;
  max-width: 55%;
  padding: 10px 5px;
  border-radius: 5px;
  background-color: #e0bdf5;
  word-wrap: break-word;
  font-size: 16px;
  text-align: left;
}

.reply {
  text-align: right;
}

.rotating {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
