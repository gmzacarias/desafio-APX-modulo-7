customElements.define("input-component", class InputComponent extends HTMLElement {
    constructor() {
        super()
    };

    connectedCallback() {
        this.render()
    };

    render() {
        this.innerHTML = `
        <input class="input-component" required></input>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
        .input-component{
          width:100%;
          height:50px;
          border: 4px solid var(--blue-color-root);
          border-radius: 4px;
          box-sizing:border-box;
        }   
        `;
        this.appendChild(style)
    };
});