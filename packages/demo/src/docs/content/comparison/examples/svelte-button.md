```svelte
<script>
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
</button>
```