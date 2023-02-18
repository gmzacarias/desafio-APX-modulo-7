import { Router } from "@vaadin/router"
import { state } from "../../state"
customElements.define("login-page", class LogInPage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render()
  }

  addListeners() {
    const showPopup = document.querySelector(".popup-error_box");
    const closePopup = document.querySelector(".close-button");
    closePopup.addEventListener("click", () => {
      showPopup.classList.remove("active")
    });

    const buttonEl = this.querySelector(".submit")
    const formEl = this.querySelector("#login-form")
    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();
      formEl?.dispatchEvent(new Event("submit"))
    })
    formEl?.addEventListener("submit", async (e) => {
      const currentState = state.getState()
      e.preventDefault();
      const target = e.target as any;
      if (!target["email"].value) {
        showPopup.classList.add("active");
      }
      else {
        const verifyEmail = await state.checkResponse(target["email"].value)
        if (verifyEmail != null) {
          currentState.loggedInUser = true
          state.setState(currentState)
          Router.go("/password")
        }

        else {
          currentState.newUser = true;
          state.setState(currentState)
          Router.go("/myData")
        }
      }
    })
  }

  render() {
    this.innerHTML = `
    <header-component></header-component>
    <section class="login-container">
      <h2 class="login-title">Ingresar</h2>
      <form id="login-form" class="login-form_container">
       <div class="login-form_inputs">
         <label class="login-form_label">Email</label>
         <input class="login-form_input" name="email" type="text" required/>
       </div>
       <div class="popup-error_box">
         <i class="fa-solid fa-circle-exclamation"></i>
         <h3>Hubo un error!</h3>
         <p>Ingrese un email valido</p>
         <button class="close-button">Aceptar</button>
       </div>
       <button-primary class="submit">Siguiente</button-primary>
      </form>
    </section>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .login-container{
      width: 90%;
      height: 100%;
      margin:0 auto;
      padding: 50px 30px;
      display: flex;
      flex-direction:column;
      align-items: center;
      font-family:var( --font-family-root);
      color:var(--blue-color-root);
    }

    .login-title {
      width: 230px;
      height: 100px;
      padding: 20px;
      font-size: 40px;
      font-weight: bold;
      text-align: center;
    }
    
    .login-form_container{
      width:100%;
      height:100%;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      align-items:center;
      gap:30px;
    }

    .login-form_inputs{
      width:100%;
      padding:0;
    }
    
    .login-form_label{
      font-size:16px;
      font-weight:500;
    }

    .login-form_input{
      width:100%;
      height:50px;
      border: 4px solid var(--blue-color-root);
      border-radius: 4px;
      box-sizing:border-box;
    }
                                       
    .submit{
      width:100%;
      margin:0px;
    }

    /* Popup error */
    
    .popup-error_box {
      background-color:var(--white-color-root);
      top: 50%;
      left: 50%;
      display:none;
      transform: translate(-50%, -50%);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    }
    
    .popup-error_box.active{
      width: 280px;
      height: 205px;
      padding: 20px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      border-radius: 24px;
      position: absolute;
      z-index: 1;
      transition: all 0.3s ease;
      transform: translate(-50%, -50%) scale(1.2);
    }
    
    .popup-error_box i {
      font-size: 60px;
      color:var(--red-color-root);
    }
    .popup-error_box h3 {
      font-size: 25px;
      color:var(--black-color-root);
      font-weight:bold;
    }
    .popup-error_box p {
      font-size: 16px;
      color:var(--black-color-root);
      font-weight:bold;
      text-align: center;
    }
 
    .popup-error_box .close-button {
      top:156px;
      margin: 0 10px;
      padding: 6px 12px;
      font-size: 14px;
      font-weight:bold;
      cursor:pointer;
    }
    
    .close-button {
      background-color: var(--green-color-root);
      padding: 14px 22px;
      border: none;
      border-radius: 6px;
      color: var(--black-color-root);
      font-size: 18px;
      font-weight: 400;
      position:absolute;
    }
    `;
    this.appendChild(style);
    this.addListeners();
  };
});