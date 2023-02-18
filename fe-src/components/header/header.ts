import { Router } from "@vaadin/router"
import { state } from "../../state"

const logoImg = require("../../assets/logo-web.svg")
customElements.define("header-component", class HeaderComponent extends HTMLElement {
  constructor() {
    super()
  };

  connectedCallback() {
    this.render()
  };

  addListeners() {
    const logo = this.querySelector(".nav-bar_logo");
    const openBurguerEl = this.querySelector("#nav-burguer_open");
    const closeBurguerEl = this.querySelector("#nav-burguer_close");
    const navBarMenuEl = this.querySelector("#nav-bar_menu");
    openBurguerEl.addEventListener("click", () => {
      openBurguerEl.classList.remove("fa-bars");
      navBarMenuEl.classList.add("active");
      closeBurguerEl.classList.add("active");
    });

    closeBurguerEl.addEventListener("click", () => {
      closeBurguerEl.classList.remove("active");
      navBarMenuEl.classList.remove("active");
      openBurguerEl.classList.add("fa-bars");
    });


    logo.addEventListener("click", () => {
      Router.go("/home")
    });

    const logOutEl = this.querySelector("#log-out");
    logOutEl.addEventListener("click", () => {
      state.logOut();
      location.reload();
      Router.go("/home");
    });

  };

  render() {
    const currentState = state.getState();
    let myUserEmail = "";
    if (currentState.token && currentState.loggedInUser) {
      myUserEmail = `${currentState.email}`;
    };

    let signOff = "";
    if (currentState.token && currentState.loggedInUser && currentState.email) {
      signOff = "Cerrar sesion";
    };

    this.className = "header-container";
    this.innerHTML = `
        <nav class="nav-bar-container">
          <div class="nav-bar_logo">
             <a href="/home" alt="home"><img src=${logoImg} class="nav-bar_logo-img"></img></a>
          </div>
          <i id="nav-burguer_open" class="fa-solid fa-bars"></i>
          <i id="nav-burguer_close" class="fa-solid fa-rectangle-xmark"></i>
          <div id="nav-bar_menu">
            <ul id="nav-bar_menu-links">
              <li> <a href=${currentState.loggedInUser ? "/myData" : "/login"}>Mis datos</a></li>
              <li> <a href=${currentState.loggedInUser ? "/myreports" : "/login"}>Mis mascotas reportadas</a></li>
              <li> <a href=${currentState.loggedInUser ? "/reportPet" : "/login"}>Reportar mascota</a></li>
              <li> 
                <a href=${currentState.loggedInUser ? "/myData" : "/login"}>
                  <div class="nav-bar_menu-user">
                    <p class="user-name__display">${myUserEmail || "Iniciar Sesion"}</p>
                  </div>
                </a>
              </li>
              <li> <a id="log-out" class="log-out">${signOff}</a> </li>
            </ul>
          </div>
        </nav>
        `;
    const style = document.createElement("style")
    style.innerHTML = `
    .header-container {
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 20px;
      font-family: var(--font-family-root);
    }
        
    .nav-bar-container {
      background-color: var(--blue-color-root);
      width: 100%;
      height: 60px;
      margin: 0px;
      padding: 20px 14px 20px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }
        
    .nav-bar_logo {
      margin: 0px
    }
        
    .nav-bar_logo-img {
      width: 40px;
      height: 34px;
    }
        
    #nav-bar_menu {
      margin: 0px;
      background-color: transparent;
    }
        
    #nav-bar_menu a {
      color: var(--grey-color-root);
      text-align: center;
      text-decoration: none;
    }
        
    #nav-bar_menu a:hover {
      color:var(--white-color-root);
    }
        
    #nav-bar_menu-links {
      padding: 6px 30px;
      display: flex;
      gap: 30px;
      list-style-type: none;
    }
        
    #nav-bar_menu-links li {
      padding: 10px 0;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: 0.7s ease;
    }
        
    .fa-bars {
      display: none;
    }
        
    .fa-rectangle-xmark {
      display: none;
    }


        
     @media(max-width:768px) {
       .fa-bars {
         top: 20%;
         left: 90%;
         display: flex;
         color: var(--grey-color-root);
         font-size: 2.188em;
         position: absolute;
       }
        
       .fa-bars:hover {
         color: var(--white-color-root);
       }
        
       #nav-burguer_close.active {
         top: 20%;
         left: 90%;
         display: flex;
         color: var(--grey-color-root);
         font-size: 2.188em;
         position: absolute;
         z-index: 1;
       }
        
       #nav-burguer_close.active:hover {
         color: var(--white-color-root);
       }
        
       #nav-bar_menu {
         display: none;
       }
        
       #nav-bar_menu.active {
         background-color: var(--blue-color-root);
         top: 99%;
         left: 0%;
         width:100%;
         padding: 10px 10px;
         display: flex;
         flex-direction: column;
         justify-content: space-between;
         align-items: center;
         gap: 10px;
         list-style-type: none;
         position: absolute;
         z-index: 2;
       }
        
       #nav-bar_menu-links {
         padding: 10px 30px;
         display: flex;
         flex-direction: column;
         gap: 10px;
         text-align: center;
         list-style-type: none;
       }
        
       .log-out {
         cursor: pointer;
       }
      }
    `;
    this.appendChild(style);
    this.addListeners();
  };
});

