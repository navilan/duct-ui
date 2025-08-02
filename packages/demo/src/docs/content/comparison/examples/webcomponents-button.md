```javascript
class ButtonElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        button { padding: 8px 16px; }
        .btn { /* base button styles */ }
        .btn-clicked { /* clicked button styles */ }
      </style>
      <button class="btn">${this.getAttribute('label')}</button>
    `;

    this.button = this.shadowRoot.querySelector('button');
    this.button.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {
    this.button.className = 'btn-clicked';
    this.dispatchEvent(new CustomEvent('button-click'));
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.handleClick);
  }
}

customElements.define('my-button', ButtonElement);
```