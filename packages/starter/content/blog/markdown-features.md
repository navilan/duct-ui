---
title: "Advanced Markdown Features Demo"
slug: "markdown-features"
date: "2024-01-25"
author: "Duct UI Team"
tags: ["demo", "markdown", "features", "article"]
featured: false
---

This post demonstrates the advanced markdown features available in the Duct Starter Template using our custom markdown parser with essential plugins.

<!--more-->

## Syntax Highlighting {.text-primary}

Code blocks with syntax highlighting powered by Prism.js:

```typescript
interface User {
  id: string
  name: string
  email: string
}

function createUser(data: Partial<User>): User {
  return {
    id: crypto.randomUUID(),
    ...data
  } as User
}

const user = createUser({ 
  name: "John Doe", 
  email: "john@example.com" 
})
```

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Custom Containers

### Information Callout

::: info Quick Tip
You can use custom containers to highlight important information in your blog posts!
:::

### Warning Callout

::: warning Be Careful
This is a warning callout to draw attention to important notes or potential issues.
:::

### Success Callout

::: success Well Done
Great job! You've successfully implemented the advanced markdown features.
:::

### Error Callout

::: error Error
Something went wrong. Check your configuration and try again.
:::

## Header Anchors

All headers automatically get anchor links for easy sharing. Hover over any header to see the permalink icon.

### This Header Has An Anchor {#custom-anchor}

You can also create custom anchors using the attrs plugin.

## Footnotes

Here's some text with a footnote[^1].

You can also use named footnotes[^note].

[^1]: This is the first footnote.
[^note]: This is a named footnote with more detailed information.

## Attributes Plugin

Add CSS classes and attributes to elements:

- This list item has a custom class {.text-accent}
- This one has an ID {#special-item}
- And this one has multiple attributes {.font-bold .text-lg #important}

### Styled Elements

Create a button-like link: [Click Me](https://duct-ui.org){.btn .btn-primary .no-underline}

Or add custom styling: This text is **bold and red** {.text-error .font-black}

## Typography

The typographer option enables smart quotes, dashes, and other typography enhancements:

- "Smart quotes" become curly
- (c) becomes ©
- (tm) becomes ™
- -- becomes –
- --- becomes —
- ... becomes …

## External Links

External links automatically get `target="_blank"` and security attributes:

- [Duct UI Documentation](https://duct-ui.org/docs) - External link
- [Internal Link](/about) - Internal link (no target blank)

## Code Features

Inline code with highlighting: `const message = "Hello World"`{.language-javascript}

Code with line numbers and highlighting:

```javascript{1,3-5}
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log(fibonacci(10)) // 55
```

## Advanced Lists

1. Numbered lists work great
2. With **formatting** and `code`
3. And they can be nested:
   - Sub item one
   - Sub item two {.text-secondary}
   - Sub item three

Task lists:
- [x] Completed task
- [ ] Pending task  
- [x] Another completed task

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Syntax Highlighting | ✅ | Prism.js integration |
| Custom Containers | ✅ | Info, warning, success, error |
| Header Anchors | ✅ | Auto-generated permalinks |
| Footnotes | ✅ | Numbered and named |
| Attributes | ✅ | Classes, IDs, and more |

## Conclusion

This custom markdown parser provides a rich set of features for creating engaging blog content:

1. **Enhanced Code Blocks** - Syntax highlighting for many languages
2. **Visual Callouts** - Custom containers for different types of information  
3. **Better Navigation** - Automatic header anchors
4. **Rich Typography** - Smart quotes and special characters
5. **Flexible Styling** - Attribute support for custom CSS classes
6. **External Link Security** - Automatic `target="_blank"` for external links

With these features, you can create professional, interactive blog posts that engage your readers and provide excellent user experience.

Happy writing! 🚀