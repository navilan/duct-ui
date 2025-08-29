import { createBlueprint, renderProps, type BaseProps } from '@duct-ui/core'

interface AboutContainerProps { }

function render(props: BaseProps<AboutContainerProps>) {
  return (
    <div {...renderProps(props)}>
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          About Us
        </h1>
        <p class="text-xl opacity-70 max-w-3xl mx-auto">
          We're passionate about creating better web experiences through
          thoughtful design and clean, maintainable code.
        </p>
      </div>

      <div class="prose prose-lg max-w-none">
        <h2>Our Story</h2>
        <p>
          Our journey began with a simple observation: web development had become
          unnecessarily complex. Frameworks were growing larger, patterns were becoming
          implicit, and developer experience was suffering in the name of convenience.
        </p>

        <p>
          We believe that the best tools are those that make the right thing easy
          to do and the wrong thing hard to do. That's why we chose Duct UI as the
          foundation for our projects.
        </p>

        <h2>Our Values</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg class="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Innovation
            </h3>
            <p class="opacity-70">
              We're always exploring new ways to solve old problems and
              push the boundaries of what's possible on the web.
            </p>
          </div>

          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg class="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Collaboration
            </h3>
            <p class="opacity-70">
              Great products are built by great teams. We foster an environment
              of open communication and shared learning.
            </p>
          </div>

          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg class="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quality
            </h3>
            <p class="opacity-70">
              We're committed to delivering high-quality solutions that
              stand the test of time and scale with our clients' needs.
            </p>
          </div>

          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg class="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Performance
            </h3>
            <p class="opacity-70">
              Every millisecond matters. We optimize for speed, efficiency,
              and user experience in everything we build.
            </p>
          </div>
        </div>

        <h2>Why Duct UI?</h2>
        <p>
          After evaluating dozens of frameworks and libraries, we chose Duct UI
          because it aligns with our core principles:
        </p>

        <ul>
          <li><strong>Explicit over implicit</strong> - Clear, readable code that's easy to understand and maintain</li>
          <li><strong>Performance by design</strong> - Minimal runtime overhead with maximum functionality</li>
          <li><strong>Developer experience</strong> - Tools that help you write better code faster</li>
          <li><strong>Static generation</strong> - Built-in SSG capabilities for optimal SEO and performance</li>
        </ul>

        <p>
          Whether you're building a simple website or a complex web application,
          Duct UI provides the foundation you need to succeed.
        </p>
      </div>
    </div>
  )
}

const id = { id: "starter/about-container" }

const AboutContainer = createBlueprint<AboutContainerProps, {}, {}>(
  id,
  render,
  {}
)

export default AboutContainer