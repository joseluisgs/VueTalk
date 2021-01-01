import Vue from 'vue';
import VueRouter from 'vue-router';
// Importamos Vuex
import store from '../store';

// Mis vistas, con cargas dinamicas lazy, solo las cargamos cuando accedemos a ellos
const RoomsView = () => import('../views/RoomsView.vue');
const AuthView = () => import('../views/AuthView.vue');
const CreateRoomView = () => import('../views/CreateRoomView.vue');
const UserProfileView = () => import('../views/UserProfileView.vue');
const UpdateRoomView = () => import('../views/UpdateRoomView.vue');
const RoomView = () => import('../views/RoomView.vue');
const About = () => import('../views/About.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: RoomsView,
    // Autenticado
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfileView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateRoomView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    // El parámetro me llega por la ruta y se lo paso como prop
    path: '/update/:id',
    name: 'Update',
    props: true,
    component: UpdateRoomView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    // El parámetro me llega por la ruta y se lo paso como prop
    path: '/view/:id',
    name: 'View',
    props: true,
    component: RoomView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    // El parámetro me llega por la ruta
    path: '/about',
    name: 'About',
    component: About,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// Guardianes de rutas protegidas
router.beforeEach(async (to, from, next) => {
  // Nos quedamos con las rutas que tengan la propiedad meta requieresAuth
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Ahora programamos la lógica del middleware
  // Requires auth & no user activo
  if (to.name === 'About') {
    next();
  } else if (requiresAuth && !(await store.dispatch('user/getCurrentUser'))) {
    next({ name: 'Auth' });
    // No requires auth and user (auth)
  } else if (!requiresAuth && (await store.dispatch('user/getCurrentUser'))) {
    // eslint-disable-next-line no-unused-expressions
    next({ name: 'Home' });
  } else {
    // Anything else, lo dejamos pasar.
    next();
  }
});

export default router;
