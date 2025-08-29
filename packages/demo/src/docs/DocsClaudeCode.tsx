import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import DemoLayout from "@components/DemoLayout"
import Markdown from "@duct-ui/components/content/markdown/markdown"
import "@duct-ui/components/content/markdown/markdown.css"
import mcpServerContent from "./content/claude-code/mcp-server.md?raw"
import introductionContent from "./content/claude-code/introduction.md?raw"
import trainingPromptContent from "./content/claude-code/training-prompt.md?raw"
import agentsIntroContent from "./content/claude-code/agents-intro.md?raw"
import expertAgentContent from "./content/claude-code/expert-agent.md?raw"
import reviewerAgentContent from "./content/claude-code/reviewer-agent.md?raw"
import workingWithClaudeContent from "./content/claude-code/working-with-claude.md?raw"
import commonIssuesContent from "./content/claude-code/common-issues.md?raw"

export interface DocsClaudeCodeEvents extends BaseComponentEvents { }
export interface DocsClaudeCodeLogic { }
export interface DocsClaudeCodeProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsClaudeCodeProps>) {

  return (
    <div {...renderProps(props)}>
      <DemoLayout
        title="Using Claude Code with Duct"
        description="How to train Claude Code to generate high-quality Duct components"
        sourcePath="/demos/DocsClaudeCodeDemo.tsx"
      >
        <>
          <div class="prose prose-lg max-w-none">
            <Markdown content={mcpServerContent} />
            <Markdown content={introductionContent} />

            <div class="not-prose">
              <div class="steps steps-vertical w-full my-8">
                <div class="step step-primary">
                  <div class="text-left ml-4">
                    <h3 class="font-bold text-base">Step 1: Review the GitHub Repository</h3>
                    <p class="text-sm">Start by having Claude examine the overall project structure</p>
                  </div>
                </div>
                <div class="step step-primary">
                  <div class="text-left ml-4">
                    <h3 class="font-bold text-base">Step 2: Study the Core Package</h3>
                    <p class="text-sm">Deep dive into blueprint patterns and runtime systems</p>
                  </div>
                </div>
                <div class="step step-primary">
                  <div class="text-left ml-4">
                    <h3 class="font-bold text-base">Step 3: Analyze Components</h3>
                    <p class="text-sm">Learn from real component implementations</p>
                  </div>
                </div>
                <div class="step step-primary">
                  <div class="text-left ml-4">
                    <h3 class="font-bold text-base">Step 4: Review All Demos</h3>
                    <p class="text-sm">Understand practical usage patterns and integration</p>
                  </div>
                </div>
              </div>
            </div>

            <h2>Copy-Paste Training Prompt</h2>

            <p>
              Use this prompt to train Claude Code on your Duct codebase. This systematic approach ensures Claude
              understands both the theory and practice of Duct development.
            </p>

            <div class="not-prose">
              <div class="rounded-lg p-6 my-6">
                <div class="flex justify-between items-center mb-4">
                  <h4 class="font-bold text-lg">Training Prompt for Claude Code</h4>
                  <button class="btn btn-sm btn-outline" onclick="navigator.clipboard.writeText(document.getElementById('training-prompt').textContent)">
                    Copy to Clipboard
                  </button>
                </div>
                <div class="w-full" id="training-prompt">
                  <Markdown content={trainingPromptContent} />
                </div>
              </div>
            </div>
          </div>

          <div class="prose prose-lg max-w-none">
            <Markdown content={agentsIntroContent} />

            <details>
              <summary>Expert Agent</summary>
              <div class="prose prose-sm max-w-none mt-4">
                <Markdown content={expertAgentContent} />
              </div>
            </details>

            <details>
              <summary>Reviewer Agent</summary>
              <div class="prose prose-sm max-w-none mt-4">
                <Markdown content={reviewerAgentContent} />
              </div>
            </details>
          </div>
          <div class="prose prose-lg max-w-none mt-8">


            <Markdown content={workingWithClaudeContent} />

            <div class="not-prose">
              <div class="rounded-lg p-6 my-6">
                <h4 class="font-bold mb-4">Example Requests:</h4>
                <div class="space-y-4">
                  <div class="alert-left-primary">
                    <p class="text-sm font-medium text-primary">Component Generation</p>
                    <p class="text-sm">"Create a Duct accordion component with expand/collapse animations and keyboard navigation."</p>
                  </div>

                  <div class="alert-left-secondary">
                    <p class="text-sm font-medium text-secondary">Debugging</p>
                    <p class="text-sm">"This Duct modal component isn't closing when clicking the overlay. Can you fix the event handling?"</p>
                  </div>

                  <div class="alert-left-success">
                    <p class="text-sm font-medium text-success">Enhancement</p>
                    <p class="text-sm">"Add async data loading to this existing list component using the load function pattern."</p>
                  </div>

                  <div class="alert-left-warning">
                    <p class="text-sm font-medium text-warning">Architecture</p>
                    <p class="text-sm">"How should I structure a multi-step form using Duct components? Show me the component architecture."</p>
                  </div>
                </div>
              </div>
            </div>

            <Markdown content={commonIssuesContent} />

            <div class="alert mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                <strong>Pro Tip:</strong> The systematic review process is crucial. Skipping steps or rushing through
                the codebase exploration will result in lower-quality generated code. Take time to let Claude properly
                absorb the patterns.
              </span>
            </div>
          </div>
        </>
      </DemoLayout>
    </div>
  )
}

function bind(): BindReturn<DocsClaudeCodeLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/docs-claude-code" }

const DocsClaudeCode = createBlueprint<DocsClaudeCodeProps, DocsClaudeCodeEvents, DocsClaudeCodeLogic>(
  id,
  render,
  { bind }
)

export default DocsClaudeCode