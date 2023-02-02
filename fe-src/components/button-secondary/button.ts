
customElements.define("button-secondary", class ButtonSecondary extends HTMLElement {
  constructor() {
    super();
  };

  connectedCallback() {
    this.render();
  };

  render() {
    this.innerHTML = `
    <button class="button-secondary">${this.textContent}</button>
    `

    const style = document.createElement("style");
    style.innerHTML = `
    .button-secondary{
      background-color:var(--green-color-root);
      width:100%;
      height:50px;
      margin:0px;
      border-radius: 4px;
      font-family:var(--font-family-root);
      color:var(--black-color-root);
      font-size:18px;
      font-weight:bold;
      cursor:pointer;
    }

    .button-secondary:hover{
      color:white;
    }
    `;
    this.appendChild(style);

  };
});