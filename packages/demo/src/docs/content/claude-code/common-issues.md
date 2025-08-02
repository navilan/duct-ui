## Common Issues

Here are some common patterns to watch for when working with AI-generated Duct components:

1. Claude frequently forgets that the `el` parameter to bind is the component container and does a query for the container using a `data` attribute. You can simply change this line of code and everything else will work okay.
2. Claude may get confused on how to tie in the `on:` event handlers in render with code in bind. The solution is to use a global variable to track the component logic and / or the eventEmitter. You may have to manually fix this.
3. Claude may forget the correct component usage pattern:

  ```typescript
  // Correct: Direct component usage with refs
  import Button from '@duct-ui/components/button/button'
  import { createRef } from '@duct-ui/core'

  const buttonRef = createRef<ButtonLogic>()

  <Button ref={buttonRef} label="Click me" />
  buttonRef.current?.setDisabled(true)
  ```
