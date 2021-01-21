<template>
    <v-container fluid>
        <v-card class="pa-4" elevation="0" shaped>
            <v-card-title>
                Сотрудники издательства <v-btn icon text @click="ADD_RANDOM_WORKER"><v-icon color="blue">mdi-account-plus</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <v-container fluid class="text-center py-0">
                    <v-row>
                        <v-col cols="12" class="py-0">
                            <!-- <p class="title font-weight-regular mb-0">12312312</p> -->
                            <v-container fluid class="px-0">
                                <v-data-table
                                    v-model="selectedWorker"
                                    @click:row="()=>{}"
                                    sort-by="workerId"
                                    sort-desc
                                    :headers="workersHeaders"
                                    :items="WORKERS"
                                    item-key="workerId"
                                    class="elevation-6"
                                    :single-expand="false"
                                    :expanded.sync="expanded"
                                    show-expand
                                >
                                    <template v-slot:item.workerId="{ item }">
                                        <p :class="['ma-0', 'font-weight-bold']">{{ item.workerId }}</p>
                                    </template>
                                    <template v-slot:item.workingYears="{ item }">
                                        <p :class="['ma-0', 'font-weight-bold']">{{ item.workingYears }}</p>
                                    </template>
                                    <template v-slot:item.assigned="{ item }">
                                        <v-chip>
                                            {{ TASKS.filter(x => x.worker.includes(item.workerId)).length }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:item.workingFrom="{ item }">
                                        <p :class="['ma-0', 'font-weight-bold']">{{ item.workingFrom.toDateString() }}</p>
                                    </template>
                                    <template v-slot:item.delete="{ item }">
                                        <v-btn @click="$delete(WORKERS, WORKERS.findIndex(x => x.workerId === item.workerId))" text icon><v-icon color="red">mdi-clipboard-remove-outline</v-icon></v-btn>
                                    </template>
                                    <template v-slot:expanded-item="{ headers, item }">
                                      <td :colspan="headers.length">
                                        <v-container fluid class="text-left mt-6">
                                            <v-row>
                                                <v-col
                                                    xl="3" lg="4" md="6" sm="12" class="py-0"
                                                    v-for="card in TASKS.filter(x => x.worker.includes(item.workerId))"
                                                    :key="card.id"
                                                >
                                                    <v-card class="mb-6">
                                                        <v-responsive :aspect-ratio="1/1">
                                                            <v-img
                                                                :src="card.image"
                                                                class="white--text align-end"
                                                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                                            >
                                                                <v-card-title>Рукопись №{{ card.id }}</v-card-title>
                                                            </v-img>

                                                            <v-card-title>
                                                              Выпустить до {{ card.due }}
                                                            </v-card-title>

                                                            <v-card-subtitle class="pb-0">
                                                              {{ card.description.split(' ').slice(0, 10).join(' ') + '...' }}
                                                            </v-card-subtitle>

                                                            <v-card-actions>
                                                                <v-chip
                                                                  @click="card.status = (card.status + 1) % 3"
                                                                  class="ma-2"
                                                                 :color="status[card.status].color"
                                                                  outlined
                                                                >
                                                                  <v-icon left>
                                                                    {{ status[card.status].icon }}
                                                                  </v-icon>
                                                                  {{ status[card.status].text }}
                                                                </v-chip>

                                                                <v-spacer></v-spacer>
                                                            </v-card-actions>
                                                        </v-responsive>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                      </td>
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
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'Workers',
    data: () => ({
        expanded: [],
        selectedWorker: [],
        workersHeaders: [
            { text: '№', value: 'workerId', align: 'center' },
            { text: 'Фамилия', value: 'lastname', align: 'center' },
            { text: 'Имя', value: 'name', align: 'center' },
            { text: 'Год рождения', value: 'birthYear', align: 'center' },
            { text: 'Работает с', value: 'workingFrom', align: 'center', sort: (a, b) => new Date(a) - new Date(b) },
            { text: 'В издательстве (лет)', value: 'workingYears', align: 'center' },
            { text: 'Назначенные заказы', value: 'assigned', align: 'center' },
            { text: 'Уволить сотрудника', value: 'delete', align: 'center' },
        ],
        status: [
            { color: 'warning', text: 'Обработка', icon: 'mdi-server-plus' },
            { color: 'primary', text: 'Редакция', icon: 'mdi-file-edit' },
            { color: 'success', text: 'Опубликовано', icon: 'mdi-check' },
        ]
    }),
    computed: {
        ...mapGetters(['TASKS', 'WORKERS', 'MANUSCRIPTS'])
    },
    methods: {
        ...mapMutations(['ADD_RANDOM_WORKER'])
    }
}
</script>