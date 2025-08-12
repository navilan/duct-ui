import { createBlueprint, type BaseProps } from '@duct-ui/core'

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

function render(props: BaseProps<FormDataModalProps>) {
  const {
    formData,
    title = 'Message Summary',
    subtitle = 'Thank you for your message! Here\'s what you submitted:',
    ...moreProps
  } = props

  const contact = transformFormData(formData)

  if (!formData) {
    return (
      <div class="p-6" {...moreProps}>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-primary-600">{title}</h3>
          <button
            class="btn btn-sm btn-circle btn-ghost"
            data-modal-close
          >
            ✕
          </button>
        </div>
        <p class="text-gray-600 mb-4">No form data available.</p>
        <div class="flex justify-end mt-6">
          <button class="btn btn-primary" data-modal-close>
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div class="p-6 max-w-lg">
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
        <p class="text-gray-600 mb-4">{subtitle}</p>

        <div class="bg-gray-50 p-4 rounded-lg space-y-3">
          {/* Primary contact info */}
          <div>
            <span class="font-medium text-gray-900">Name:</span>
            <span class="ml-2 text-gray-700">{contact.name}</span>
          </div>

          <div>
            <span class="font-medium text-gray-900">Email:</span>
            {contact.email && contact.email !== 'No email provided' ? (
              <a
                href={`mailto:${contact.email}`}
                class="ml-2 text-primary-600 hover:text-primary-700 underline"
              >
                {contact.email}
              </a>
            ) : (
              <span class="ml-2 text-gray-700">{contact.email}</span>
            )}
          </div>

          {contact.phone && (
            <div>
              <span class="font-medium text-gray-900">Phone:</span>
              {contact.phone !== 'Not provided' ? (
                <a
                  href={`tel:${contact.phone}`}
                  class="ml-2 text-primary-600 hover:text-primary-700 underline"
                >
                  {contact.phone}
                </a>
              ) : (
                <span class="ml-2 text-gray-700">{contact.phone}</span>
              )}
            </div>
          )}

          {contact.company && (
            <div>
              <span class="font-medium text-gray-900">Company:</span>
              <span class="ml-2 text-gray-700">{contact.company}</span>
            </div>
          )}

          <div>
            <span class="font-medium text-gray-900">Subject:</span>
            <span class="ml-2 text-gray-700">{contact.subject}</span>
          </div>

          <div>
            <span class="font-medium text-gray-900">Message:</span>
            <div class="mt-1 p-3 bg-white rounded border text-gray-700 italic">
              {contact.message}
            </div>
          </div>

          {contact.website && (
            <div>
              <span class="font-medium text-gray-900">Website:</span>
              {contact.website !== 'Not provided' ? (
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ml-2 text-primary-600 hover:text-primary-700 underline"
                >
                  {contact.website}
                </a>
              ) : (
                <span class="ml-2 text-gray-700">{contact.website}</span>
              )}
            </div>
          )}

          {/* Render any additional fields */}
          {Object.keys(contact).filter(key =>
            !['name', 'email', 'phone', 'company', 'subject', 'message', 'website'].includes(key)
          ).map(key => (
            <div data-key={key}>
              <span class="font-medium text-gray-900">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <span class="ml-2 text-gray-700">{contact[key]}</span>
            </div>
          ))}
        </div>

        <p class="text-sm text-gray-500 mt-4">
          We'll get back to you as soon as possible!
        </p>
      </div>

      <div class="flex justify-end gap-2">
        <button class="btn btn-primary" data-modal-close>
          Close
        </button>
      </div>
    </div>
  )
}

const id = { id: "starter/form-data-modal" }

const FormDataModal = createBlueprint(
  id,
  render,
  {}
)

export default FormDataModal