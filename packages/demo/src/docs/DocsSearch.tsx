import { createBlueprint, renderProps, type BaseProps } from '@duct-ui/core'
import Markdown from '@duct-ui/components/content/markdown/markdown'
import searchMd from './content/search.md?raw'

interface DocsSearchProps {}

function render(props: BaseProps<DocsSearchProps>) {
  return (
    <div class="prose prose-lg max-w-4xl p-8" {...renderProps(props)}>
      <Markdown content={searchMd} />
    </div>
  )
}

const DocsSearch = createBlueprint(
  { id: "demo/docs-search" },
  render, {}
)

export default DocsSearch