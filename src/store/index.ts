import { defineStore } from 'pinia';

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
  // other options...
  state: () => ({
    // all these properties will have their type inferred automatically
    highscore: 0,
    page: 'home',
  }),
  getters: {
    getPage(state): String {
        return state.page;
    },
    getHighscore(state): number {
        return state.highscore;
    }
  },
  actions: {
    updateHighscore(score: number) {
      this.highscore = score;
    },
    updatePage(page: string) {
      this.page = page;
    },
  },
});
