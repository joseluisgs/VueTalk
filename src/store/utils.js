/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
// Utilidades
// Buefy
// https://buefy.org/documentation/toast/
// https://buefy.org/documentation/dialog

import Vue from 'vue';

import { ToastProgrammatic as Toast, DialogProgrammatic as Dialog } from 'buefy';

// Estado
const state = {
  // Tema por defevto
  theme: 'light',
};

// Mutaciones, solo ellas tocan el estado
const mutations = {
  changeTheme(state, theme) {
    state.theme = theme;
  },
};

// acciones
const actions = {
  /**
   * Cambia el tema
   */
  changeTheme({ commit }, { theme }) {
    // add/remove class to/from html tag
    const htmlElement = document.documentElement;
    localStorage.setItem('theme', theme);
    htmlElement.setAttribute('theme', theme);
    // Lo almacenamos
    commit('changeTheme', theme);
  },

  /**
   * Lee el tema por defecto
   */
  loadTheme({ commit }) {
    // set page title
    // document.title = 'Multiple Themes in Vue.js';
    // set 'app-background' class to body tag
    const bodyElement = document.body;
    bodyElement.classList.add('app-background');
    const htmlElement = document.documentElement;
    const theme = localStorage.getItem('theme');
    htmlElement.setAttribute('theme', theme);
    // console.log(theme);
    commit('changeTheme', theme);
    if (theme === 'dark') {
      return true;
    }
    return false;
  },

  /**
   * Mensaje toast
   */
  toast(context, { message, type }) {
    Toast.open({
      message,
      position: 'is-bottom',
      type,
    });
  },

  /**
   * Muestra un dialogo de confirmación
   */
  confirm(context, {
    title, message, confirmText, type,
  }) {
    return new Promise((resolve) => {
      Dialog.confirm({
        title,
        message,
        confirmText,
        type,
        hasIcon: true, // Para el icono hay que meterle la librería
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  },

  /**
   * Mensaje de confirmción en base a un componente
   */
  requestConfirmation(context, { props, component }) {
    const Component = () => import(`../components/${component}Component.vue`);
    return new Promise((resolve, reject) => {
      const dialog = new Vue({
        methods: {
          actionHandler(fn, arg) {
            return function () {
              fn(arg);
              dialog.$destroy();
              dialog.$el.remove();
            };
          },
        },
        render(h) {
          return h(Component, {
            props,
            on: {
              confirm: (data) => {
                this.actionHandler(resolve, data)();
              },
              cancel: this.actionHandler(reject, new Error('Action cancelled')),
            },
          });
        },
      }).$mount();
      document.getElementById('app').appendChild(dialog.$el);
    });
  },

};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
