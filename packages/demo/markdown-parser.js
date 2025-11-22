import MarkdownIt from 'markdown-it'
import markdownItPrism from 'markdown-it-prism'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItTaskLists from 'markdown-it-task-lists'
import markdownItSub from 'markdown-it-sub'

// Import Prism language components for syntax highlighting
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-jsx.js'
import 'prismjs/components/prism-tsx.js'
import 'prismjs/components/prism-css.js'
import 'prismjs/components/prism-scss.js'
import 'prismjs/components/prism-json.js'
import 'prismjs/components/prism-yaml.js'
import 'prismjs/components/prism-markdown.js'
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-shell-session.js'
import 'prismjs/components/prism-diff.js'

/**
 * Create a configured markdown-it instance with essential plugins
 */
export function createMarkdownParser() {
  const md = new MarkdownIt({
    html: true,        // Enable HTML tags in source
    linkify: true,     // Autoconvert URL-like text to links
    typographer: true, // Enable smart quotes and other typography
    breaks: false,      // Convert '\n' in paragraphs into <br>
  })

  // Add syntax highlighting with Prism
  md.use(markdownItPrism, {
    highlightInlineCode: true,
    init: () => {
      // Prism is already configured with language components above
    }
  })


  // Add attributes support {.class #id key=value}
  md.use(markdownItAttrs, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: ['id', 'class', 'target', 'rel', 'title', 'alt']
  })

  // Add automatic header anchors
  md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.linkInsideHeader({
      symbol: '🔗',
      renderAttrs: (slug, state) => ({ 'aria-label': `Permalink to "${slug}"` }),
    }),
    level: [1, 2, 3, 4, 5, 6],
    slugify: (s) => s
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/--+/g, '-')     // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, '')  // Trim hyphens from start/end
  })

  // Add footnotes support
  md.use(markdownItFootnote)

  // Add subscript support
  md.use(markdownItSub)

  // Add task lists support
  md.use(markdownItTaskLists, {
    enabled: true,  // Enable clickable checkboxes
    label: true     // Wrap task items in <label> elements
  })

  // Add custom renderer for external links
  const defaultLinkOpenRenderer = md.renderer.rules.link_open || function (tokens, idx, options, env, renderer) {
    return renderer.renderToken(tokens, idx, options);
  };



  md.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const href = token.attrGet('href');

    // Add target="_blank" and security attributes to external links
    if (href && (href.startsWith('http://') || href.startsWith('https://')) && !href.includes(env.siteUrl || '')) {
      token.attrSet('target', '_blank');
      token.attrSet('rel', 'noopener noreferrer');
    }

    return defaultLinkOpenRenderer(tokens, idx, options, env, renderer);
  };

  return md;
}

const md = createMarkdownParser();
/**
 * Default markdown parser function for Duct config
 */
export function parseMarkdown(markdown) {
  return md.render(markdown);
}