import { BindReturn, createBlueprint, renderProps, type BaseProps } from "@duct-ui/core/blueprint"
import Markdown from "@duct-ui/components/content/markdown/markdown"
import "@duct-ui/components/content/markdown/markdown.css"
import blogContent from './content/creating-a-blog.md?raw'

function render(props: BaseProps<{}>) {
  return (
    <div class="prose prose-lg max-w-4xl p-8" {...renderProps(props)}>
      <Markdown content={blogContent} />
    </div>
  )
}

const id = { id: "docs/blog" }

function bind(): BindReturn<any> {
  return {
    release: () => { }
  }
}

const DocsBlog = createBlueprint(id, render, { bind })

export default DocsBlog