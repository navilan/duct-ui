import { BindReturn, createBlueprint, type BaseProps } from "@duct-ui/core/blueprint"
import Markdown from "@duct-ui/components/content/markdown/markdown"
import "@duct-ui/components/content/markdown/markdown.css"
import { galleryItems } from "./data/built-with-duct.js"
import introductionContent from "./content/built-with-duct/introduction.md?raw"
import shareProjectContent from "./content/built-with-duct/share-project.md?raw"

function render(props: BaseProps<{}>) {
  return (
    <div class="prose prose-lg max-w-4xl p-8" {...props}>
      <Markdown content={introductionContent} />

      <div class="flex flex-col lg:flex-row lg:flex-wrap gap-6 not-prose">
        {galleryItems.map((item, index) => (
          <div data-key={index} class="flex-1 lg:flex-none lg:w-[calc(33.333%-1rem)] relative">
            <div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
              {/* Card Body */}
              <div class="card-body p-4 flex-1">
                <h3 class="card-title text-lg mb-2">{item.title}</h3>
                <p class="text-base-content/80 text-sm mb-3">{item.description}</p>
                
                {/* Top 3 Features */}
                <div class="space-y-2 mb-3">
                  {item.features.slice(0, 3).map((feature, idx) => {
                    const [title] = feature.split(' - ')
                    return (
                      <div data-key={idx} class="flex items-center gap-2 text-xs">
                        <svg class="w-3 h-3 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="font-medium">{title}</span>
                      </div>
                    )
                  })}
                </div>

                {/* More Features Button */}
                {item.features.length > 3 && (
                  <div class="group/features relative">
                    <button class="btn btn-outline btn-xs">
                      +{item.features.length - 3} more features
                    </button>
                    
                    {/* All Features Popup */}
                    <div class="absolute bottom-full left-0 mb-2 w-80 bg-base-300 rounded-lg shadow-2xl border border-base-content/20 opacity-0 group-hover/features:opacity-100 transition-opacity duration-300 p-4 z-50 pointer-events-none">
                      <h4 class="font-semibold text-sm mb-3 text-center">All Features</h4>
                      <ul class="space-y-2">
                        {item.features.map((feature, idx) => {
                          const [title, ...descParts] = feature.split(' - ')
                          const description = descParts.join(' - ')
                          return (
                            <li data-key={idx} class="flex items-start gap-2 text-xs">
                              <svg class="w-3 h-3 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <div>
                                <span class="font-medium">{title}</span>
                                {description && (
                                  <div class="text-base-content/70 text-xs mt-1">{description}</div>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Separator */}
              <div class="divider my-0"></div>

              {/* Card Footer */}
              <div class="card-actions justify-end items-center p-4">
                <div class="flex gap-2">
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary btn-xs"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit
                  </a>
                  {item.source && (
                    <a
                      href={item.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-outline btn-xs"
                    >
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div class="tip mt-8">
        <p class="text-sm">
          <strong>💡 Tip:</strong> Study these projects to see different approaches to building with Duct:
          <a href="https://github.com/navilan/duct-ui" class="text-primary hover:underline ml-2" target="_blank" rel="noopener noreferrer">Framework documentation</a>,
          <a href="https://github.com/navilan/duct-ui/tree/main/packages/starter" class="text-primary hover:underline ml-2" target="_blank" rel="noopener noreferrer">Starter template</a>, and
          <a href="https://github.com/navilan/navilan.in" class="text-primary hover:underline ml-2" target="_blank" rel="noopener noreferrer">Production website</a>
        </p>
      </div>

      <Markdown content={shareProjectContent} />

      <div class="info-card mt-8">
        <h3 class="text-lg font-semibold mb-2">🎯 What to Look For</h3>
        <ul class="list-disc ml-6 space-y-1">
          <li>How different projects organize their <code class="px-2 py-1 rounded">content/</code> directories</li>
          <li>Various approaches to theme implementation and customization</li>
          <li>Different navigation patterns and user interface designs</li>
          <li>How static site generation is configured for different use cases</li>
          <li>Integration patterns with external services and APIs</li>
          <li>Multi-language content management strategies</li>
          <li>Performance optimization techniques in production</li>
        </ul>
      </div>
    </div>
  )
}

const id = { id: "docs/built-with-duct" }

function bind(): BindReturn<any> {
  return {
    release: () => { }
  }
}

const DocsBuiltWithDuct = createBlueprint(id, render, { bind })

export default DocsBuiltWithDuct