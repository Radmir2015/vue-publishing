<template>
<nav>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense rounded>
      <v-row class="text-center mb-1">
        <v-col>
          <Login/>
        </v-col>
      </v-row>
        <v-list-item v-for="sideMenuItem in sideMenuItems" :key="sideMenuItem.title" router :to="sideMenuItem.route">
          <v-list-item-action>
            <v-icon>{{ sideMenuItem.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ sideMenuItem.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense rounded>
        <v-list-item>
      <v-switch
        v-model="darkTheme"
        @click="changeTheme"
        color="success"
        hide-details
        class="ma-auto d-flex"
      >
        <template slot="label">
          <span class="text-button">Тёмная тема</span>
        </template>
      </v-switch>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="blue darken-3" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-container class="pa-0 px-5 text-truncate fitcontent">
          <router-link to="/about" style="text-decoration: none; color: inherit">
            <span class="text-h5 font-weight-bold">ИЗДАТЕЛЬСТВО</span> <span class="text-h5 font-weight-light">CRM</span>
          </router-link>
        </v-container>
        <v-spacer></v-spacer>
        <v-container class="d-inline-flex fitcontent">
            <v-btn text class="hidden-sm-and-down" router to="/">Дэшбоард</v-btn>
            <v-btn text class="hidden-sm-and-down" router to="/workers">Сотрудники</v-btn>
            <v-btn text class="hidden-sm-and-down" router to="/manuscripts">Рукописи</v-btn>
            <Login :hiddenOnMobile="true"/>
        </v-container>
    </v-app-bar>
    <v-snackbar
      v-model="snackbar"
      rounded
      :top="$vuetify.breakpoint.xs"
      timeout="7000"
      transition="slide-y-reverse-transition"
    >
      <p class="text-body-1 text-sm-h6 pa-0 ma-0 text-center font-weight-light">
        {{ congratsMessage() }}
      </p>

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
</nav>
</template>

<script>
import Login from './Login'

export default {
    components: {
      Login
    },
    data: () => ({
        foundationYear: 1955,
        drawer: false,
        darkTheme: false,
        snackbar: false,
        sideMenuItems: [
          { title: 'О проекте', icon: 'mdi-domain', route: '/about' },
          { title: 'Панель управления', icon: 'mdi-monitor-dashboard', route: '/' },
          { title: 'Сотрудники', icon: 'mdi-account-supervisor', route: '/workers' },
          { title: 'Рукописи', icon: 'mdi-book-open-blank-variant', route: '/manuscripts' },
          { title: 'Документы', icon: 'mdi-file', route: '/docs' },
          { title: 'Мероприятия', icon: 'mdi-calendar-text', route: '/events' },
          { title: 'Отзывы', icon: 'mdi-comment-quote-outline', route: '/reviews' },
          { title: 'Платные услуги', icon: 'mdi-toolbox-outline', route: '/docs#paid-service' },
          { title: 'Положения', icon: 'mdi-text-box', route: '/docs#regulations' },
          { title: 'Локальные документы', icon: 'mdi-file-document-outline', route: '/docs#local' },
        ],
    }),
    mounted() {
      this.darkTheme = localStorage.getItem('theme') === 'dark'
      this.snackbar = !!this.congratsMessage()
    },
    methods: {
      changeTheme() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        localStorage.setItem('theme', this.$vuetify.theme.dark ? 'dark' : 'light')
      },
      congratsMessage() {
        const difference = new Date().getFullYear() - this.foundationYear
        return (difference % 5 == 0) && `В этом году нашему издательству исполняется ${difference} лет!`
      }
    },
}
</script>

<style>
.fitcontent {
    max-width: fit-content !important;
}
</style>