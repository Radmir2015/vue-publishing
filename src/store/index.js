import Vue from 'vue'
import Vuex from 'vuex'
import faker from 'faker'

Vue.use(Vuex)

faker.locale = 'en'

const createManuscript = () => {
    const next = new Date()
    next.setDate(new Date().getDate() + 8)
    const randomDate = faker.date.between(new Date(), next)
    
    return {
        id: faker.random.number(),
        manuscript: faker.random.number() % 100,
        description: faker.commerce.productDescription(),
        priority: 2 - Math.floor(Math.ceil((randomDate - new Date()) / (1000 * 60 * 60 * 24)) / 3),
        due: randomDate.toISOString().substr(0, 10),
        image: faker.random.image(),
        status: faker.random.number() % 3,
    }
}

const createTask = (createdManuscript, workers) => {
    return {
        ...createdManuscript,
        worker: faker.random.arrayElements(workers.map(x => x.workerId)),
    }
}

const createWorker = () => {
    const workingFrom = faker.date.between(new Date(1980, 0, 0), new Date(2021, 0, 0))
    const workingYears = new Date().getFullYear() - workingFrom.getFullYear()

    return {
        workerId: faker.random.number(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        birthYear: faker.date.between(new Date(1960, 0, 0), new Date(2005, 0, 0)).getFullYear(),
        workingFrom, workingYears,
        assigned: 0
    }
}

export default new Vuex.Store({
  state: {
    tasks: [],
    workers: [],
    manuscripts: [],
  },
  mutations: {
    SET_TASKS: (state, value) => state.tasks = value,
    SET_TASK: (state, { index, value }) => Vue.set(state.tasks, index, value),
    PUSH_TASK: (state, value) => state.tasks.push(value),

    SET_WORKERS: (state, value) => state.workers = value,
    ADD_RANDOM_WORKER: (state) => state.workers.push(createWorker()),

    SET_MANUSCRIPTS: (state, value) => state.manuscripts = value,
    PUSH_MANUSCRIPT: (state, value) => state.manuscripts.push(value),
  },
  actions: {
    ADD_TASK: (ctx) => {
        const manuscript = createManuscript()
        ctx.commit('PUSH_MANUSCRIPT', manuscript)
        ctx.commit('PUSH_TASK', createTask(manuscript, ctx.state.workers))
        // return createTask(manuscript, ctx.state.workers)
    },
    START_TASKS_FILLING: (ctx, num) => {
      Array.from({ length: num }).map(() => ctx.dispatch('ADD_TASK'))
      
      setInterval(() => ctx.dispatch('ADD_TASK'), 15000)
    },

    PUSH_FIRST_WORKERS: (ctx, num) => {
      ctx.commit('SET_WORKERS', Array.from({ length: num }, () => createWorker()))
    },
  },
  getters: {
    LOGIN_STATE: () => false,

    TASKS: (state) => state.tasks,
    WORKERS: (state) => state.workers,
    MANUSCRIPTS: (state) => state.manuscripts,
  }
})
