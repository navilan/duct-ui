import MarkdownIt from 'markdown-it'
import markdownItPrism from 'markdown-it-prism'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItContainer from 'markdown-it-container'
import markdownItFootnote from 'markdown-it-footnote'

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
    breaks: true,      // Convert '\n' in paragraphs into <br>
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

  // Add custom containers for callouts
  md.use(markdownItContainer, 'warning', {
    validate: function(params) {
      return params.trim().match(/^warning\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^warning\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<div class="alert alert-warning my-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            ${m && m[1] ? `<h3 class="font-bold">${md.utils.escapeHtml(m[1])}</h3>` : ''}
            <div class="text-sm">
        `;
      } else {
        // closing tag
        return '</div></div></div>\n';
      }
    }
  })

  md.use(markdownItContainer, 'info', {
    validate: function(params) {
      return params.trim().match(/^info\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^info\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        return `<div class="alert alert-info my-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            ${m && m[1] ? `<h3 class="font-bold">${md.utils.escapeHtml(m[1])}</h3>` : ''}
            <div class="text-sm">
        `;
      } else {
        return '</div></div></div>\n';
      }
    }
  })

  md.use(markdownItContainer, 'success', {
    validate: function(params) {
      return params.trim().match(/^success\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^success\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        return `<div class="alert alert-success my-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            ${m && m[1] ? `<h3 class="font-bold">${md.utils.escapeHtml(m[1])}</h3>` : ''}
            <div class="text-sm">
        `;
      } else {
        return '</div></div></div>\n';
      }
    }
  })

  md.use(markdownItContainer, 'error', {
    validate: function(params) {
      return params.trim().match(/^error\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^error\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        return `<div class="alert alert-error my-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            ${m && m[1] ? `<h3 class="font-bold">${md.utils.escapeHtml(m[1])}</h3>` : ''}
            <div class="text-sm">
        `;
      } else {
        return '</div></div></div>\n';
      }
    }
  })

  // Add custom renderer for external links
  const defaultLinkOpenRenderer = md.renderer.rules.link_open || function(tokens, idx, options, env, renderer) {
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

/**
 * Default markdown parser function for Duct config
 */
export function parseMarkdown(markdown) {
  const md = createMarkdownParser();
  return md.render(markdown);
}