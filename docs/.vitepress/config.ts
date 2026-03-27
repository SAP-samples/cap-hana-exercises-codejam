import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { agentmarkup } from '@agentmarkup/vite'

const BASE = '/cap-hana-exercises-codejam/'
const SITE_URL = 'https://SAP-samples.github.io/cap-hana-exercises-codejam'

export default withMermaid(
  defineConfig({
    base: BASE,
    // No srcDir override — VitePress uses docs/ as source root.
    // All wrapper pages in docs/ produce clean URLs:
    //   docs/exercises/ex1/index.md  →  /exercises/ex1/
    //   docs/prerequisites/index.md  →  /prerequisites/
    // Source files outside docs/ are never served directly.
    srcExclude: [
      'superpowers/**',            // spec/plan authoring artifacts — not public pages
    ],

    title: 'CAP + SAP HANA Cloud CodeJam',
    description: 'Hands-on workshop: build full-stack apps with SAP CAP and SAP HANA Cloud',
    lang: 'en-US',
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: true,
    appearance: true,

    markdown: {
      languageAlias: { cds: 'typescript' },
      // Fix: markdown-it wraps loose list items in <p>, but <details> is a
      // block element that cannot be inside <p> (HTML5 content model).
      // Vue's strict SFC parser throws "Element is missing end tag" for this.
      // Patch md.render to post-process the rendered HTML and replace <p> wrappers
      // around <details> with <div>. Two passes cover both the single-paragraph
      // case (<p>text<details>...</details></p>) and the multi-paragraph case
      // where <details> spans multiple markdown paragraphs and the opening <p>
      // never closes before </details>.
      config(md) {
        const originalRender = md.render.bind(md)
        md.render = function (src, env) {
          const html = originalRender(src, env)
          if (!html.includes('<details')) return html
          return html
            // Pass 1: <p> that opens a <details> (text doesn't cross a </p> boundary)
            .replace(/<p>((?:(?!<\/p>).)*<details[\s\S]*?)<\/p>/g, '<div>$1</div>')
            // Pass 2: <p> that closes a </details> opened in an earlier paragraph
            .replace(/<p>((?:(?!<details).)*<\/details>[\s\S]*?)<\/p>/g, '<div>$1</div>')
        }
      },
    },

    // locales is a top-level defineConfig key — NOT inside themeConfig
    locales: {
      root: { label: 'English', lang: 'en-US' },
      // Uncomment to activate a language and create docs/<code>/ directory:
      // de: { label: 'Deutsch',    lang: 'de', link: '/de/' },
      // ja: { label: '日本語',     lang: 'ja', link: '/ja/' },
      // es: { label: 'Español',    lang: 'es', link: '/es/' },
      // pt: { label: 'Português',  lang: 'pt', link: '/pt/' },
      // fr: { label: 'Français',   lang: 'fr', link: '/fr/' },
      // zh: { label: '中文',       lang: 'zh', link: '/zh/' },
    },

    head: [
      ['link', { rel: 'icon', href: `${BASE}favicon.ico` }],
      ['meta', { name: 'theme-color', content: '#0070F2' }],
      ['meta', { name: 'og:type', content: 'website' }],
      ['meta', { name: 'og:site_name', content: 'CAP + SAP HANA Cloud CodeJam' }],
    ],

    themeConfig: {
      logo: '/logo.svg',
      siteTitle: 'CAP + HANA CodeJam',
      outline: { level: [2, 3], label: 'On this page' },

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Prerequisites', link: '/prerequisites/' },
        {
          text: 'Slides',
          items: [
            { text: 'Overview',            link: '/slides/' },
            { text: 'CAP Overview',        link: '/slides/cap' },
            { text: 'HANA Cloud Overview', link: '/slides/hana' },
          ],
        },
        {
          text: 'Exercises',
          items: [
            { text: 'Overview',                    link: '/exercises/' },
            { text: 'Ex 1 — HANA Cloud Setup',    link: '/exercises/ex1/' },
            { text: 'Ex 2 — CAP Project',         link: '/exercises/ex2/' },
            { text: 'Ex 3 — Database Artifacts',  link: '/exercises/ex3/' },
            { text: 'Ex 4 — Fiori UI',            link: '/exercises/ex4/' },
            { text: 'Ex 5 — Authentication',      link: '/exercises/ex5/' },
            { text: 'Ex 6 — Calculation View',    link: '/exercises/ex6/' },
            { text: 'Ex 7 — Stored Procedure',    link: '/exercises/ex7/' },
            { text: 'Ex 8 — MTA Deployment',      link: '/exercises/ex8/' },
          ],
        },
        { text: 'Solution',   link: '/solution/' },
        { text: 'Instructor', link: '/instructor/' },
        { text: 'AI/Agents',  link: '/ai-agents/' },
        {
          text: 'Further Learning',
          items: [
            { text: 'Overview',     link: '/further-learning/' },
            { text: 'HANA CLI',     link: '/further-learning/hana-cli/' },
            { text: 'Resources',    link: '/further-learning/resources' },
            { text: 'Contributing', link: '/further-learning/contributing' },
          ],
        },
      ],

      sidebar: {
        '/slides/': [
          {
            text: 'Slides',
            items: [
              { text: 'Overview',            link: '/slides/' },
              { text: 'CAP Overview',        link: '/slides/cap' },
              { text: 'HANA Cloud Overview', link: '/slides/hana' },
            ],
          },
        ],
        '/exercises/': [
          {
            text: 'Exercises',
            items: [
              { text: 'Learning Path Overview',    link: '/exercises/' },
              { text: 'Ex 1 — HANA Cloud Setup',   link: '/exercises/ex1/' },
              { text: 'Ex 2 — CAP Project',        link: '/exercises/ex2/' },
              { text: 'Ex 3 — Database Artifacts', link: '/exercises/ex3/' },
              { text: 'Ex 4 — Fiori UI',           link: '/exercises/ex4/' },
              { text: 'Ex 5 — Authentication',     link: '/exercises/ex5/' },
              { text: 'Ex 6 — Calculation View',   link: '/exercises/ex6/' },
              { text: 'Ex 7 — Stored Procedure',   link: '/exercises/ex7/' },
              { text: 'Ex 8 — MTA Deployment',     link: '/exercises/ex8/' },
            ],
          },
        ],
        '/further-learning/': [
          {
            text: 'Further Learning',
            items: [{ text: 'Overview', link: '/further-learning/' }],
          },
          {
            text: 'HANA CLI',
            collapsed: false,
            items: [
              { text: 'Quick Start', link: '/further-learning/hana-cli/' },
              { text: 'Examples',    link: '/further-learning/hana-cli/examples' },
              { text: 'Reference',   link: '/further-learning/hana-cli/reference' },
              { text: 'Workflows',   link: '/further-learning/hana-cli/workflows' },
            ],
          },
          {
            text: 'Community',
            items: [
              { text: 'Contributing', link: '/further-learning/contributing' },
              { text: 'Resources',    link: '/further-learning/resources' },
            ],
          },
        ],
      },

      search: { provider: 'local' },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/SAP-samples/cap-hana-exercises-codejam' },
      ],

      footer: {
        message: 'Released under the <a href="https://github.com/SAP-samples/cap-hana-exercises-codejam/blob/main/LICENSE">Apache License 2.0</a>',
        copyright: 'Copyright © 2026 SAP SE | <a href="https://www.sap.com/about/legal/impressum.html">Legal Disclosure</a>',
      },

      // :path resolves relative to srcDir (docs/).
      // docs/exercises/ex1/index.md → :path = 'exercises/ex1/index.md'
      // The 'docs/' prefix completes the correct GitHub file path.
      editLink: {
        pattern: 'https://github.com/SAP-samples/cap-hana-exercises-codejam/edit/main/docs/:path',
        text: 'Edit this page on GitHub',
      },

      lastUpdated: {
        text: 'Last updated',
      },
    },

    vite: {
      build: { chunkSizeWarningLimit: 2000 },
      plugins: [
        agentmarkup({
          site: SITE_URL,
          name: 'CAP + SAP HANA Cloud CodeJam',
          description: 'Hands-on workshop for building full-stack applications with SAP Cloud Application Programming Model (CAP) and SAP HANA Cloud. Eight exercises from environment setup through MTA deployment.',
          globalSchemas: [
            { preset: 'webSite', name: 'CAP + SAP HANA Cloud CodeJam', url: SITE_URL },
            { preset: 'organization', name: 'SAP', url: 'https://www.sap.com' },
          ],
          llmsTxt: {
            sections: [
              {
                title: 'Prerequisites',
                entries: [
                  { title: 'Prerequisites', url: `${SITE_URL}/prerequisites/`,
                    description: 'Environment setup for BAS, local, Dev Container, and Codespaces' },
                ],
              },
              {
                title: 'Exercises',
                entries: [
                  { title: 'Exercise 1 — HANA Cloud Setup',   url: `${SITE_URL}/exercises/ex1/`, description: 'Provision SAP HANA Cloud and configure development environment' },
                  { title: 'Exercise 2 — CAP Project',        url: `${SITE_URL}/exercises/ex2/`, description: 'Scaffold a CAP Node.js project with HANA Cloud target' },
                  { title: 'Exercise 3 — Database Artifacts', url: `${SITE_URL}/exercises/ex3/`, description: 'Define CDS entities and deploy via HDI' },
                  { title: 'Exercise 4 — Fiori UI',           url: `${SITE_URL}/exercises/ex4/`, description: 'Generate SAP Fiori Elements List Report UI' },
                  { title: 'Exercise 5 — Authentication',     url: `${SITE_URL}/exercises/ex5/`, description: 'Add XSUAA OAuth2 and role-based access control' },
                  { title: 'Exercise 6 — Calculation View',   url: `${SITE_URL}/exercises/ex6/`, description: 'Create HANA Calculation View and expose via CAP' },
                  { title: 'Exercise 7 — Stored Procedure',   url: `${SITE_URL}/exercises/ex7/`, description: 'Create HANA stored procedure as CAP service function' },
                  { title: 'Exercise 8 — MTA Deployment',     url: `${SITE_URL}/exercises/ex8/`, description: 'Deploy complete application as Multi-Target Application to CF' },
                ],
              },
              {
                title: 'Reference',
                entries: [
                  { title: 'Solution',   url: `${SITE_URL}/solution/`,   description: 'Complete reference implementation walkthrough' },
                  { title: 'Instructor', url: `${SITE_URL}/instructor/`, description: 'Event setup and teardown procedures' },
                  { title: 'AI/Agents',  url: `${SITE_URL}/ai-agents/`,  description: 'MCP server setup, agent instructions, AI-assisted development' },
                  { title: 'HANA CLI',   url: `${SITE_URL}/further-learning/hana-cli/`, description: 'SAP HANA Developer CLI reference' },
                ],
              },
            ],
          },
          llmsFullTxt: { enabled: true },
        }),
      ],
    },

    // mermaid config goes inside defineConfig — withMermaid reads it via module augmentation
    mermaid: {
      theme: 'default',
      startOnLoad: true,
      securityLevel: 'antiscript',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        nodeSpacing: 50,
        rankSpacing: 60,
        curve: 'basis',
      },
      logLevel: 'error',
    },
  })
)
