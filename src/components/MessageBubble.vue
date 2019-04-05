<template>
  <div :class="(reply === false) ? 'message__container reply' : 'message__container'">
    <div class="message">
      <div v-if="type === 'text'">{{ message }}</div>
      <div v-else>
        <v-icon color="white" @click="$emit('download-media')">cloud_download</v-icon>
        {{message}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageBubble",
  props: ["message", "type", "reply"]
};
</script>

<style scoped>
.message__container {
  margin: 5px 0;
  width: 100%;
}

.message {
  display: inline-block;
  max-width: 50%;
  padding: 5px;
  border-radius: 5px;
  background-color: #e0bdf5;
  word-wrap: break-word;
  font-size: 16px;
  text-align: left;
}

.reply {
  text-align: right;
}
</style>
