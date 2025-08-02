```typescript
// Correct: Direct component usage with refs
import Button from '@duct-ui/components/button/button'
import { createRef } from '@duct-ui/core'

const buttonRef = createRef<ButtonLogic>()

<Button ref={buttonRef} label="Click me" />
buttonRef.current?.setDisabled(true)
```