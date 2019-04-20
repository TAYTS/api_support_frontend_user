<template>
  <div class="ticket-holder" @click="$emit('select-ticket')">
    <div class="ticket-title">{{title}}</div>
    <div class="created">{{created}}</div>
    <div class="lastActivity">{{category}}</div>
    <div class="status">{{status}}</div>
  </div>
</template>

<script>
export default {
  name: "Ticket",
  props: ["title", "created", "category", "status"]
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
  border: solid 1px #648ffa;
  display: flex;
  align-items: center;
}

.ticket-holder:hover {
  background-color: #648efa41;
  cursor: pointer;
}

.ticket-holder > * {
  display: inline-block;
  width: 20%;
  font-size: 16px;
}

.ticket-title {
  width: 40%;
  padding-left: 15px;
}
</style>

