<template>
  <v-navigation-drawer
    class="side-panel__container lightbackground"
    height="100vh"
    width="230px"
    permanent
    absolute
  >
    <v-list>
      <v-list-tile
        v-for="(item, index) in items"
        :key="index"
        :to="item.path"
        active-class="hightlighted"
        class="navigation-item"
      >
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="navigation-title" v-html="item.title"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "Ticket Records",
          icon: "view_list",
          path: "/ticket-listing"
        },
        {
          title: "Create Ticket",
          icon: "note_add",
          path: "/create-ticket"
        }
      ]
    };
  }
};
</script>

<style>
.side-panel__container {
  padding: 90px 15px;
  color: rgb(110, 107, 248);
}

.hightlighted {
  color: black;
}

.navigation-title {
  font-size: 16px;
  color: #4d4d4d;
}

.navigation-item {
  border: solid 1px #648ffa;
  border-radius: 8px;
  margin: 10px 0;
  width: 100%;
}

.navigation-item:hover,
.navigation-item > a:hover {
  background-color: #e0c2f0;
  border-radius: 10px;
}
</style>
