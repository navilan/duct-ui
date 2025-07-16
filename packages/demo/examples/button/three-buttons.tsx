import { makeButton } from "@duct-ui/components/button/button"

const handler = (el: HTMLElement) => {
  const message = el.dataset['message']
  console.log(message)
}

const Button1 = makeButton()
const Button2 = makeButton()
const Button3 = makeButton()

Button1.getLogic().then(l => {
  l.on('click', handler)
})

function ThreeButtons() {
  return (
    <div>
      <h2>Three Buttons</h2>
      <div id="buttons" class="flex flex-row items-start">
        <Button1 label="One" class="btn btn-primary mx-2" data-message="First" />
        <Button2 label="Two" class="btn btn-secondary mx-2" data-message="Second" on:click={handler} />
        <Button3 label="Tri" class="btn btn-outline mx-2" data-message="Third" on:click={handler} />
      </div>
    </div>
  )
}

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app")
  if (!app) return

  const hml = ThreeButtons().toString()
  app.innerHTML = hml
})