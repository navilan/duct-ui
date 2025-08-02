```typescript
// Render function
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
    el.className = 'btn-clicked';
    eventEmitter.emit('click');
  };

  el.addEventListener('click', handleClick);

  return {
    release: () => {
      el.removeEventListener('click', handleClick)
    }
  };
}

// Create and export component
const Button = createBlueprint(
  { id: "my/button" },
  render,
  { bind }
);

export default Button;
```