<template>
  <v-app id="inspire">
    <Navbar/>

    <v-main>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-main>

    <v-footer color="blue darken-3" app absolute>
      <v-col class="text-center py-0" cols="12">
        <span class="white--text">Компания &copy; {{ new Date().getFullYear() }}</span>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import Navbar from "./components/Navbar"

export default {
  components: { Navbar },
  methods: {
    ...mapActions(['START_TASKS_FILLING', 'PUSH_FIRST_WORKERS'])
  },
  async created() {
    await this.PUSH_FIRST_WORKERS(7)
    await this.START_TASKS_FILLING(4)
  }
}
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>