<template>
    <v-container fluid>
        <v-card class="mx-6">
            <v-card-title>Запросы на выпуск рукописей<v-btn icon text @click="ADD_TASK"><v-icon color="blue">mdi-book-plus-multiple</v-icon></v-btn></v-card-title>
            <v-card-text>
                <v-container fluid>
                    <v-row>
                        <v-col
                            xl="2" lg="3" md="4" sm="6" cols="12" class="py-0"
                            v-for="card in MANUSCRIPTS"
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

                                        <v-btn icon>
                                            <v-icon>mdi-heart</v-icon>
                                        </v-btn>

                                        <v-btn v-if="!$vuetify.breakpoint.xlOnly" icon>
                                            <v-icon>mdi-bookmark</v-icon>
                                        </v-btn>

                                        <v-btn icon>
                                            <v-icon>mdi-share-variant</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-responsive>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: "Manuscripts",
    data: () => ({
        status: [
            { color: 'warning', text: 'Обработка', icon: 'mdi-server-plus' },
            { color: 'primary', text: 'Редакция', icon: 'mdi-file-edit' },
            { color: 'success', text: 'Опубликовано', icon: 'mdi-check' },
        ]
    }),
    computed: {
        ...mapGetters(['MANUSCRIPTS'])
    },
    methods: {
        ...mapActions(['ADD_TASK'])
    }
}
</script>