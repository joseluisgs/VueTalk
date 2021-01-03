/* eslint-disable no-shadow */
// Utilidades
// Buefy
// https://buefy.org/documentation/toast/
// https://buefy.org/documentation/dialog

import { ToastProgrammatic as Toast, DialogProgrammatic as Dialog } from 'buefy';

const actions = {
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

};

export default {
  namespaced: true,
  actions,
};
