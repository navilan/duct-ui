import { createBlueprint, type BaseProps } from '@duct-ui/core'
import { createRef } from '@duct-ui/core'
import { EventEmitter } from '@duct-ui/core/shared'
import Modal, { ModalLogic } from '@duct-ui/components/layout/modal'
import FormDataModal, { type FormDataModalLogic } from './FormDataModal.js'

interface ContactContainerProps { }

interface ContactContainerEvents extends Record<string, any> { }

interface ContactContainerLogic {
  showModal: (formData: FormData) => void
}

let formDataCache: FormData | null = null

const modalRef = createRef<ModalLogic>()
const formDataRef = createRef<FormDataModalLogic>()

function render(props: BaseProps<ContactContainerProps>) {
  return (
    <div {...props}>
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          Contact Us
        </h1>
        <p class="text-xl opacity-70 max-w-3xl mx-auto">
          Have a question or want to work together? We'd love to hear from you.
          Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div class="bg-base-100 p-6 rounded-lg shadow-sm">
          <form id="contact-form" class="space-y-6">
            <div>
              <label for="name" class="label label-text font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                class="input input-bordered w-full"
                placeholder="Your full name"
                value="John Doe"
                required
              />
            </div>

            <div>
              <label for="email" class="label label-text font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                class="input input-bordered w-full"
                placeholder="your@email.com"
                value="john@example.com"
                required
              />
            </div>

            <div>
              <label for="subject" class="label label-text font-medium">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                class="input input-bordered w-full"
                placeholder="What's this about?"
                value="Interested in Duct UI"
                required
              />
            </div>

            <div>
              <label for="message" class="label label-text font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                class="textarea textarea-bordered w-full"
                placeholder="Tell us more about your project or question..."
                required
              >Hi there! I'm really interested in learning more about Duct UI and how it could help with my next project. The framework looks very promising with its focus on explicit patterns and performance. Could we schedule a brief call to discuss potential use cases?</textarea>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div class="lg:pl-8">
          <div class="space-y-8">
            <div>
              <h2 class="text-2xl font-bold mb-6">
                Other Ways to Reach Us
              </h2>
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold">Email</h3>
                    <p class="opacity-70">hello@example.com</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold">Office</h3>
                    <p class="opacity-70">
                      123 Main Street<br />
                      Suite 100<br />
                      City, State 12345
                    </p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold">Phone</h3>
                    <p class="opacity-70">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-4">
                Business Hours
              </h3>
              <div class="space-y-2 opacity-70">
                <div class="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-4">
                Follow Us
              </h3>
              <div class="flex space-x-4">
                <a href="#" class="text-base-content/40 hover:text-primary transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" class="text-base-content/40 hover:text-primary transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.74.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.99C24.007 5.367 18.641.001 12.017.001z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="text-base-content/40 hover:text-primary transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="text-base-content/40 hover:text-primary transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for form submission summary */}
      <Modal
        ref={modalRef}
        contentClass="bg-base-100 rounded-lg shadow-2xl max-w-lg w-full mx-4"
        on:open={(el) => console.log('Contact modal opened')}
        on:close={(el) => console.log('Contact modal closed')}
      >
        <FormDataModal ref={formDataRef} formData={formDataCache || undefined} />
      </Modal>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<ContactContainerEvents>) {
  const form = el.querySelector('#contact-form') as HTMLFormElement

  function handleFormSubmit(e: Event) {
    e.preventDefault()
    const formData = new FormData(form)
    showModal(formData)
  }

  function showModal(formData: FormData) {
    formDataCache = formData

    // Update the FormDataModal with new data
    if (formDataRef.current?.updateFormData) {
      formDataRef.current.updateFormData(formData)
    }

    modalRef.current?.show()
  }

  if (form) {
    form.addEventListener('submit', handleFormSubmit)
  }

  function release() {
    if (form) {
      form.removeEventListener('submit', handleFormSubmit)
    }
    formDataCache = null
  }

  return {
    showModal,
    release
  }
}

const id = { id: "starter/contact-container" }

const ContactContainer = createBlueprint<ContactContainerProps, ContactContainerEvents, ContactContainerLogic>(
  id,
  render,
  { bind }
)

export default ContactContainer