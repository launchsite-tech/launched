<h1 align="center">
  <img width="24" height="24" src="./demo/public/favicon.svg" />
  Launched
</h1>
<!-- <p align="center">
  <a title="Download" href="https://quilljs.com/docs/quickstart"><strong>Download</strong></a>
  &#x2022;
  <a title="Documentation" href="https://quilljs.com/docs/quickstart"><strong>Documentation</strong></a>
  &#x2022;
  <a title="Contributing" href="https://github.com/slab/quill/blob/main/.github/CONTRIBUTING.md"><strong>Contributing</strong></a>
  &#x2022;
  <a title="Interactive Demo" href="https://quilljs.com/playground/"><strong>Interactive Demo</strong></a>
</p>
<p align="center">
  <a href="https://npmjs.com/package/quill" title="Package Size"><img src="https://img.shields.io/bundlephobia/minzip/quill" alt="Package Size"></a>
  <a href="https://npmjs.com/package/quill" title="Version"><img src="https://img.shields.io/npm/v/quill.svg" alt="Version"></a>
  <a href="https://npmjs.com/package/quill" title="Downloads"><img src="https://img.shields.io/npm/dm/quill.svg" alt="Downloads"></a>
</p> 
<hr/>
-->

Launched is a tool to make website content editable to clients with no codebase access or coding knowledge required. It was created by [Michael Beck](https://linkedin.com/in/michaelbeck0) for the [Launch](https://launchsite.tech) platform.

To get started, check out [https://launched.tech](https://launched.tech) for documentation, guides, and demos.

> [!NOTE]
> Your site needs to be made with react for Launched to work. Learn react [here](https://react.dev).

> [!NOTE]
> Launched is still in development. It will be released on npm within the next few weeks.

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

```jsx
// src/index.jsx

/* Import the Launched provider */
import { LaunchedProvider } from "launched";

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
  /* Define and retrieve references to tags */
  const [title, titleTag] = useTag("title", "Hello, world!");
  const [description, descriptionTag] = useTag("description", "Welcome to my site.");

  /* Bind tag data to elements */
  return (
    <div>
      <h1 ref={titleTag}>{title}</h1>
      <p ref={descriptionTag}>{description}</p>
    </div>
  )
}
```

<!--
## Community

Get help or stay up to date.

- [Contribute](/CONTRIBUTING.md) on [issues](https://github.com/launchsite-tech/launched/issues)
- Ask questions on [discussions](https://github.com/launchsite-tech/launched/discussions)
-->

## License

ISC
