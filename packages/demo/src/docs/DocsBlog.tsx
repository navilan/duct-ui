import Markdown from "@duct-ui/components/content/markdown/markdown"
import blogContent from './content/creating-a-blog.md?raw'

/**
 * Documentation component for creating blogs with Duct
 */
const DocsBlog = () => {
  return (
    <div class="px-8 py-6">
      <Markdown content={blogContent} />
    </div>
  )
}

export default DocsBlog