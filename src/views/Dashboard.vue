<template>
    <v-container fluid class="px-8">
      <v-card class="pa-4" elevation="6" shaped>
          <v-card-title>
              Управление проектами издательства
          </v-card-title>
          <v-card-text>
              <v-container fluid class="text-center py-0">
                  <v-row>
                      <v-col cols="12" class="py-0">
                          <p class="title font-weight-regular mb-0"></p>
                      </v-col>
                  </v-row>
                  <v-row>
                      <v-col cols="12" md="12" class="px-0">
                          <p class="title font-weight-regular mb-0">Выбор проекта</p>
                          <v-container fluid class="px-0">
                              <v-dialog v-model="dialog" max-width="700" v-if="clickedManuscriptIndex[0] >= 0">
                                <v-card>
                                  <v-card-title class="headline">
                                    Редактирование рукописи №{{ TASKS[clickedManuscriptIndex[0]].id }}
                                  </v-card-title>
                                  <v-card-text>
                                      <v-textarea
                                        counter
                                        auto-grow
                                        outlined
                                        rows="3"
                                        shaped
                                        v-model="TASKS[clickedManuscriptIndex[0]].description"
                                        label="Описание"
                                        prepend-icon="mdi-card-text-outline"
                                      />
                                      <v-row>
                                        <v-col cols="12" md="6">
                                          <v-select
                                            v-model="TASKS[clickedManuscriptIndex[0]].worker"
                                            :items="WORKERS.map(x => x.workerId)"
                                            label="Ответственный сотрудник"
                                            prepend-icon="mdi-account-check"
                                            multiple
                                            chips
                                          ></v-select>
                                        </v-col>
                                        <v-col md="6">
                                          <v-select
                                            v-model="TASKS[clickedManuscriptIndex[0]].priority"
                                            :items="[0, 1, 2]"
                                            label="Приоритетность"
                                            prepend-icon="mdi-priority-high"
                                          >
                                            <template v-slot:item="{ item }">
                                              <v-chip :color="['green', 'orange', 'red'][item]" text-color="white">{{ ['low', 'medium', 'high', ][item] }}</v-chip>
                                            </template>
                                            <template v-slot:selection="{ item }">
                                              <v-chip small :color="['green', 'orange', 'red'][item]" text-color="white">{{ ['low', 'medium', 'high', ][item] }}</v-chip>
                                            </template>
                                          </v-select>
                                        </v-col>
                                        <v-col md="12">
                                          <v-menu
                                            ref="menu1"
                                            v-model="menu1"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="290px"
                                          >
                                            <template v-slot:activator="{ on, attrs }">
                                              <v-text-field
                                                v-model="dateFormatted"
                                                label="Срок выполнения"
                                                hint="ДД/ММ/ГГГГ формат"
                                                persistent-hint
                                                prepend-icon="mdi-calendar"
                                                v-bind="attrs"
                                                @blur="date = parseDate(dateFormatted)"
                                                v-on="on"
                                              ></v-text-field>
                                            </template>
                                            <v-date-picker
                                              v-model="date"
                                              no-title
                                              :first-day-of-week="1"
                                              locale="ru-ru"
                                              @input="menu1 = false"
                                            ></v-date-picker>
                                          </v-menu>
                                        </v-col>
                                      </v-row>
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="green darken-1"
                                      text
                                      @click="dialog = false"
                                    >
                                      OK
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                              <v-data-table v-model="selectedMatch" @click:row="tableRowClickHandler" sort-by="series" sort-desc :headers="seriesHeaders" :items="TASKS" item-key="id" class="elevation-0">
                                  <template v-slot:item.priority="{ item }">
                                    <!-- <v-btn icon :href="item.priority" target="_blank"><v-icon>mdi-web</v-icon></v-btn icon> -->
                                    <v-chip :color="['green', 'orange', 'red'][item.priority]" text-color="white">{{ ['low', 'medium', 'high', ][item.priority] }}</v-chip>
                                  </template>
                                  <template v-slot:item.description="{ item }">
                                      {{ item.description }}
                                  </template>
                                  <template v-slot:item.worker="{ item }">
                                      <!-- <p :class="['ma-0', 'font-weight-bold']">{{ item.worker }}</p> -->
                                      <v-chip class="ma-1" small v-for="worker in item.worker" :key="worker">
                                        {{ worker }}
                                      </v-chip>
                                  </template>
                                  <template v-slot:item.manuscript="{ item }">
                                      <p :class="['ma-0', 'font-weight-bold']">{{ item.id }}</p>
                                  </template>
                                  <template v-slot:item.status="{ item }">
                                    <v-chip
                                      @click.stop="item.status = (item.status + 1) % 3"
                                      class="ma-2"
                                     :color="status[item.status].color"
                                      outlined
                                    >
                                      <v-icon left>
                                        {{ status[item.status].icon }}
                                      </v-icon>
                                      {{ status[item.status].text }}
                                    </v-chip>
                                  </template>
                                  <template v-slot:item.due="{ item }">
                                      <p :class="['ma-0', 'font-weight-bold']">{{ item.due ? formatDate(item.due).replace(/\//g, '.') : "" }}</p>
                                  </template>
                              </v-data-table>
                          </v-container>
                      </v-col>
                  </v-row>
              </v-container>
          </v-card-text>
      </v-card>
    </v-container>
</template>

<script>
// import faker from 'faker'
import { mapGetters, mapMutations } from 'vuex'

export default {
    template: '#app-template',
    data: vm => ({
        chosenLeague: '',
        leagues: [],
        selectedMatch: [],

        seriesHeaders: [
            // { text: 'ID', value: 'id', align: 'center' },
            { text: 'Сотрудники', value: 'worker', align: 'center', sort: (a, b) => a.length - b.length },
            { text: 'Рукопись', value: 'manuscript', align: 'center' },
            { text: 'Описание', value: 'description', align: 'left' },
            { text: 'Срок выполнения', value: 'due', align: 'center', sort: (a, b) => new Date(a.split('.').reverse()) - new Date(b.split('.').reverse()) },
            { text: 'Приоритетность', value: 'priority', align: 'center' },
            { text: 'Статус', value: 'status', align: 'center' },
        ],

        // TASKS: [ {} ],
        historicalMatches: [],
        statisticMatches: [],

        matchesCounter: 1,

        socket: null,

        loading: {
            leagues: true,
            table: false,
            seriesTable: false,
        },
        stats: {
            series: { stage: 0, current: 0, total: 0 },
            matches: { stage: 0, current: 0, total: 0 },
        },

        dialog: false,
        clickedManuscriptIndex: [-1],
        
        date: new Date().toISOString().substr(0, 10),
        dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),

        menu1: false,

        status: [
            { color: 'warning', text: 'Обработка', icon: 'mdi-server-plus' },
            { color: 'primary', text: 'Редакция', icon: 'mdi-file-edit' },
            { color: 'success', text: 'Опубликовано', icon: 'mdi-check' },
        ]
    }),
    methods: {
        ...mapMutations(['SET_TASK']),
        randomDate(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        },
        tableRowClickHandler(value) {
        //   console.log(value.manuscript, this.TASKS)
            this.clickedManuscriptIndex = this.TASKS
                .map((x, i) => value.id === x.id ? i : -1)
                .filter(x => x >= 0)

            console.log(this.clickedManuscriptIndex)

            this.dialog = true

            this.date = this.TASKS[this.clickedManuscriptIndex[0]].due
            this.dateFormatted = this.formatDate(this.TASKS[this.clickedManuscriptIndex[0]].due)
        },
        formatDate(date, sep = '/') {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return [day, month, year].join(sep)
            },
        parseDate(date) {
            if (!date) return null

            console.log(date)
            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
    },
    watch: {
        date(val) {
            const temp = { ...this.TASKS[this.clickedManuscriptIndex[0]] }
            temp.due = val

            this.dateFormatted = this.formatDate(val)
            this.SET_TASK({
                index: this.clickedManuscriptIndex[0],
                value: temp
            })
        }
    },
    computed: {
        ...mapGetters(['TASKS', 'WORKERS']),
        computedDateFormatted () {
            return this.formatDate(this.date)
        },
    },
    async created() {
        

        // this.TASKS = Array.from({ length: 4 }, () => createTask())

        // const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        // const json = await response.json()

        // const projects = Array.from({ length: 4 }, () => json[Math.floor(Math.random() * json.length)])

        // this.TASKS = projects.map(({ userId, id, title }) => {
        //     const next = new Date()
        //     next.setDate(new Date().getDate() + 8)

        //     const randomDate = this.randomDate(new Date(), next)

        //     return {
        //         worker: userId,
        //         manuscript: id,
        //         description: title,
        //         priority: 2 - Math.floor(Math.ceil((randomDate - new Date()) / (1000 * 60 * 60 * 24)) / 3),
        //         due: randomDate.toISOString().substr(0, 10)
        //     }
        // })

        // setInterval(() => {
        //     // const { userId, id, title } = json[Math.floor(Math.random() * json.length)]

        //     // const next = new Date()
        //     // next.setDate(new Date().getDate() + 10)

        //     // const randomDate = this.randomDate(new Date(), next)

        //     this.TASKS.push(createTask())
        // }, 15000)
    }
}      
</script>