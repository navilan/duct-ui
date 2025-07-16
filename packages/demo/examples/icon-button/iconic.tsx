import { makeIconButton } from "@duct-ui/components/button/icon-button"
import iconOne from "../../src/icons/one.svg"
import iconTwo from "../../src/icons/two.svg"
import iconThree from "../../src/icons/three.svg"

const handler = (el: HTMLElement) => {
  const message = el.dataset['message']
  console.log(message)
}


const bindHandler = (el: HTMLElement) => {
  const message = el.dataset['message']
  console.log(message, "bound")
}


const Button1 = makeIconButton()
const Button2 = makeIconButton()
const Button3 = makeIconButton()

function Iconic() {
  return (
    <div>
      <h2>That's Iconic</h2>
      <div id="buttons" class="flex flex-row items-start tiny-button-image">
        <Button1 icon={iconOne} position="start" label="One" class="btn btn-outline px-8 mx-2" data-message="First" on:click={handler} />
        <Button2 icon={iconTwo} position="end" label="Two" class="btn btn-outline px-8 mx-2" data-message="Second" on:click={handler} />
        <Button3 icon={iconThree} class="btn btn-outline mx-2 px-2 rounded-full" data-message="Third" on:bind={bindHandler} />

      </div>
    </div>
  )
}

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app")
  if (!app) return

  const hml = Iconic().toString()
  app.innerHTML = hml
})