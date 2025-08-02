~~~markdown
I want you to learn the Duct UI framework so you can help me build components.
Please follow this exact sequence to understand the patterns:

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


Please confirm when you've completed each step, and then I'll start asking you to help build Duct components.
~~~