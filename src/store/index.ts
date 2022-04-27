import { defineStore } from 'pinia';

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
  // other options...
  state: () => ({
    // all these properties will have their type inferred automatically
    highscore: 0,
    page: 'home',
    combo: 0,
    onlinePage: 'lobby',
  }),
  getters: {
    getPage(state): String {
        return state.page;
    },
    getHighscore(state): number {
        return state.highscore;
    },
    getCombo(state): number {
        return state.combo;
    },
    getOnlinePage(state): String {
        return state.onlinePage;
    }
  },
  actions: {
    updateOnlinePage(page: string) {
        this.onlinePage = page;
    },
    updateHighScore(score: number) {
      this.highscore = score;
      localStorage.setItem('highscore', score.toString());
    },
    updatePage(page: string) {
      this.page = page;
    },
    updateCombo(combo: number) {
      this.combo = combo;
      localStorage.setItem('combo', combo.toString());
    }
  },
});
