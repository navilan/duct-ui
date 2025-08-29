~~~typescript
function render(props: BaseProps<InputProps>) {
  // DON'T: Side effects in render
  console.log('Rendering input')

  // DON'T: Event handlers in render
  const handleClick = () => alert('clicked')

  // DON'T: Complex logic in render
  if (props.value && props.value.length > 10) {
    validateInput(props.value)
  }

  return (
    <input
      onClick={handleClick} // DON'T: Inline handlers
      {...renderProps(props)}
    />
  )
}
~~~