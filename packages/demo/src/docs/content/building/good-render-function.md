~~~typescript
function render(props: BaseProps<InputProps>) {
  const {
    initialValue = '',
    placeholder = '',
    required = false,
    class: className = '',
    ...moreProps
  } = props

  return (
    <div class="input-container" {...renderProps(moreProps)}>
      <input
        type="text"
        class={`input ${className}`}
        placeholder={placeholder}
        value={initialValue}
        required={required}
        data-input
      />
      <span class="error-message hidden" data-error></span>
    </div>
  )
}
~~~