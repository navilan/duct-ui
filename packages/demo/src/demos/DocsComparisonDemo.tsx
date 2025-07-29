import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import DemoLayout from "../components/DemoLayout"
import { escapeHtml } from "../utils/htmlUtils"

export interface DocsComparisonDemoEvents extends BaseComponentEvents { }
export interface DocsComparisonDemoLogic { }
export interface DocsComparisonDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsComparisonDemoProps>) {
  return (
    <div {...props}>
      <DemoLayout
        title="Duct vs Other Frameworks"
        description="How Duct compares to React, Vue, and Svelte"
        sourcePath="/demos/DocsComparisonDemo.tsx"
      >
        <div class="prose prose-lg max-w-none">
          <p class="lead">
            Understanding how Duct differs from popular frameworks helps you make informed architectural decisions.
            Here's an honest comparison of approaches and trade-offs.
          </p>

          <h2>Framework Comparison Table</h2>

          <div class="not-prose">
            <div class="overflow-x-auto my-6">
              <table class="table table-zebra table-sm">
                <thead>
                  <tr>
                    <th class="font-bold">Feature</th>
                    <th class="font-bold text-primary">Duct</th>
                    <th class="font-bold">React</th>
                    <th class="font-bold">Vue</th>
                    <th class="font-bold">Svelte</th>
                    <th class="font-bold">Web Components</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="font-medium">Architecture</td>
                    <td>Blueprint pattern with separation</td>
                    <td>Component with mixed concerns</td>
                    <td>SFC with sections</td>
                    <td>Compiled components</td>
                    <td>Custom elements with class</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Virtual DOM</td>
                    <td class="text-success">❌ No</td>
                    <td class="text-warning">✅ Yes</td>
                    <td class="text-warning">✅ Yes</td>
                    <td class="text-success">❌ No</td>
                    <td class="text-success">❌ No</td>
                  </tr>
                  <tr>
                    <td class="font-medium">State Management</td>
                    <td>External/Manual</td>
                    <td>useState/useReducer</td>
                    <td>Reactive data</td>
                    <td>Reactive stores</td>
                    <td>Manual/Properties</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Learning Curve</td>
                    <td class="text-success">Low</td>
                    <td class="text-error">Medium-High</td>
                    <td class="text-warning">Medium</td>
                    <td class="text-success">Low-Medium</td>
                    <td class="text-warning">Medium</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Template Syntax</td>
                    <td>JSX</td>
                    <td>JSX</td>
                    <td>Template/JSX</td>
                    <td>Enhanced HTML</td>
                    <td>HTML/Template literals</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Logic Location</td>
                    <td class="text-primary">Separate bind function</td>
                    <td>Mixed in component</td>
                    <td>Script section</td>
                    <td>Script section</td>
                    <td>Class methods</td>
                  </tr>
                  <tr>
                    <td class="font-medium">Reactivity</td>
                    <td>Event-driven</td>
                    <td>Re-render based</td>
                    <td>Proxy-based</td>
                    <td>Compile-time</td>
                    <td>Manual/Observers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2>Detailed Comparisons</h2>

          <h3>Duct vs React</h3>
          <p>
            React popularized component-based UI development, but Duct takes a fundamentally different approach
            to organizing component logic.
          </p>

          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title text-error">React Component</h4>
                  <pre class="text-xs overflow-x-auto"><code>{escapeHtml(`function Button({ label, onClick }) {
  const [clicked, setClicked] = useState(false);

  return (
    <button
      className={clicked ? 'btn-clicked' : 'btn'}
      onClick={() => {
        setClicked(true);
        onClick();
      }}
    >
      {label}
    </button>
  );
}`)}</code></pre>
                </div>
              </div>

              <div class="card bg-primary/10 border border-primary/20">
                <div class="card-body">
                  <h4 class="card-title text-primary">Duct Component</h4>
                  <pre class="text-xs overflow-x-auto"><code>{escapeHtml(`// Render function
function render(props) {
  return (
    <button class="btn" data-clicked="false">
      {props.label}
    </button>
  );
}

// Bind function
function bind(el, eventEmitter) {
  let clicked = false;

  const handleClick = () => {
    clicked = true;
    el.dataset.clicked = 'true';
    el.className = 'btn-clicked';
    eventEmitter.emit('click');
  };

  el.addEventListener('click', handleClick);

  return { release: () => el.removeEventListener('click', handleClick) };
}`)}</code></pre>
                </div>
              </div>
            </div>
          </div>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="card bg-success/10 border border-success/20">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">Duct Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>✓ No re-rendering overhead</li>
                    <li>✓ Direct DOM control</li>
                    <li>✓ Clear separation of concerns</li>
                    <li>✓ Explicit behavior</li>
                    <li>✓ No hooks complexity</li>
                  </ul>
                </div>
              </div>
              <div class="card bg-warning/10 border border-warning/20">
                <div class="card-body">
                  <h4 class="card-title text-warning text-base">React Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Large ecosystem</li>
                    <li>• Extensive tooling</li>
                    <li>• Huge community</li>
                    <li>• More job opportunities</li>
                    <li>• Mature libraries</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h3>Duct vs Vue</h3>
          <p>
            Vue offers a middle ground between React and traditional templating, while Duct goes further
            in separating concerns.
          </p>

          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title text-green-600">Vue Component</h4>
                  <pre class="text-xs overflow-x-auto"><code>{escapeHtml(`<template>
  <button
    :class="buttonClass"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<script>
export default {
  props: ['label'],
  data() {
    return { clicked: false };
  },
  computed: {
    buttonClass() {
      return this.clicked ? 'btn-clicked' : 'btn';
    }
  },
  methods: {
    handleClick() {
      this.clicked = true;
      this.$emit('click');
    }
  }
};
</script>`)}</code></pre>
                </div>
              </div>

              <div class="card bg-primary/10 border border-primary/20">
                <div class="card-body">
                  <h4 class="card-title text-primary">Duct Approach</h4>
                  <pre class="text-xs overflow-x-auto"><code>{escapeHtml(`// Template is pure presentation
function render(props) {
  return (
    <button class="btn">
      {props.label}
    </button>
  );
}

// Logic is completely separate
function bind(el, eventEmitter) {
  let clicked = false;

  function handleClick() {
    clicked = true;
    el.className = 'btn-clicked';
    eventEmitter.emit('click');
  }

  el.addEventListener('click', handleClick);

  return {
    release: () => el.removeEventListener('click', handleClick)
  };
}`)}</code></pre>
                </div>
              </div>
            </div>
          </div>


          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="card bg-success/10 border border-success/20">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">Duct Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>✓ No reactivity magic to debug</li>
                    <li>✓ Explicit DOM control</li>
                    <li>✓ Clear separation of template/logic</li>
                    <li>✓ Standard JavaScript patterns</li>
                    <li>✓ Predictable performance</li>
                  </ul>
                </div>
              </div>
              <div class="card bg-warning/10 border border-warning/20">
                <div class="card-body">
                  <h4 class="card-title text-warning text-base">Vue Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Gentle learning curve</li>
                    <li>• Progressive enhancement</li>
                    <li>• Excellent documentation</li>
                    <li>• Built-in state management</li>
                    <li>• Single-file components</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h3>Duct vs Svelte</h3>
          <p>
            Both Duct and Svelte avoid virtual DOM, but they differ significantly in their compilation
            and component organization approaches.
          </p>

          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title text-orange-600">Svelte Component</h4>
                  <pre class="text-xs overflow-x-auto"><code>{escapeHtml(`<script>
  export let label;
  let clicked = false;

  function handleClick() {
    clicked = true;
    dispatch('click');
  }
</script>

<button
  class={clicked ? 'btn-clicked' : 'btn'}
  on:click={handleClick}
>
  {label}
</button>`)}</code></pre>
                </div>
              </div>

              <div class="card bg-primary/10 border border-primary/20">
                <div class="card-body">
                  <h4 class="card-title text-primary">Duct Structure</h4>
                  <pre class="text-xs overflow-x-auto"><code>{escapeHtml(`// Functions are completely separated
function render(props) {
  return <button class="btn">{props.label}</button>;
}

function bind(el, eventEmitter) {
  let clicked = false;

  const handleClick = () => {
    clicked = true;
    el.className = 'btn-clicked';
    eventEmitter.emit('click');
  };

  el.addEventListener('click', handleClick);

  return { release: () => el.removeEventListener('click', handleClick) };
}

// Explicit blueprint creation
const Button = createBlueprint(
  { id: "my/button" },
  render,
  { bind }
);

export default Button;`)}</code></pre>
                </div>
              </div>
            </div>
          </div>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="card bg-success/10 border border-success/20">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">Duct Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>✓ No compile step required</li>
                    <li>✓ Runtime transparency</li>
                    <li>✓ Standard build tools</li>
                    <li>✓ Explicit behavior</li>
                    <li>✓ Easy debugging</li>
                  </ul>
                </div>
              </div>
              <div class="card bg-warning/10 border border-warning/20">
                <div class="card-body">
                  <h4 class="card-title text-warning text-base">Svelte Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Tiny bundle sizes</li>
                    <li>• Compile-time optimizations</li>
                    <li>• Built-in animations</li>
                    <li>• Simple reactive syntax</li>
                    <li>• No runtime overhead</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h3>Duct vs Web Components</h3>
          <p>
            Both Duct and Web Components embrace direct DOM manipulation and standards-based approaches,
            but they differ in their component organization and abstraction levels.
          </p>

          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title text-gray-600">Web Components</h4>
                  <pre class="text-xs overflow-x-auto"><code>{escapeHtml(`class ButtonElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = \`
      <style>
        button { padding: 8px 16px; }
        .clicked { background: blue; }
      </style>
      <button>\${this.getAttribute('label')}</button>
    \`;

    this.button = this.shadowRoot.querySelector('button');
    this.button.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {
    this.button.classList.add('clicked');
    this.dispatchEvent(new CustomEvent('button-click'));
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.handleClick);
  }
}

customElements.define('my-button', ButtonElement);`)}</code></pre>
                </div>
              </div>

              <div class="card bg-primary/10 border border-primary/20">
                <div class="card-body">
                  <h4 class="card-title text-primary">Duct Component</h4>
                  <pre class="text-xs overflow-x-auto"><code>{escapeHtml(`// Render function
function render(props) {
  return (
    <button class="btn">
      {props.label}
    </button>
  );
}

// Bind function
function bind(el, eventEmitter) {
  let clicked = false;

  const handleClick = () => {
    clicked = true;
    el.classList.add('clicked');
    eventEmitter.emit('click');
  };

  el.addEventListener('click', handleClick);

  return { 
    release: () => el.removeEventListener('click', handleClick) 
  };
}

// Create component
const Button = createBlueprint(
  { id: "my/button" },
  render,
  { bind }
);

export default Button;`)}</code></pre>
                </div>
              </div>
            </div>
          </div>

          <div class="not-prose">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="card bg-success/10 border border-success/20">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">Duct Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>✓ Clear separation of render/logic concerns</li>
                    <li>✓ No Shadow DOM complexity</li>
                    <li>✓ Simpler component composition</li>
                    <li>✓ Framework-agnostic JSX templates</li>
                    <li>✓ Explicit lifecycle management</li>
                    <li>✓ Better TypeScript integration</li>
                  </ul>
                </div>
              </div>
              <div class="card bg-warning/10 border border-warning/20">
                <div class="card-body">
                  <h4 class="card-title text-warning text-base">Web Components Advantages</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Native browser standard</li>
                    <li>• True encapsulation with Shadow DOM</li>
                    <li>• Framework interoperability</li>
                    <li>• No build step required</li>
                    <li>• CSS isolation by default</li>
                    <li>• Custom element lifecycle</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h2>When to Choose Each Framework</h2>

          <div class="not-prose">
            {/* Duct - Full Width */}
            <div class="card bg-primary/10 border border-primary/20 my-6">
              <div class="card-body">
                <h4 class="card-title text-primary text-xl">Choose Duct When</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <ul class="text-sm space-y-2">
                    <li>✓ You value explicit, debuggable code</li>
                    <li>✓ You need direct DOM control</li>
                    <li>✓ You want minimal abstractions</li>
                  </ul>
                  <ul class="text-sm space-y-2">
                    <li>✓ You're building long-lived applications</li>
                    <li>✓ You work with AI code generation</li>
                    <li>✓ You prefer separation of concerns</li>
                  </ul>
                  <ul class="text-sm space-y-2">
                    <li>✓ You need predictable performance</li>
                    <li>✓ You want clear debugging paths</li>
                    <li>✓ You prioritize maintainability</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Other Frameworks - Grid */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
              <div class="card bg-green-50 border border-green-200">
                <div class="card-body">
                  <h4 class="card-title text-green-700">Choose Vue When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You want balanced complexity</li>
                    <li>• You like single-file components</li>
                    <li>• You need official router/state management</li>
                    <li>• You're migrating from jQuery</li>
                    <li>• You want good documentation</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-blue-50 border border-blue-200">
                <div class="card-body">
                  <h4 class="card-title text-blue-700">Choose React When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You need the largest ecosystem</li>
                    <li>• You have React expertise</li>
                    <li>• You need enterprise support</li>
                    <li>• You're building complex SPAs</li>
                    <li>• You need extensive third-party libraries</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-orange-50 border border-orange-200">
                <div class="card-body">
                  <h4 class="card-title text-orange-700">Choose Svelte When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You want the smallest bundle sizes</li>
                    <li>• You like compile-time optimizations</li>
                    <li>• You want built-in animations</li>
                    <li>• You prefer simpler mental models</li>
                    <li>• You're building content sites</li>
                  </ul>
                </div>
              </div>

              <div class="card bg-purple-50 border border-purple-200">
                <div class="card-body">
                  <h4 class="card-title text-purple-700">Choose Web Components When</h4>
                  <ul class="text-sm space-y-1">
                    <li>• You need true framework interoperability</li>
                    <li>• You want standards-based components</li>
                    <li>• You need CSS encapsulation</li>
                    <li>• You're building design systems</li>
                    <li>• You want no build dependencies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="alert alert-info mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>
              <strong>Remember:</strong> Each framework solves different problems well. Choose based on your project needs,
              team expertise, and long-term maintenance goals rather than popularity alone.
            </span>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(): BindReturn<DocsComparisonDemoLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/docs-comparison" }

const DocsComparisonDemo = createBlueprint<DocsComparisonDemoProps, DocsComparisonDemoEvents, DocsComparisonDemoLogic>(
  id,
  render,
  { bind }
)

export default DocsComparisonDemo