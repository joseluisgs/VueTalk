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
                  <b-input placeholder="your@mail.com" required type="email" icon="email"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope-o"></i>
                  </span>
                </p>
              </b-field>
              <b-field label="Password" position="is-left">
                 <p class="control has-icons-left has-icons-right">
                  <b-input placeholder="password" required type="password" icon="password"></b-input>
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
            <from @submit.prevent="doRegister">
              <b-field label="Name" position="is-left">
                 <p class="control has-icons-left has-icons-right">
                  <b-input placeholder="Your Name" required type="text" icon="user"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-user"></i>
                  </span>
                </p>
              </b-field>
              <b-field label="Email" position="is-left">
                 <p class="control has-icons-left has-icons-right">
                  <b-input placeholder="your@mail.com" required type="email" icon="email"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope-o"></i>
                  </span>
                </p>
              </b-field>
              <b-field label="Password" position="is-left">
                 <p class="control has-icons-left has-icons-right">
                  <b-input placeholder="password" required type="password" icon="password"></b-input>
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
            </from>
          </template>
          <!-- End Loging form -->
        </div>
      </div>
    </div>
  </article>
</template>

<script>
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
    doRegister() {
      // TODO Registro
    },
    doLogin() {
      // TODO Login
    },
  },
};
</script>

<style>
</style>
