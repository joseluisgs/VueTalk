<template>
 <footer>
      <div class="container">
        <div id="ftr-wrap">
          <div class="ftr-links">
            <ul>
              <li><a href="https://twitter.com/joseluisgonsan" target="_blank" class="text-light">
                   <b-icon icon="twitter" size="is-small"></b-icon>
                </a></li>
              <li><a href="https://github.com/joseluisgs" target="_blank" class="text-light">
                  <b-icon icon="github" size="is-small"></b-icon>
                </a></li>
              <li><a href="https://www.linkedin.com/in/joseluisgonsan/" target="_blank" class="text-light">
                    <b-icon icon="linkedin" size="is-small"></b-icon>
                </a></li>
            </ul>
          </div>
          <div class="footer-copyright">
            <p class="copyright">Coding with <b-icon icon="heart-multiple" size="is-small"></b-icon> &copy;
              <a href="http://github.com/joseluisgs" target="_blank" rel="noopener noreferrer">José Luis González Sánchez</a>
            </p>
          </div>
          <div>
            <p class="footer-parrafo">2021</p>
          </div>
        </div>
      </div>
    </footer>
</template>

<style lang="scss">
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: -1px -1px 5px lightgray;
  background-color: whitesmoke;
  // Parrafo del footer
  p {
    color: rgb(82, 82, 82);
    font-size: 0.75em;
    display: inline-block;
  }
  // Contenedor
  .container {
    padding: 0 50px;
  }
  // Enlaces
  #ftr-wrap {
    display: table;
    table-layout: fixed;
    width: 100%;
    margin: 5 auto;
  }
  #ftr-wrap > div {
    display: table-cell;
    vertical-align: middle;
    // outline:1px dashed red;  /* TEST Outline.  TO BE DELETED. */
  }
  // Alineación de los elementos
  #ftr-wrap > div:nth-child(1) {
    text-align: left;
  }
  #ftr-wrap > div:nth-child(2) {
    text-align: center;
  }
  #ftr-wrap > div:nth-child(3) {
    text-align: right;
  }

  // Cada elemento
  .ftr-links ul {
    margin: 0;
  }
  // Por cada elemento
  .ftr-links ul li {
    display: inline-block;
    padding-right: 15px;
    font-size: 0.75em;
  }
  // color del enlace
  .ftr-links ul li a {
    color: rgb(82, 82, 82);
    margin: 0;
  }
}
</style>
