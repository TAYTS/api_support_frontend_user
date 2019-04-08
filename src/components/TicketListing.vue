<template>
  <v-container class="ticketlist__container" fluid>
    <h2 class="title">Ticket Records</h2>
    <div class="tab-group">
      <button
        v-for="(title, index) in tabs"
        :key="index"
        @click="toggleTab(index)"
        class="tab-button"
        :id="index"
      >{{title.text}}</button>
    </div>
    <div class="tabview">
      <div class="tabview-header">
        <div class="tabview-title">Title</div>
        <div class="tabview-created">Created</div>
        <div class="tabview-lastactivity">Last Activity</div>
        <div class="tabview-status">Status</div>
      </div>
      <div class="ticket-holders hide">
        <Ticket
          class="closedTicket"
          v-for="ticket in closedTickets"
          :key="ticket.ticketID"
          :title="ticket.title"
          :created="ticket.create_timestamp"
          :lastActivity="ticket.last_activity"
          :status="ticket.status"
          @select-ticket="displayTickets(ticket.ticketID)"
        ></Ticket>
        <Ticket
          class="openTicket"
          v-for="ticket in openTickets"
          :key="ticket.ticketID"
          :title="ticket.title"
          :created="ticket.create_timestamp"
          :lastActivity="ticket.last_activity"
          :status="ticket.status"
          @select-ticket="displayTickets(ticket.ticketID)"
        ></Ticket>
      </div>
    </div>
    <v-snackbar v-model="snackbar" class="error-message" bottom>
      {{ snackbarText }}
      <v-btn dark flat @click="snackbar=false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import Ticket from "@/components/Ticket.vue";

export default {
  name: "TicketListing",
  components: {
    Ticket
  },
  data() {
    return {
      tabs: [
        { text: "Closed Tickets", status: 1 },
        { text: "Open Tickets", status: 0 }
      ],
      closedTickets: [],
      openTickets: [],
      snackbar: false,
      snackbarText: ""
    };
  },
  mounted() {
    // Pull data from the database
    this.$store.dispatch("tickets/getTickets").then(response => {
      if (response !== 0) {
        // TODO: Display splash image/message when there are no tickets for that categories
        this.openTickets = response.open;
        this.closedTickets = response.close;

        // Delay the frontend rendering to allow the v-for to take effective
        // after retrieve the data from server
        setTimeout(() => {
          // Render all the tickets
          const ticketHolders = document.getElementsByClassName(
            "ticket-holders"
          );
          ticketHolders[0].classList.remove("hide");
          this.toggleTab(0);
        }, 1000);
      } else {
        this.snackbar = true;
        this.snackbarText =
          "Error in fetching the tickets. Please try again later.";
      }
    });

    // Style the tab view
    const btn = document.getElementById(0);
    const contentBox = document.getElementsByClassName("tabview");
    btn.classList.add("close");
    contentBox[0].classList.add("close");
  },
  methods: {
    toggleTab(index) {
      const btns = document.getElementsByClassName("tab-button");
      const contentBox = document.getElementsByClassName("tabview");
      const openTickets = Array.from(document.querySelectorAll(".openTicket"));
      const closedTickets = Array.from(
        document.querySelectorAll(".closedTicket")
      );

      this.tabs[index].status = 1;
      if (index === 0) {
        btns[0].classList.add("close");
        btns[1].classList.remove("open");
        contentBox[0].classList.add("close");
        contentBox[0].classList.remove("open");

        openTickets.forEach(element => {
          element.classList.add("hide");
        });
        closedTickets.forEach(element => {
          element.classList.remove("hide");
        });
      } else if (index === 1) {
        btns[0].classList.remove("close");
        btns[1].classList.add("open");
        contentBox[0].classList.remove("close");
        contentBox[0].classList.add("open");

        openTickets.forEach(element => {
          element.classList.remove("hide");
        });
        closedTickets.forEach(element => {
          element.classList.add("hide");
        });
      }
    },
    displayTickets(ticketID) {
      this.$router.replace("/ticket/" + ticketID);
    }
  }
};
</script>

<style scoped>
.ticketlist__container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.title {
  font-weight: normal;
  margin-bottom: 30px;
  padding-left: 40px;
}

.tab-group {
  padding: 0 20px;
}

.tab-button {
  position: relative;
  background-color: #ba5a31;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 10px 10px 0 0;
  transform: rotateX(50);
  font-weight: bold;
  font-size: 16px;
}

.tab-button:focus {
  outline: 0;
}

.close {
  background-color: #e59f71;
}

.open {
  background-color: #a991b6;
}

.tabview {
  width: 100%;
  height: 600px;
  border-radius: 10px;
  padding: 40px 5px;
}

.tabview-header {
  margin: 0 60px;
  border-bottom: solid 2px #9f2edf;
}

.tabview-header > * {
  display: inline-block;
  width: 15%;
  font-size: 16px;
  font-weight: bold;
}

.tabview-title {
  width: 50%;
}

.ticket-holders {
  width: 100%;
  height: 100%;
  padding: 0 50px;
  overflow: auto;
}

.hide {
  display: none;
}
</style>
