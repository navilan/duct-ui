import { BindReturn, createBlueprint, renderProps, type BaseProps } from "@duct-ui/core/blueprint"
import Markdown from "@duct-ui/components/content/markdown/markdown"
import "@duct-ui/components/content/markdown/markdown.css"
import introductionContent from "./content/ssg/introduction.md?raw"
import pageComponentsContent from "./content/ssg/page-components.md?raw"
import routeTypesContent from "./content/ssg/route-types.md?raw"
import layoutTemplatesContent from "./content/ssg/layout-templates.md?raw"
import configurationContent from "./content/ssg/configuration.md?raw"
import buildCommandsContent from "./content/ssg/build-commands.md?raw"
import developmentWorkflowContent from "./content/ssg/development-workflow.md?raw"
import advancedFeaturesContent from "./content/ssg/advanced-features.md?raw"

function render(props: BaseProps<{}>) {
  return (
    <div class="prose prose-lg max-w-4xl p-8" {...renderProps(props)}>
      <Markdown content={introductionContent} />

      <Markdown content={pageComponentsContent} />

      <div class="tip mt-4">
        <p class="text-sm">
          <strong>📝 Note:</strong> See real examples in the Duct demo source:
          <a href="https://github.com/navilan/duct-ui/blob/main/packages/demo/src/pages/demos/index.tsx" class="text-primary hover:underline ml-2" target="_blank" rel="noopener noreferrer">pages/demos/index.tsx</a>,
          <a href="https://github.com/navilan/duct-ui/blob/main/packages/demo/src/pages/demos/[sub].tsx" class="text-primary hover:underline ml-2" target="_blank" rel="noopener noreferrer">pages/demos/[sub].tsx</a>, and
          <a href="https://github.com/navilan/duct-ui/blob/main/packages/demo/src/pages/404.tsx" class="text-primary hover:underline ml-2" target="_blank" rel="noopener noreferrer">pages/404.tsx</a>
        </p>
      </div>


      <Markdown content={routeTypesContent} />

      <Markdown content={layoutTemplatesContent} />

      <Markdown content={configurationContent} />

      <Markdown content={buildCommandsContent} />

      <Markdown content={developmentWorkflowContent} />

      <Markdown content={advancedFeaturesContent} />

      <div class="info-card mt-8">
        <h3 class="text-lg font-semibold mb-2">💡 Pro Tips</h3>
        <ul class="list-disc ml-6 space-y-1">
          <li>Return Duct components (created with <code class="px-2 py-1 rounded">createBlueprint</code>) for interactive pages</li>
          <li>Return plain JSX for purely static content that needs no client-side logic</li>
          <li>Use descriptive page context for better SEO</li>
          <li>Include Open Graph images for social media sharing</li>
          <li>Keep static generation fast by minimizing data fetching in <code class="px-2 py-1 rounded">getRoutes()</code></li>
          <li>Use environment variables for configuration that changes between environments</li>
          <li>Study the <a href="https://github.com/navilan/duct-ui/tree/main/packages/demo/src/pages" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">demo pages source</a> for real-world examples</li>
        </ul>
      </div>
    </div>
  )
}

const id = { id: "docs/ssg" }

function bind(): BindReturn<any> {
  return {
    release: () => { }
  }
}

const DocsSSG = createBlueprint(id, render, { bind })

export default DocsSSG