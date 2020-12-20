<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">

          <!-- Loging form -->
          <template v-if="isLogin">
            <h1 class="title has-text-centered">Login</h1>
            <form @submit.prevent="doLogin">
              <b-field label="Email" position="is-left">
                 <p class="control has-icons-left has-icons-right">
                  <b-input placeholder="your@mail.com" required type="email" icon="email" v-model.trim="userData.email" key="usermail-input"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope-o"></i>
                  </span>
                </p>
              </b-field>
              <b-field label="Password" position="is-left" v-model="userData.password">
                 <p class="control has-icons-left has-icons-right">
                  <b-input placeholder="password" required type="password" icon="password" v-model.trim="userData.password" key="userpassword-input"></b-input>
                  <span class="icon is-small is-left">
                     <i class="fa fa-unlock"></i>
                  </span>
                </p>
              </b-field>
              <div class="field is-grouped has-text-righ">
                <div class="buttons">
                  <b-button
                    tag="input"
                    type="is-link"
                    native-type="submit"
                    value="Login"
                    :class="{ 'is-loading': isLoading }"
                  />
                  <!-- <b-button type="is-danger" @click="loginGoogle" outlined>Google</b-button> -->
                </div>
              </div>
              <a href="#" @click="isLogin = false">Don't have an account?</a>
            </form>
          </template>
          <!-- End Loging form -->

          <!-- Register form -->
          <template v-else>
            <h1 class="title has-text-centered">Register</h1>
            <form @submit.prevent="doRegister">
              <b-field label="Name" position="is-left">
                 <p class="control has-icons-left has-icons-right">
                  <b-input placeholder="Your Name" required type="text" v-model.trim="userData.name" key="username-input"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-user"></i>
                  </span>
                </p>
              </b-field>
              <b-field label="Email" position="is-left" v-model="userData.email">
                 <p class="control has-icons-left has-icons-right">
                  <b-input placeholder="your@mail.com" required type="email" icon="email" v-model.trim="userData.email" key="usermail-input"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope-o"></i>
                  </span>
                </p>
              </b-field>
              <b-field label="Password" position="is-left" v-model="userData.password">
                 <p class="control has-icons-left has-icons-right">
                  <b-input placeholder="password" required type="password" icon="password" v-model.trim="userData.password" key="userpassword-input"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
                </p>
              </b-field>
              <div class="field is-grouped has-text-righ">
                <div class="buttons">
                  <b-button
                    tag="input"
                    type="is-link"
                    native-type="submit"
                    value="Register"
                    :class="{ 'is-loading': isLoading }"
                  />
                  <!-- <b-button type="is-danger" @click="loginGoogle" outlined>Google</b-button> -->
                </div>
              </div>
              <a href="#" @click="isLogin = true">Want to login?</a>
            </form>
          </template>
          <!-- End Loging form -->
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AuthView',
  // Mi modelo de datos
  data: () => ({
    isLogin: true,
    isLoading: false,
    userData: {
      name: '',
      email: '',
      password: '',
    },
  }),
  methods: {
    // Sobre el estado usaremos
    ...mapActions('user', ['userLogin', 'userRegister']),

    /**
     * Realiza el login
     */
    async doLogin() {
      this.isLoading = true;
      try {
        await this.userLogin({
          email: this.userData.email,
          password: this.userData.password,
        });
        console.log('Logged In');
        this.resetData();
        this.redirect();
      } catch (error) {
        console.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Realiza el Registro
     */
    async doRegister() {
      this.isLoading = true;
      try {
        await this.userRegister({
          name: this.userData.name,
          email: this.userData.email,
          password: this.userData.password,
        });
        console.log('Account Created');
        this.resetData();
        this.redirect();
      } catch (error) {
        console.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Redirecciona a una página
     */
    redirect() {
      this.$router.push({ name: 'Home' });
    },

    /**
     * Resetea los datos
     */
    resetData() {
      this.userData.name = '';
      this.userData.email = '';
      this.userData.password = '';
    },
  },
};
</script>

<style>
</style>
