```html
<template>
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
</script>
```