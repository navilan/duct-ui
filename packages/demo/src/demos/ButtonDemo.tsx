import makeButton from "@duct-ui/components/button/button"
import makeDemoLayout from "../components/DemoLayout"

const handler = (el: HTMLElement) => {
  const message = el.dataset['message']
  console.log(message)
}

const Button1 = makeButton()
const Button2 = makeButton()
const Button3 = makeButton()
const DemoLayout = makeDemoLayout()

// Set up event handlers
Button1.getLogic().then(l => {
  l.on('click', handler)
})

export function ButtonDemo() {
  return (
    <DemoLayout
      title="Button Component"
      description="Basic button component with click event handling"
    >
      <div>
        <h2 class="text-2xl font-semibold mb-4">Three Buttons Example</h2>
        <div id="buttons" class="flex flex-row items-start gap-4">
          <Button1 
            label="One" 
            class="btn btn-primary" 
            data-message="First button clicked!" 
          />
          <Button2 
            label="Two" 
            class="btn btn-secondary" 
            data-message="Second button clicked!" 
            on:click={handler} 
          />
          <Button3 
            label="Three" 
            class="btn btn-outline" 
            data-message="Third button clicked!" 
            on:click={handler} 
          />
        </div>
        
        <div class="mt-8 p-4 bg-base-200 rounded-lg">
          <h3 class="text-lg font-medium mb-2">Features Demonstrated:</h3>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li>Basic button component with label</li>
            <li>Different DaisyUI styling classes</li>
            <li>Event handling via both <code>on:click</code> props and <code>.getLogic()</code></li>
            <li>Data attributes for context passing</li>
          </ul>
        </div>
      </div>
    </DemoLayout>
  )
}