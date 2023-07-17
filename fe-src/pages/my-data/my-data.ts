import { Router } from "@vaadin/router"
import { state } from "../../state"

customElements.define("mydata-page", class myData extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const currentState = state.getState()
    const isLoggedIn = currentState.loggedInUser;
    if (!currentState.loggedInUser && !currentState.newUser) {
      Router.go("/login")
    } else if (isLoggedIn) {
      this.render()
      console.log(isLoggedIn)
    }
  };

  addListeners() {
    const showPopup = document.querySelector(".popup-error_box");
    const closePopup = document.querySelector(".close-button");
    closePopup.addEventListener("click", () => {
      showPopup.classList.remove("active")
    });

    const myDataForm = this.querySelector("#mydata-form");
    const buttonSaveData = this.querySelector(".save-data");
    buttonSaveData.addEventListener("click", (e) => {
      e.preventDefault();
      myDataForm.dispatchEvent(new Event("submit"))
    });

    myDataForm.addEventListener("submit", async (e) => {
      const currentState = state.getState()
      e.preventDefault()
      const target = e.target as any;
      if (target["password"].value == target["repeat-password"].value) {
        const myData = {
          email: currentState.email,
          userName: target["name"].value,
          password: target["password"].value,
        }
        state.signUpOrUpdateUser(myData).then(() => {
          target["name"].value = "";
          target["password"].value = "";
          target["repeat-password"].value = "";

          Router.go("/home")
        });

      } else {
        showPopup.classList.add("active");
      }
    })
  }

  render() {
    const currentState = state.getState()
    console.log(currentState)
    this.innerHTML = `
    <header-component></header-component>
    <section class="mydata-container">
      <h2 class="mydata_title">Mis Datos</h2>
      <form id="mydata-form" class="mydata-form_container">
        <ul class="mydata-form_inputs">
          <label class="mydata-form_label">Nombre</label>
          <li><input class="mydata-form_input" name="name" value =${currentState.userName} type="text"/></li>
          <label class="mydata-form_label">Contraseña</label>
          <li><input class="mydata-form_input" name="password" value =${currentState.password} type="password"/></li>
          <label class="mydata-form_label">Repetir contraseña</label>
          <li><input class="mydata-form_input" name="repeat-password" value =${currentState.password} type="password"/></li>
        </ul>
        <button-primary class="save-data" >Guardar</button-primary>
          <div class="popup-error_box">
            <i class="fa-solid fa-circle-exclamation"></i>
            <h3>Hubo un error!</h3>
            <p>"las contraseñas no coinciden"</p>
            <button class="close-button">Aceptar</button>
          </div>
      </form>
    </section>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .mydata-container{
      width: 90%;
      height: 100%;
      margin:0 auto;
      padding: 50px 30px;
      display: flex;
      flex-direction:column;
      align-items: center; 
      font-family:var(--font-family-root);
      color:var(--blue-color-root);
    }
   
    .mydata_title{
      width: 250px;
      height: 100px;
      padding: 20px;
      font-size: 40px;
      font-weight:bold;
      text-align: center;
    }
      
    .mydata-form_container{
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    gap:30px;
    }
  
    .mydata-form_inputs{
    width:100%;
    padding:0;
    }
      
    .mydata-form_label{
    font-size:16px;
    font-weight:500;
    }
  
    .mydata-form_input{
    width:100%;
    height:50px;
    border: 4px solid var(--blue-color-root);
    border-radius: 4px;
    box-sizing:border-box;
    }
    
    
    #mydata-form li{
    list-style-type: none;
    }
    
    .save-data{
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
      width: 320px;
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
      top:166px;
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
    this.appendChild(style)
    this.addListeners()
  }
})