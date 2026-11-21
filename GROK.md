# GROK.md

Personal site for Anoj Perera (`anojperera.com`). Static Astro 3 blog forked from [AstroPaper](https://github.com/satnaing/astro-paper) v2. Most of the theme docs posts are still in the repo. Site copy, author, and deploy target are customized. Do not treat upstream AstroPaper behavior as something to "restore" unless asked.

## Commands

```bash
npm run dev       # astro dev
npm run build     # astro build → dist/
npm run preview   # serve dist/
npm run lint      # eslint .
npm run format    # prettier --write
npm run deploy    # aws s3 cp dist/ s3://anojperera.com/ --recursive --profile anoj
```

There is no test suite. `npm run format` and lint-staged (Husky) run Prettier on every staged file. Commits use Commitizen (`npm run cz`) and conventional commits.

Node packages are already installed. Do not commit `dist/`, `node_modules/`, `.astro/`, or `.env`.

## Site identity

Two URLs are in use. Change them together when the canonical host changes.

| Source | Value | Used for |
| --- | --- | --- |
| `src/config.js` `SITE` | `https://anojperera.com`, title `AMP`, author Anoj Perera | Page copy, RSS `site` |
| `astro.config.mjs` `site` | `https://astro-paper.pages.dev/` | Canonical URLs and the sitemap |

`SITE.postPerPage` is `3`. `LOGO_IMAGE.enable` is `false`, so the header shows the title text. Active socials are GitHub and LinkedIn. Mail is present and inactive.

`PUBLIC_GOOGLE_SITE_VERIFICATION` in `.env` adds the Google verification meta tag. Leave `.env` alone.

## Routes

| URL | File | What it is |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Splash: "AMP" / "All about me", links to `/map` |
| `/map` | `src/pages/map.astro` | Vector world map. Layers live in `src/data/mapLayers.js`: early human migration, and modern origin-to-destination corridors. |
| `/Home` | `src/pages/Home.astro` | Blog home: intro, socials, post index |
| `/posts` | `src/pages/posts/index.astro` | Page 1 of the post list |
| `/posts/:slug` | `src/pages/posts/[slug].astro` | A post **or** a later list page (`/posts/2`, `/posts/3`, …) |
| `/posts/:slug` post body | `src/layouts/PostDetails.astro` | Rendered markdown |
| `/tags`, `/tags/:tag` | `src/pages/tags/` | Tag index and tag pages |
| `/search` | `src/pages/search.astro` + `Search.jsx` | Fuse.js search (client island) |
| `/about` | `src/pages/about.md` | About page, `AboutLayout.astro` |
| `/rss.xml` | `src/pages/rss.xml.js` | RSS |
| `/:title.svg` | `src/pages/[ogTitle].svg.js` | Generated OG image when a post has no `ogImage` |

`posts/[slug].astro` `getStaticPaths` emits both post slugs and numeric page numbers. A post whose slug is only digits collides with pagination. Keep `postSlug` non-numeric.

Drafts (`draft: true`) are dropped in `getSortedPosts`, search, tags, RSS, post paths, and OG generation. They never appear in the build.

## Content

Posts are Markdown in `src/content/blog/`. The collection schema is `blogSchema` in `src/content/_schemas.js` and it is `.strict()`.

Required frontmatter: `title`, `description`, `pubDatetime` (ISO date). Optional: `author`, `postSlug`, `featured`, `draft`, `tags` (default `["others"]`), `ogImage`.

Slug is `slugify(postSlug)` when set, otherwise `slugify(title)` (`src/utils/slugify.js`, `github-slugger`). Links must use that slug, not the filename.

A heading whose text is exactly `Table of contents` is turned into a collapsible TOC (`remark-toc` + `remark-collapse` in `astro.config.mjs`). Code fences use Shiki `one-dark-pro`.

Many files under `src/content/blog/` are still Sat Naing's AstroPaper theme articles. Leave them unless the task is to edit or remove a specific post.

## Layout and UI

- Path alias `@*` → `src/*` (`@config`, `@layouts`, `@components`, `@utils`, `@content`).
- Shell: `Layout.astro` (head, theme boot script) → `Header` + `Main` or post body + `Footer`.
- React islands: `Card`, `Datetime`, `Search`. Everything else is `.astro`. New UI should be Astro unless it needs client state.
- Theme tokens live in `src/styles/base.css` as `--color-*` RGB triplets on `html[data-theme="light"|"dark"]`. Use `text-skin-*`, `bg-skin-*`, `border-skin-*`, `fill-skin-*`. Do not hard-code palette colors in components.
- `tailwind.config.cjs` replaces `theme.screens` with only `sm: 640px`. `md`, `lg`, and `xl` do not exist. Do not add them back as a drive-by.
- `public/toggle-theme.js` sets `data-theme` before paint. `lightAndDarkMode` in `SITE` gates the toggle.
- Typography plugin styles are under `@layer base` `.prose` in `base.css`.

## OG images

`PostDetails` uses `ogImage` when set. Otherwise it points at `/${title}.svg`, built by `generateOgImage.jsx` (Satori). That module fetches IBM Plex Mono from 1001fonts.com at build time, so `npm run build` needs network. Twitter cards fall back to `astropaper-og.jpg` when the image URL ends in `.svg`.

## Deploy

The path that ships the site is `npm run build` then `npm run deploy` (S3 bucket `anojperera.com`, AWS profile `anoj`). Do not run deploy unless asked.

`main.tf` and `variables.tf` are an unfinished S3/CloudFront sketch copied from `src/content/blog/deploy-astro-to-aws.md`. They reference `policy.json`, `local.s3_origin_id`, and an origin access control that are not in the repo. They are not the live pipeline.

## Style

Prettier (`.prettierrc`): 2 spaces, width 80, double quotes, semicolons, trailing commas `es5`, `arrowParens: avoid`, LF. Match surrounding Astro/TS. ESLint is `eslint:recommended` plus `plugin:astro/recommended`.

## When changing the site

- Verify UI changes in the browser (`npm run dev`) on the route you touched and on any route that shares the layout or post data (`/`, `/Home`, `/posts`, a post, `/tags`, `/search`).
- Keep splash (`/`) and blog home (`/Home`) distinct.
- Filter new post queries with the same `!data.draft` rule the existing pages use.
- Do not widen Tailwind breakpoints, retarget the canonical URL, or delete theme-demo posts unless that is the task.
