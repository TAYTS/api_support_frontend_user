<template>
  <div class="ticket-holder" @click="$emit('select-ticket')">
    <div class="ticket-title">{{title}}</div>
    <div class="created">{{created}}</div>
    <div class="lastActivity">{{lastActivity}}</div>
    <div class="status">{{status}}</div>
  </div>
</template>

<script>
export default {
  name: "Ticket",
  props: ["title", "created", "lastActivity", "status"]
};
</script>

<style scoped>
.ticket-holder {
  width: 100%;
  height: 80px;
  margin: 10px 0;
  border-radius: 5px;
  padding: 5px 10px;
  background-color: transparent;
  border: solid 2px #9f2edf;
}

.ticket-holder:hover {
  background-color: #908e91;
  cursor: pointer;
}

.ticket-holder > * {
  display: inline-block;
  width: 15%;
  font-size: 16px;
  font-weight: bold;
}

.ticket-title {
  width: 50%;
}
</style>

