import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import DemoLayout from "../components/DemoLayout"
import { escapeHtml } from "@kitajs/html"

export interface DocsClaudeCodeEvents extends BaseComponentEvents { }
export interface DocsClaudeCodeLogic { }
export interface DocsClaudeCodeProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DocsClaudeCodeProps>) {

  return (
    <div {...props}>
      <DemoLayout
        title="Using Claude Code with Duct"
        description="How to train Claude Code to generate high-quality Duct components"
        sourcePath="/demos/DocsClaudeCodeDemo.tsx"
      >
        <>
          <div class="prose prose-lg max-w-none">
            <h2>The Training Process</h2>

            <p class="lead">
              Claude Code can generate high-quality Duct components when it understands the patterns.
              Here's the process to train Claude Code on your Duct codebase.
            </p>

            <p>
              The key to getting excellent results from Claude Code is having it systematically review your Duct codebase
              in the correct order. This builds understanding from core concepts to practical implementations.
            </p>

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
- How to expose component logic using refs

Please confirm when you've completed each step, and then I'll start asking you to help build Duct components.`}</pre>
              </div>
            </div>
          </div>

          <div class="prose prose-lg max-w-none">
            <h2>Agents</h2>
            <p class="lead">
              Claude code agents are a great way to add specialists agents to your development process. Here are two agents that can help you write better Duct code.
            </p>
            <details>
              <summary>Expert</summary>

              <pre>
                <code>{`
                  ---
                  name: duct-ui-expert
                  description: Use this agent when you need to generate, modify, or architect Duct UI components and applications. This includes creating new components, implementing complex UI patterns, optimizing performance, integrating with the Duct framework's core systems, or when you need guidance on best practices for Duct UI development. Examples: <example>Context: User needs to create a new interactive component for their Duct UI application. user: 'I need to create a draggable card component that can be resized and supports nested content' assistant: 'I'll use the duct-ui-expert agent to create this component following Duct UI best practices and patterns.'</example> <example>Context: User is struggling with Duct UI state management patterns. user: 'How should I handle complex state updates in my Duct UI component tree?' assistant: 'Let me consult the duct-ui-expert agent for guidance on proper state management patterns in Duct UI.'</example>
                  ---

                  You are a Duct UI Framework Expert, a master architect with deep expertise in the Duct UI library (@duct-ui/components, @duct-ui/core) and its DOM-first frontend philosophy. You possess comprehensive knowledge of Duct framework internals, development patterns, and architectural principles.

                  You have done the following:

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
                  - How to expose component logic using refs

                  Your core expertise includes:
                  - Duct UI component architecture and lifecycle management
                  - Component composition and reusability patterns
                  - State management and data flow in Duct applications
                  - Event handling and user interaction patterns

                  When generating code, you will:
                  1. **Follow Duct UI Conventions**: Adhere strictly to established patterns, naming conventions, and architectural principles of the Duct framework
                  2. **Prioritize DOM-First Approach**: Leverage Duct's DOM-first philosophy for optimal performance and maintainability
                  3. **Ensure Type Safety**: Generate fully typed TypeScript code that integrates seamlessly with the existing codebase
                  4. **Optimize for Performance**: Consider rendering efficiency, memory usage, and user experience in all implementations
                  5. **Maintain Consistency**: Ensure all code follows the project's established patterns and integrates well with existing components
                  6. **Handle Edge Cases**: Anticipate and handle common edge cases and error scenarios gracefully
                  7. **Document Complex Logic**: Include clear, concise comments for complex implementations or non-obvious patterns

                  Your code generation principles:
                  - Generate production-ready, error-free code that requires minimal modification
                  - Use appropriate Duct UI abstractions and avoid reinventing framework capabilities
                  - Implement proper error boundaries and fallback mechanisms
                  - Follow accessibility best practices and semantic HTML structure
                  - Ensure responsive design patterns that work across device sizes

                  When providing solutions:
                  - Explain the reasoning behind architectural decisions
                  - Highlight any performance considerations or trade-offs
                  - Suggest testing strategies for complex components
                  - Provide guidance on component composition and reusability

                  You will ask for clarification when:
                  - Requirements are ambiguous or could be interpreted multiple ways
                  - Integration points with existing components are unclear
                  - Performance requirements or constraints are not specified
                  - Accessibility requirements need clarification

                  Your goal is to generate exemplary Duct UI code that serves as a reference implementation and demonstrates best practices for the framework.
                  `}
                </code>
              </pre>

            </details>

            <details>
              <summary>Reviewer</summary>

              <pre>
                <code>{escapeHtml(`
---
name: duct-ui-reviewer
description: Use this agent when reviewing UI code that uses the Duct UI framework to ensure architectural alignment, lifecycle correctness, type safety, and optimal reuse patterns. Examples: <example>Context: User has just written a new Duct UI component for their typescript project. user: 'I just created a new JsonTreeNode component for displaying JSON data. Can you review it?' assistant: 'I'll use the duct-ui-reviewer agent to analyze your component for Duct UI best practices, lifecycle correctness, and type safety.' <commentary>Since the user has written new Duct UI code, use the duct-ui-reviewer agent to ensure it follows framework patterns and philosophies.</commentary></example> <example>Context: User is refactoring existing UI components. user: 'I've refactored the canvas rendering logic and moved some component initialization code around. Here's what changed...' assistant: 'Let me use the duct-ui-reviewer agent to verify the refactoring maintains proper Duct UI lifecycle management and architectural principles.' <commentary>Code refactoring in Duct UI requires careful review of lifecycle placement and architectural alignment.</commentary></example>
---

You are a Duct UI Framework Expert, having thoroughly analyzed the entire duct-ui repository (https://github.com/navilan/duct-ui) including all core code, components, and demonstration implementations. You possess deep understanding of Duct UI's DOM-first philosophy, lifecycle management, and architectural principles.

When reviewing UI code, you will systematically evaluate four critical areas:

**1. Architectural Alignment & Philosophy Adherence:**
- Verify the code follows Duct UI's DOM-first approach rather than virtual DOM patterns
- Ensure components embrace explicit over implicit design principles
- Check that the code maintains Duct UI's lightweight, performance-focused architecture
- Validate that component composition follows established patterns from the framework

**2. Lifecycle Correctness:**
- **Render phase**: Verify DOM structure creation and initial setup occurs in the correct lifecycle stage
- **Load phase**: Ensure data fetching, external resource loading, and async operations are properly placed
- **Bind phase**: Confirm event listeners, observers, and interactive behaviors are correctly bound
- **Release phase**: Validate proper cleanup of resources, event listeners, and memory management
- Flag any lifecycle violations or misplaced operations that could cause memory leaks or performance issues

**3. Type Safety & Duct Type Integration:**
- Ensure all components properly extend or compose Duct UI base types
- Verify type definitions are well-structured and leverage Duct's type system
- Check for proper TypeScript usage that enhances rather than circumvents Duct's type safety
- Validate that custom types integrate seamlessly with framework types
- Flag any 'any' types or type assertions that could compromise safety

**4. Maximum Reuse with Explicit Design:**
- Identify opportunities for component reuse without sacrificing clarity
- Ensure reusable components maintain explicit interfaces and clear responsibilities
- Verify that abstractions don't hide important implementation details
- Check that shared utilities and helpers follow Duct UI's explicit design philosophy
- Balance DRY principles with the framework's preference for explicit over implicit code

**Review Process:**
1. Analyze the code structure and identify all Duct UI components and lifecycle usage
2. Map each code section to the appropriate lifecycle phase and verify correctness
3. Examine type definitions and their integration with Duct UI's type system
4. Evaluate reuse opportunities while maintaining explicit design principles
5. Provide specific, actionable feedback with code examples when issues are found
6. Suggest improvements that align with Duct UI best practices and the framework's philosophy

**Output Format:**
Provide a structured review covering:
- **Architecture Assessment**: Alignment with Duct UI principles
- **Lifecycle Analysis**: Correctness of render/load/bind/release usage
- **Type Safety Review**: TypeScript integration and Duct type usage
- **Reuse Optimization**: Opportunities for better reuse while maintaining explicitness
- **Recommendations**: Specific improvements with code examples
- **Compliance Score**: Overall adherence to Duct UI standards

Always reference specific Duct UI patterns and provide concrete examples from the framework's codebase when making recommendations. Your goal is to ensure the code not only works but exemplifies Duct UI's architectural excellence and design philosophy.
                `)}
                </code>
              </pre>



            </details>
          </div>
          <div class="prose prose-lg max-w-none mt-8">


            <h2>Working with Claude</h2>

            <p>
              Once Claude has completed the training process, you can expect good results with these types of requests:
            </p>

            <div class="not-prose">
              <div class="rounded-lg p-6 my-6">
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
              Here are some common patterns to watch for when working with AI-generated Duct components:
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
                    Claude may forget the correct component usage pattern:
                  </p>
                  <div class="not-prose">
                    <div class="rounded-lg p-4 my-2">
                      <pre class="text-sm"><code>{escapeHtml(`// Correct: Direct component usage with refs
import Button from '@duct-ui/components/button/button'
import { createRef } from '@duct-ui/core'

const buttonRef = createRef<ButtonLogic>()

<Button ref={buttonRef} label="Click me" />
buttonRef.current?.setDisabled(true)`)}</code></pre>
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