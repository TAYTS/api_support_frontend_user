<template>
  <div class="backdrop">
    <div class="loading">
      <v-progress-circular :size="120" :width="15" indeterminate color="accent"></v-progress-circular>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: ["ready"],
  mounted() {
    // this.activate();
    if (!this.ready) {
      this.activate();
    } else {
      this.deactivate();
    }
  },
  watch: {
    ready: function() {
      if (!this.ready) {
        this.activate();
      } else {
        this.deactivate();
      }
    }
  },
  methods: {
    activate() {
      const backdrop = document.querySelector(".backdrop");
      backdrop.style.display = "block";
      setTimeout(() => {
        backdrop.classList.add("open");
      }, 10);
    },
    deactivate() {
      const backdrop = document.querySelector(".backdrop");
      backdrop.classList.remove("open");
      setTimeout(() => {
        backdrop.style.display = "none";
      }, 200);
    }
  }
};
</script>

<style scoped>
.backdrop {
  display: block;
  position: fixed;
  opacity: 0;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  transition: all 0.2s linear;
}

.open {
  opacity: 1;
}

.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
