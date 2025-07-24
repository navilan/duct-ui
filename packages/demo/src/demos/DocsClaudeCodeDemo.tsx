import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import makeDemoLayout from "../components/DemoLayout"

export interface DocsClaudeCodeDemoEvents extends BaseComponentEvents { }
export interface DocsClaudeCodeDemoLogic { }
export interface DocsClaudeCodeDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsClaudeCodeDemoProps>) {
  const DemoLayout = makeDemoLayout()

  return (
    <div {...props}>
      <DemoLayout
        title="Using Claude Code with Duct"
        description="How to train Claude Code to generate high-quality Duct components"
        sourcePath="/demos/DocsClaudeCodeDemo.tsx"
      >
        <div class="prose prose-lg max-w-none">
          <p class="lead">
            Claude Code can achieve 95-99% correctness when generating Duct components, but only after properly learning
            the patterns. Here's the proven process to train Claude Code on your Duct codebase.
          </p>

          <h2>The Training Process</h2>

          <p>
            The key to getting excellent results from Claude Code is having it systematically review your Duct codebase
            in the correct order. This builds understanding from core concepts to practical implementations.
          </p>

          <div class="not-prose">
            <div class="steps steps-vertical w-full my-8">
              <div class="step step-primary">
                <div class="text-left ml-4">
                  <h3 class="font-bold text-base">Step 1: Review the GitHub Repository</h3>
                  <p class="text-sm text-base-content/70">Start by having Claude examine the overall project structure</p>
                </div>
              </div>
              <div class="step step-primary">
                <div class="text-left ml-4">
                  <h3 class="font-bold text-base">Step 2: Study the Core Package</h3>
                  <p class="text-sm text-base-content/70">Deep dive into blueprint patterns and runtime systems</p>
                </div>
              </div>
              <div class="step step-primary">
                <div class="text-left ml-4">
                  <h3 class="font-bold text-base">Step 3: Analyze Components</h3>
                  <p class="text-sm text-base-content/70">Learn from real component implementations</p>
                </div>
              </div>
              <div class="step step-primary">
                <div class="text-left ml-4">
                  <h3 class="font-bold text-base">Step 4: Review All Demos</h3>
                  <p class="text-sm text-base-content/70">Understand practical usage patterns and integration</p>
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
            <div class="bg-base-200 rounded-lg p-6 my-6">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-bold text-lg">Training Prompt for Claude Code</h4>
                <button class="btn btn-sm btn-outline" onclick="navigator.clipboard.writeText(document.getElementById('training-prompt').textContent)">
                  Copy to Clipboard
                </button>
              </div>
              <pre class="text-sm whitespace-pre-wrap" id="training-prompt">{`I want you to learn the Duct UI framework so you can help me build components. Please follow this exact sequence to understand the patterns:

1. **Review the GitHub Repository Structure**
   - Go to https://github.com/navilan/duct-ui
   - Examine the overall project structure and README
   - Understand the monorepo layout with packages/core, packages/components, and packages/demo

2. **Study the Core Package** (/packages/core/src/)
   - Review blueprint.ts - this is the heart of Duct's component system
   - Examine runtime.ts - understand how components are managed
   - Look at lifecycle.ts - learn the component lifecycle
   - Pay special attention to TypeScript interfaces and the createBlueprint function

3. **Analyze Components** (/packages/components/src/)
   - Start with simple components like button/button.tsx
   - Study more complex ones like navigation/tabs.tsx and layout/modal.tsx
   - Notice the consistent pattern: render function, bind function, TypeScript interfaces
   - Pay attention to how events are handled and how logic is exposed

4. **Review All Demos** (/packages/demo/src/demos/)
   - Look at how components are used in practice
   - See integration patterns and event handling
   - Notice how complex interactions are built up from simple components

After you've completed this review, you should understand:
- The blueprint pattern with render/bind/load/release functions
- TypeScript interface patterns for Events, Logic, and Props
- How to use createBlueprint to assemble components
- Event handling with EventEmitter
- DOM manipulation patterns
- Component lifecycle management
- How to expose component logic for external control

Please confirm when you've completed each step, and then I'll start asking you to help build Duct components.`}</pre>
            </div>
          </div>


          <h2>Working with Claude</h2>

          <p>
            Once Claude has completed the training process, you can expect good results with these types of requests:
          </p>

          <div class="not-prose">
            <div class="bg-base-200 rounded-lg p-6 my-6">
              <h4 class="font-bold mb-4">Example Requests:</h4>
              <div class="space-y-4">
                <div class="bg-base-100 p-4 rounded border-l-4 border-primary">
                  <p class="text-sm font-medium text-primary">Component Generation</p>
                  <p class="text-sm">"Create a Duct accordion component with expand/collapse animations and keyboard navigation."</p>
                </div>

                <div class="bg-base-100 p-4 rounded border-l-4 border-secondary">
                  <p class="text-sm font-medium text-secondary">Debugging</p>
                  <p class="text-sm">"This Duct modal component isn't closing when clicking the overlay. Can you fix the event handling?"</p>
                </div>

                <div class="bg-base-100 p-4 rounded border-l-4 border-success">
                  <p class="text-sm font-medium text-success">Enhancement</p>
                  <p class="text-sm">"Add async data loading to this existing list component using the load function pattern."</p>
                </div>

                <div class="bg-base-100 p-4 rounded border-l-4 border-warning">
                  <p class="text-sm font-medium text-warning">Architecture</p>
                  <p class="text-sm">"How should I structure a multi-step form using Duct components? Show me the component architecture."</p>
                </div>
              </div>
            </div>
          </div>

          <h2>Common Issues</h2>

          <p>
            Even with 95-99% accuracy, you might encounter these common issues that are easy to fix:
          </p>

          <div>
            <ol>
              <li>
                <p>
                  Claude frequently forgets that the <code>el</code> parameter to bind is the component container and does
                  a query for the container using a <code>data</code> attribute. You can simply change this line of code
                  and everything else will work okay.
                </p>
              </li>
              <li>
                <p>
                  Claude may get confused on how to tie in the <code>on:</code> event handlers in render with code in bind. The
                  solution is to use a global variable to track the component logic and / or the eventEmitter. You may
                  have to manually fix this.
                </p>
              </li>
              <li>
                <p>
                  Claude may not remember that you can get the logic (the bound functions / properties) of a
                  component instance using:
                </p>
                <div class="not-prose">
                  <div class="bg-base-200 rounded-lg p-4 my-2">
                    <pre class="text-sm"><code>{`let logic: ComponentLogic
Component.getLogic().then(l => logic = l)`}</code></pre>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          <div class="alert alert-success mt-6">
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
      </DemoLayout>
    </div>
  )
}

function bind(): BindReturn<DocsClaudeCodeDemoLogic> {
  return {
    release: () => { }
  }
}

const id = { id: "duct-demo/docs-claude-code" }

export default () => {
  return createBlueprint<DocsClaudeCodeDemoProps, DocsClaudeCodeDemoEvents, DocsClaudeCodeDemoLogic>(
    id,
    render,
    { bind }
  )
}