import { Router } from "@vaadin/router"
import { state } from "../../state"
customElements.define("password-page", class PasswordPage extends HTMLElement {
  constructor() {
    super();
  };

  connectedCallback() {
    const currentState = state.getState()
    if (!currentState.loggedInUser && !currentState.newUser && !currentState.email) {
      Router.go("/login")
    }
    this.render()
  };

  addListeners() {
    const showPopup = document.querySelector(".popup-error_box");
    const closePopup = document.querySelector(".close-button");
    closePopup.addEventListener("click", () => {
      showPopup.classList.remove("active")
    });

    const buttonSubmit = this.querySelector(".submit")
    const formEl = this.querySelector("#password-form")
    buttonSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      formEl?.dispatchEvent(new Event("submit"))
    })
    formEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const target = e.target as any;
      if (!target["password"].value) {
        showPopup.classList.add("active");
      }

      const currentState = state.getState()
      const token = await state.signIn(target["password"].value)
      if (token) {
        currentState.token = token
        currentState.loggedInUser = true
        state.setState(currentState)
        Router.go("/home")
      }
    });
  };

  render() {

    this.innerHTML = `
    <header-component></header-component>
    <section class="password-container">
      <h2 class="password-title">Ingresar</h2>
      <form id="password-form" class="password-form_container">
        <div class="password-form_inputs">
         <label class="password-form_label">Contraseña</label>
         <input class="password-form_input" name="password" type="password" required/>
        </div>
        <div class="popup-error_box">
           <i class="fa-solid fa-circle-exclamation"></i>
           <h3>Error!</h3>
           <p class="message">ingrese una contraseña</p>
           <button class="close-button">Aceptar</button>
        </div>
        <button-primary class="submit">Siguiente</button-primary>
      </form>
    </section>
    `;
    const style = document.createElement("style")
    style.innerHTML = `
    .password-container{
      width: 500px;
      height: 100%;
      margin:0 auto;
      padding: 50px 30px;
      display: flex;
      flex-direction:column;
      align-items: center;  
      font-family:var(--font-family-root);
      color:var(--blue-color-root);
    }
  
    .password-title {
      width: 230px;
      height: 100px;
      padding: 20px;
      font-size: 40px;
      font-weight: 700;
      text-align: center;
             
    }
      
    .password-form_container{
      width:100%;
      height:100%;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      align-items:center;
      gap:30px;
    }
  
    .password-form_inputs{
      width:100%;
      padding:0;
    }
      
    .password-form_label{
      font-size:16px;
      font-weight:500;
    }
  
    .password-form_input{
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
      color:var(--red-color-root);
      font-size: 60px;
    }
    .popup-error_box h3 {
      color:var(--black-color-root);
      font-size: 25px;
      font-weight:bold;
    }

    .popup-error_box p {
      color:var(--black-color-root);
      font-size: 16px;
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
      font-weight:bold;
      position:absolute;
    }
    `;
    this.appendChild(style);
    this.addListeners();
  };
});