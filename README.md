<h1 align="center">
  <img width="24" height="24" src="./demo/public/favicon.svg" />
  Launched
</h1>
<p align="center">
  <a title="Download" href="https://quilljs.com/docs/quickstart"><strong>Download</strong></a>
  &#x2022;
  <a title="Documentation" href="https://quilljs.com/docs/quickstart"><strong>Documentation</strong></a>
  &#x2022;
  <a title="Contributing" href="https://github.com/slab/quill/blob/main/.github/CONTRIBUTING.md"><strong>Contributing</strong></a>
  &#x2022;
  <a title="Interactive Demo" href="https://quilljs.com/playground/"><strong>Interactive Demo</strong></a>
</p>
<p align="center">
  <a href="https://github.com/slab/quill/actions" title="Build Status"><img src="https://github.com/slab/quill/actions/workflows/main.yml/badge.svg" alt="Build Status"></a>
  <a href="https://npmjs.com/package/quill" title="Version"><img src="https://img.shields.io/npm/v/quill.svg" alt="Version"></a>
  <a href="https://npmjs.com/package/quill" title="Downloads"><img src="https://img.shields.io/npm/dm/quill.svg" alt="Downloads"></a>
</p>

<hr/>

<a href="https://launched.tech">Launched</a> is a tool to make website content editable to clients with no codebase access or coding knowledge required. It was created by [Michael Beck](https://linkedin.com/in/michaelbeck0) for the [Launch](https://launchsite.tech) platform.

To get started, check out [https://launched.tech](https://launched.tech) for documentation, guides, and demos.

> [!NOTE]
> Your site needs to be made with react for Launched to work. Learn react [here](https://react.dev).

## How it works

Launched uses a system of tagging to bind elements to their data. Once an element is "tagged", it will be editable by clients.

To define editable content, you must first specify a site schema. A site schema defines elements' names, types, and initial values like so:

```ts
const siteSchema = {
  // Implicit "text" type
  "Main heading": "This is my website."
  // Explicit "image" type
  "Hero image": {
    type: "image",
    value: "https://example.com/image.png"
  }
}
```

For more information on site schemas, check out the guide [here](https://launched.tech/docs/schema).

## Download

```shell
npm install launched
```

### CDN

```html
<!-- Include the Launched library -->
<script src="https://cdn.jsdelivr.net/npm/launched/dist/index.js"></script>
```

## Getting started

Check out [https://launched.tech](https://launched.tech) for full guides.

```jsx
// src/index.jsx

/* Import the Launched provider */
import { LaunchedProvider } from "launched";

/* Define a site schema */
const schema = {
  "title": "Demo site",
  "description": "Here's a neat little demo for the Launched library."
}

const config = {
  tags: schema
}

...

/* Add the provider to your app */
root.render(
  <LaunchedProvider config={config}>
    <App />
  </LaunchedProvider>
);
```

```jsx
// src/app.jsx

/* Import the useTag hook */
import { useTag } from "launched";

...

export default function App() {
  /* Access tag data defined in the site schema */
  const [title, titleTag] = useTag("title");
  const [description, descriptionTag] = useTag("description");

  /* Bind tag data to elements */
  return (
    <div>
      <h1 ref={titleTag}>{title}</h1>
      <p ref={descriptionTag}>{description}</p>
    </div>
  )
}
```

## Community

Get help or stay up to date.

- [Contribute](/CONTRIBUTING.md) on [issues](https://github.com/MMMJB/launched/issues)
- Ask questions on [discussions](https://github.com/MMMJB/launched/discussions)

## License

ISC
