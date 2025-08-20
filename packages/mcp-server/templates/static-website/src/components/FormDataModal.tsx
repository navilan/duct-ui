import { createBlueprint, type BaseProps } from '@duct-ui/core'
import type { BindReturn } from '@duct-ui/core/blueprint'

interface Contact {
  name?: string
  email?: string
  phone?: string
  company?: string
  subject?: string
  message?: string
  website?: string
  [key: string]: string | undefined // Allow additional fields
}

export interface FormDataModalLogic {
  updateFormData: (formData: FormData) => void
}

interface FormDataModalProps {
  formData?: FormData
  title?: string
  subtitle?: string
}

function transformFormData(formData?: FormData): Contact {
  if (!formData) {
    return {}
  }

  const contact: Contact = {}

  for (const [key, value] of formData.entries()) {
    const stringValue = value.toString().trim()

    // Map common field names to contact properties
    const normalizedKey = key.toLowerCase()

    if (normalizedKey === 'name' || normalizedKey === 'fullname' || normalizedKey === 'full_name') {
      contact.name = stringValue || 'Not provided'
    } else if (normalizedKey === 'email' || normalizedKey === 'email_address') {
      contact.email = stringValue || 'Not provided'
    } else if (normalizedKey === 'phone' || normalizedKey === 'tel' || normalizedKey === 'telephone') {
      contact.phone = stringValue || 'Not provided'
    } else if (normalizedKey === 'company' || normalizedKey === 'organization') {
      contact.company = stringValue || 'Not provided'
    } else if (normalizedKey === 'subject' || normalizedKey === 'topic') {
      contact.subject = stringValue || 'Not provided'
    } else if (normalizedKey === 'message' || normalizedKey === 'comment' || normalizedKey === 'details') {
      contact.message = stringValue || 'Not provided'
    } else if (normalizedKey === 'website' || normalizedKey === 'url' || normalizedKey === 'site') {
      contact.website = stringValue || 'Not provided'
    } else {
      // Store any additional fields
      contact[key] = stringValue
    }
  }

  // Apply reasonable defaults for missing fields
  contact.name = contact.name || 'Anonymous'
  contact.email = contact.email || 'No email provided'
  contact.subject = contact.subject || 'General Inquiry'
  contact.message = contact.message || 'No message provided'

  return contact
}

let currentFormData: FormData | undefined

function render(props: BaseProps<FormDataModalProps>) {
  // Store initial form data
  currentFormData = props.formData
  const {
    formData,
    title = 'Message Summary',
    subtitle = 'Thank you for your message! Here\'s what you submitted:',
    ...moreProps
  } = props

  const contact = transformFormData(formData)
  const hasData = !!formData

  return (
    <div class="p-6 max-w-lg" {...moreProps}>
      {/* Empty state */}
      <div class={`empty-state ${hasData ? 'hidden' : ''}`} data-state="empty">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{title}</h3>
          <button
            class="btn btn-sm btn-circle btn-ghost"
            data-modal-close
          >
            ✕
          </button>
        </div>
        <p class="opacity-70 mb-4">No form data available.</p>
        <div class="flex justify-end mt-6">
          <button class="btn btn-primary" data-modal-close>
            Close
          </button>
        </div>
      </div>

      {/* Data state */}
      <div class={`data-state ${!hasData ? 'hidden' : ''}`} data-state="data">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-primary-600">{title}</h3>
          <button
            class="btn btn-sm btn-circle btn-ghost"
            data-modal-close
          >
            ✕
          </button>
        </div>

        <div class="mb-6">
          <p class="opacity-70 mb-4">{subtitle}</p>

          <div class="bg-base-200 p-4 rounded-lg space-y-3">
            {/* Primary contact info */}
            <div>
              <span class="font-medium">Name:</span>
              <span class="ml-2 opacity-70" data-field="name">{contact.name}</span>
            </div>

            <div data-field="email">
              <span class="font-medium">Email:</span>
              <a
                href={`mailto:${contact.email}`}
                class={`ml-2 text-primary hover:text-primary/70 underline ${(!contact.email || contact.email === 'No email provided') ? 'hidden' : ''}`}
                data-email-link
              >
                {contact.email}
              </a>
              <span class={`ml-2 opacity-70 ${(contact.email && contact.email !== 'No email provided') ? 'hidden' : ''}`} data-email-text>
                {contact.email || 'No email provided'}
              </span>
            </div>

            {contact.phone && (
              <div>
                <span class="font-medium">Phone:</span>
                {contact.phone !== 'Not provided' ? (
                  <a
                    href={`tel:${contact.phone}`}
                    class="ml-2 text-primary hover:text-primary/70 underline"
                  >
                    {contact.phone}
                  </a>
                ) : (
                  <span class="ml-2 opacity-70">{contact.phone}</span>
                )}
              </div>
            )}

            {contact.company && (
              <div>
                <span class="font-medium">Company:</span>
                <span class="ml-2 opacity-70">{contact.company}</span>
              </div>
            )}

            <div>
              <span class="font-medium">Subject:</span>
              <span class="ml-2 opacity-70" data-field="subject">{contact.subject}</span>
            </div>

            <div>
              <span class="font-medium">Message:</span>
              <div class="mt-1 p-3 bg-base-100 rounded border opacity-70 italic" data-field="message">
                {contact.message}
              </div>
            </div>

            {contact.website && (
              <div>
                <span class="font-medium">Website:</span>
                {contact.website !== 'Not provided' ? (
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-2 text-primary hover:text-primary/70 underline"
                  >
                    {contact.website}
                  </a>
                ) : (
                  <span class="ml-2 opacity-70">{contact.website}</span>
                )}
              </div>
            )}

            {/* Render any additional fields */}
            {Object.keys(contact).filter(key =>
              !['name', 'email', 'phone', 'company', 'subject', 'message', 'website'].includes(key)
            ).map(key => (
              <div data-key={key}>
                <span class="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span class="ml-2 opacity-70">{contact[key]}</span>
              </div>
            ))}
          </div>

          <p class="text-sm opacity-60 mt-4">
            We'll get back to you as soon as possible!
          </p>
        </div>

        <div class="flex justify-end gap-2">
          <button class="btn btn-primary" data-modal-close>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: any): BindReturn<FormDataModalLogic> {
  function updateFormData(formData: FormData) {
    currentFormData = formData

    // Toggle between empty and data states
    const emptyState = el.querySelector('[data-state="empty"]')
    const dataState = el.querySelector('[data-state="data"]')

    const hasData = formData && Array.from(formData.entries()).length > 0

    if (hasData) {
      // Show data state, hide empty state
      emptyState?.classList.add('hidden')
      dataState?.classList.remove('hidden')

      // Update the displayed data in the modal
      const contact = transformFormData(formData)

      const nameSpan = el.querySelector('[data-field="name"]')
      const emailLink = el.querySelector('[data-email-link]') as HTMLAnchorElement
      const emailText = el.querySelector('[data-email-text]')
      const subjectSpan = el.querySelector('[data-field="subject"]')
      const messageDiv = el.querySelector('[data-field="message"]')

      if (nameSpan) nameSpan.textContent = contact.name || 'Anonymous'

      // Handle email field - show link or text based on validity
      if (contact.email && contact.email !== 'No email provided') {
        // Show email link, hide text
        if (emailLink) {
          emailLink.href = `mailto:${contact.email}`
          emailLink.textContent = contact.email
          emailLink.classList.remove('hidden')
        }
        if (emailText) {
          emailText.classList.add('hidden')
        }
      } else {
        // Show email text, hide link
        if (emailLink) {
          emailLink.classList.add('hidden')
        }
        if (emailText) {
          emailText.textContent = contact.email || 'No email provided'
          emailText.classList.remove('hidden')
        }
      }

      if (subjectSpan) subjectSpan.textContent = contact.subject || 'General Inquiry'
      if (messageDiv) messageDiv.textContent = contact.message || 'No message provided'
    } else {
      // Show empty state, hide data state
      emptyState?.classList.remove('hidden')
      dataState?.classList.add('hidden')
    }
  }

  return {
    updateFormData,
    release: () => { }
  }
}

const id = { id: "starter/form-data-modal" }

const FormDataModal = createBlueprint<FormDataModalProps, {}, FormDataModalLogic>(
  id,
  render,
  { bind }
)

export default FormDataModal