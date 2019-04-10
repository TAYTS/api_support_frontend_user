<template>
  <v-navigation-drawer
    class="background side-panel__container"
    height="calc(100vh - 60px)"
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
  top: 60px;
  padding: 50px 15px;
}

.hightlighted {
  color: white;
}

.navigation-title {
  font-size: 16px;
  font-weight: bold;
}

.navigation-item {
  margin: 10px 0;
}

.navigation-item:hover,
.navigation-item > a:hover {
  background-color: #d099ef;
  border-radius: 10px;
}
</style>
