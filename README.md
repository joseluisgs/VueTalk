# VueTalk

Apliación realizado con Vue.js, Firebase y Bulma/Buefy. Apliación de chats en tiempo real con intercambio de mensajes y ficheros en distintas salas. 

[![Vue Ready](https://img.shields.io/badge/Vue.js-%20Ready-%2342b983)](https://es.vuejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Ready-orange)](https://instavue-fire.web.app)
[![Bulma/Buefy](https://img.shields.io/badge/Bulma/Buefy-%20Ready-blueviolet)](https://buefy.org/)
[![JS Code](https://img.shields.io/badge/JS%20Code-ES2019-yellow)](https://www.ecma-international.org/ecma-262)
[![JS Style](https://img.shields.io/badge/JS%20Style-AirBnB-ff69b4)](https://airbnb.io/javascript)

[![Licence](https://img.shields.io/github/license/joseluisgs/NodeMonRest)](https://github.com/joseluisgs/VueTalk/blob/main/LICENSE)
![GitHub](https://img.shields.io/github/last-commit/joseluisgs/VueTalk)
[![Netlify Status](https://api.netlify.com/api/v1/badges/615e72ac-07e3-42e9-9080-431ef5132871/deploy-status)](https://app.netlify.com/sites/vue-talk/deploys)
[![Electron](https://img.shields.io/badge/Electron-Ready-74b1be)](https://www.electronjs.org/)

- [VueTalk](#vuetalk)
  - [Acerca de](#acerca-de)
  - [Project setup](#project-setup)
    - [Compiles and hot-reloads for development](#compiles-and-hot-reloads-for-development)
    - [Compiles and minifies for production](#compiles-and-minifies-for-production)
    - [Run your unit tests](#run-your-unit-tests)
    - [Lints and fixes files](#lints-and-fixes-files)
    - [Customize configuration](#customize-configuration)
  - [Autor](#autor)
  - [Licencia](#licencia)
    - [Agradecimientos](#agradecimientos)

## Acerca de

Proyecto realizado con Vue.js, Firebase y Bulma/Buefy. Apliación de chats en tiempo real con intercambio de mensajes y ficheros en distintas salas. Como iconos se ha usado
[Material Icons](https://materialdesignicons.com/)

Algunos aspectos reseñables:

* Dispone de un sistema para autentificar y registrar los usuarios. [Firebase Auth](https://firebase.google.com/docs/auth).
* Crear salas de conversación e interactuar con ellas y con otros usuarios, en tiempo real. [Cloud Firestore](https://firebase.google.com/docs/firestore?hl=es).
* Reglas de seguridad y permiso para acceder a las salas con [Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started#testing_rules)
* Editar las salas, cambiar su portada y enviar archivos multimedia. [Cloud Storage](https://firebase.google.com/docs/storage) y Cloud Functions.
* Elementos de [Vue](https://vuejs.org/v2/guide/), [VueCLI](https://cli.vuejs.org/guide/), [Vuex](https://vuex.vuejs.org/guide/), [Vue Router](https://router.vuejs.org/guide/) y demás.
* Despliegue en [Netlify](https://vue-talk.netlify.app/).
* Apliación nativa con [Electron](https://www.electronjs.org/).

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Autor

Codificado con :sparkling\_heart: por [José Luis González Sánchez](https://twitter.com/joseluisgonsan)

[![Twitter](https://img.shields.io/twitter/follow/joseluisgonsan?style=social)](https://twitter.com/joseluisgonsan)
[![GitHub](https://img.shields.io/github/followers/joseluisgs?style=social)](https://github.com/joseluisgs)

## Licencia

Este proyecto esta licenciado bajo licencia **MIT**, si desea saber más, visite el fichero
[LICENSE](https://github.com/joseluisgs/VueTalk/blob/main/LICENSE) para su uso docente y educativo.

### Agradecimientos

Agradecimientos a [Escuela Vue](https://escuelavue.es/) por este ejemplo usando de base.
