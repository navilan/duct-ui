import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import DemoLayout from "@components/DemoLayout"
import Markdown from "@duct-ui/components/content/markdown/markdown"
import "@duct-ui/components/content/markdown/markdown.css"
import componentAnatomyContent from "./content/building/component-anatomy.md?raw"
import bindAndLifecycleContent from "./content/building/bind-and-lifecycle.md?raw"
import goodRenderFunctionContent from "./content/building/good-render-function.md?raw"
import badRenderFunctionContent from "./content/building/bad-render-function.md?raw"

export interface DocsBuildingEvents extends BaseComponentEvents { }
export interface DocsBuildingLogic { }
export interface DocsBuildingProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsBuildingProps>) {
  return (
    <div {...renderProps(props)}>
      <DemoLayout
        title="Building Components in Duct"
        description="A comprehensive guide to creating Duct components"
        sourcePath="/demos/DocsBuildingDemo.tsx"
      >
        <div class="prose prose-lg max-w-none">
          <Markdown content={componentAnatomyContent} />
          <div class="not-prose">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
              <div class="info-card info-card-success">
                <div class="card-body">
                  <h4 class="card-title text-success text-base">✅ Good Render Function</h4>
                  <div class="prose prose-sm">
                    <Markdown content={goodRenderFunctionContent} />
                  </div>
                </div>
              </div>

              <div class="info-card info-card-error">
                <div class="card-body">
                  <h4 class="card-title text-error text-base">❌ Bad Render Function</h4>
                  <div class="prose prose-sm">
                    <Markdown content={badRenderFunctionContent} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Markdown content={bindAndLifecycleContent} />

          <div class="alert mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Pro Tip:</strong> Start simple and gradually add complexity. A basic component with just
              render and bind functions is often all you need. Add load functions and complex logic only when required.
            </span>
          </div>

        </div>
      </DemoLayout >
    </div >
  )
}

function bind(): BindReturn<DocsBuildingLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/docs-building" }

const DocsBuilding = createBlueprint<DocsBuildingProps, DocsBuildingEvents, DocsBuildingLogic>(
  id,
  render,
  { bind }
)

export default DocsBuilding