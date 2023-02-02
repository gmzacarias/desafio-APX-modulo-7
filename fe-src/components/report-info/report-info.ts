import { state } from "../../state";

customElements.define("report-info", class ReportInfo extends HTMLElement {
  id: string;
  name: string;
  constructor() {
    super();
  }
  connectedCallback() {
    this.id = this.getAttribute("id");
    this.name = this.getAttribute("name");
    this.render();
  }
  addListeners() {
    const reportInfoForm = this.querySelector("#report-info_send-form");
    const submitButton = this.querySelector("#submit");
    const closeButton = this.querySelector(".report-info_close-button");
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      reportInfoForm.dispatchEvent(new Event("submit"));
    });
    reportInfoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      let data = {
        petName: this.name,
        reporterName: target["name"].value,
        phone_number: target["mobile-number"].value,
        pet_info: target["zone"].value
      }
      if (data.reporterName && data.phone_number && data.pet_info) {
        state.reportInfo(data, this.id).then(() => {
          console.log("mensaje enviado correctamente");
          this.remove()
        })
      }
    });
    closeButton.addEventListener("click", () => {
      this.remove();
    });
  }

  render() {
    this.innerHTML = `
    <div class="report-info-container">
      <div class="report-info_close-button"><i class="fa-solid fa-x"></i></div>
      <div class="report-info_title"><h2>Reportar info de ${this.name}</h2></div>
      <div class="report-info_form">  
        <form id="report-info_send-form">
          <ul class="report-info_inputs">
            <label class="report-info_labels">Tu nombre</label>
              <li>
               <input class="report-info_input" name="name" type="text" required/>
              </li>
            <label class="report-info_labels">Tu telefono</label>
              <li>
               <input class="report-info_input" name="mobile-number" type="number"required/>
              </li>
            <label class="report-info_labels">Donde lo viste?</label>
              <li>
               <textarea class="report-info_text-area" name="zone" type="text" maxlength="500" required></textarea>
              </li>
          </ul>
          <button-primary id="submit" class="submit-button">Enviar</button-primary>
        </form>
      </div>  
    </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .report-info-container{
      background-color: var(--white-color-root);
      top: -337px;
      left: 194px;
      width: 350px;
      height: 404px;
      padding: 15px 25px 20px;
      position: relative;
      z-index: 2;
      font-family:var(--font-family-root);
      border-radius: 30px 70px;
      border: solid 2px var(--grey-bordercolor-root);     
    }

    
    .report-info_close-button{
      top:3%;
      right:10%;
      width: 25px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      cursor:pointer;
    }

    .fa-x{
      font-size:20px;
      color:var(--blue-color-root);
    }
    
    .report-info_form{
      width:100%;
      height:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:20px;
    }

    .report-info_inputs{
      width: 331px;
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
      gap: 5px;
    }

    li{
      list-style:none;
    }
    
    .report-info_labels{
      font-size:16px;
      font-weight:500;
    }

    .report-info_input{
      width:302px;
      height:50px;
      border: 2px solid var(--blue-color-root);
      border-radius: 4px;    
    }
  
    .report-info_title{
      text-align:center;
      padding:10px;
    }

    .report-info_text-area{
      resize:none;
      width:302px;
      height:50px;
      border: 2px solid var(--blue-color-root);
      border-radius: 4px;
    }
    
    .submit-button{
      width:50%;
      margin:0 auto;
      padding:5px;
      display:flex;
    }
    @media(max-width:768px){
      .report-info-container{
        top: -350px;
        left: 5px;
      }
    }
    `;
    this.appendChild(style);
    this.addListeners();
  }
}
);
