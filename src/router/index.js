import Vue from 'vue';
import VueRouter from 'vue-router';
// Importamos Vuex
import store from '../store';

// Mis vistas, con cargas dinamicas lazy, solo las cargamos cuando accedemos a ellos
const RoomsView = () => import('../views/RoomsView.vue');
const AuthView = () => import('../views/AuthView.vue');
const CreateRoomView = () => import('../views/CreateRoomView.vue');
const UserProfileView = () => import('../views/UserProfileView.vue');

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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
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

  // Ahora programamos la lógica del iddleware
  // Requires auth & no user activo
  if (requiresAuth && !(await store.dispatch('user/getCurrentUser'))) {
    next({ name: 'Auth' });
    // No requires auth and user (auth)
  } else if (!requiresAuth && (await store.dispatch('user/getCurrentUser'))) {
    next({ name: 'Home' });
  } else {
    // Anything else, lo dejamos pasar.
    next();
  }
});

export default router;
