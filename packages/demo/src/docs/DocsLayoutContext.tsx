import { BindReturn, createBlueprint, renderProps, type BaseProps } from "@duct-ui/core/blueprint"
import Markdown from "@duct-ui/components/content/markdown/markdown"
import "@duct-ui/components/content/markdown/markdown.css"
import layoutContextContent from './content/layout-context.md?raw'

function render(props: BaseProps<{}>) {
  return (
    <div class="prose prose-lg max-w-4xl p-8" {...renderProps(props)}>
      <Markdown content={layoutContextContent} />
    </div>
  )
}

const id = { id: "docs/layout-context" }

function bind(): BindReturn<any> {
  return {
    release: () => { }
  }
}

const DocsLayoutContext = createBlueprint(id, render, { bind })

export default DocsLayoutContext