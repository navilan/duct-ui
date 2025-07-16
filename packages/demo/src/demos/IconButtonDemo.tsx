import makeIconButton from "@duct-ui/components/button/icon-button"
import makeDemoLayout from "../components/DemoLayout"
import iconOne from "../icons/one.svg"
import iconTwo from "../icons/two.svg"
import iconThree from "../icons/three.svg"

const handler = (el: HTMLElement) => {
  const message = el.dataset['message']
  console.log(message)
}

const bindHandler = (el: HTMLElement) => {
  const message = el.dataset['message']
  console.log(message, "bound to DOM")
}

const IconButton1 = makeIconButton()
const IconButton2 = makeIconButton()
const IconButton3 = makeIconButton()

const IconButton4 = makeIconButton()
const IconButton5 = makeIconButton()
const IconButton6 = makeIconButton()
const DemoLayout = makeDemoLayout()

export function IconButtonDemo() {
  return (
    <DemoLayout
      title="Icon Button Component"
      description="Button component with icon support and flexible positioning"
    >
      <div>
        <h2 class="text-2xl font-semibold mb-4">Icon Button Examples</h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium mb-3">Icon Positions</h3>
            <div id="buttons" class="flex flex-row items-start gap-4 tiny-button-image">
              <IconButton1
                icon={iconOne}
                position="start"
                label="Start Icon"
                class="btn btn-outline px-6"
                data-message="Start position icon clicked!"
                on:click={handler}
              />
              <IconButton2
                icon={iconTwo}
                position="end"
                label="End Icon"
                class="btn btn-outline px-6"
                data-message="End position icon clicked!"
                on:click={handler}
              />
              <IconButton3
                icon={iconThree}
                class="btn btn-outline px-3 rounded-full"
                data-message="Icon-only button bound!"
                on:bind={bindHandler}
              />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-3">Different Styles</h3>
            <div class="flex flex-row items-start gap-4 tiny-button-image">
              <IconButton4
                icon={iconOne}
                label="Primary"
                class="btn btn-primary"
                data-message="Primary icon button!"
                on:click={handler}
              />
              <IconButton5
                icon={iconTwo}
                label="Secondary"
                class="btn btn-secondary"
                data-message="Secondary icon button!"
                on:click={handler}
              />
              <IconButton6
                icon={iconThree}
                label="Accent"
                class="btn btn-accent"
                data-message="Accent icon button!"
                on:click={handler}
              />
            </div>
          </div>
        </div>

        <div class="mt-8 p-4 bg-base-200 rounded-lg">
          <h3 class="text-lg font-medium mb-2">Features Demonstrated:</h3>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li>Icon button component extending base button</li>
            <li>Flexible icon positioning (start, end, icon-only)</li>
            <li>SVG icon support with proper sizing</li>
            <li>Lifecycle event binding (<code>on:bind</code>)</li>
            <li>Component inheritance and reusability</li>
          </ul>
        </div>
      </div>
    </DemoLayout>
  )
}