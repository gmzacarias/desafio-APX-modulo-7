customElements.define("button-primary", class ButtonPrimary extends HTMLElement {
  constructor() {
    super();
  };

  connectedCallback() {
    this.render()
  };

  render() {
    this.innerHTML = `
    <button class="button-primary">${this.textContent}</button>   
    `
    const style = document.createElement("style");
    style.innerHTML = `
    .button-primary{
      background-color:var(--blue-color-root);
      width:100%;
      height:50px;
      margin:0px;
      border: 4px solid var(--blue-color-root);
      border-radius: 4px;
      font-family:var(--font-family-root);
      color:var(--grey-color-root);
      font-size:18px;
      font-weight:bold;
      cursor:pointer;
    }

    .button-primary:hover{
      color:var(--white-color-root);
    }
    `
    this.appendChild(style);
  };
});