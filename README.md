<h1 align="center">
  <img width="24" height="24" src="./demo/public/favicon.svg" />
  <a href="https://launched.tech">Launched</a>
  <p align="center">
    <a href="https://npmjs.com/package/launched" title="Package Size"><img src="https://img.shields.io/bundlephobia/minzip/launched" alt="Package Size"></a>
    <a href="https://npmjs.com/package/launched" title="Version"><img src="https://img.shields.io/npm/v/launched.svg" alt="Version"/a>
    <a href="https://npmjs.com/package/launched" title="Downloads"><img src="https://img.shields.io/npm/dm/launched.svg" alt="Downloads"></a>
  </p> 
</h1>

Launched is a tool to make website content editable to clients with no codebase access or coding knowledge required. It was created by [Michael Beck](https://linkedin.com/in/michaelbeck0) for the [Launch](https://launchsite.tech) platform.

To get started, check out [https://launched.tech](https://launched.tech) for documentation, guides, and demos.

> [!NOTE]
> Launched is still in development. Be careful when using it in production.

## Download

```shell
npm install launched
```

### CDN

```html
<!-- Include the Launched library -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/launched@latest/dist/bundle.js"
></script>

<!-- Include necessary dependencies -->
<script
  crossorigin
  src="https://cdn.jsdelivr.net/combine/npm/react@18.3.1/umd/react.production.min.js,npm/react-dom@18.3.1/umd/react-dom.production.min.js"
></script>
<script
  crossorigin
  src="https://update.greasyfork.org/scripts/499179/1402245/react_jsx-runtime-umd.js"
></script>

<!-- Include stylesheets -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/launched@latest/dist/ui/globals.css"
/>
```

## Getting started

### React

```jsx
// src/index.jsx

/* Import the Launched provider */
import { LaunchedProvider } from "launched";

...

/* Add the provider to your app */
root.render(
  <LaunchedProvider>
    <App />
  </LaunchedProvider>
);
```

```jsx
// src/app.jsx

/* Import the Launched Text element */
import { Text } from "launched/components";

...

export default function App() {
  return (
    <div>
      <Text tag="title" element="h1">Hello, world!</Text>
      <Text tag="description">Welcome to my site.</Text>
    </div>
  )
}
```

### Static HTML

```html
<!-- index.html -->

<!-- Initialize Launched -->
<script type="module" defer>
  const { Launched } = launched;

  const l = new Launched({
    mode: "static",
    save: (data) => console.log(data),
    determineVisibility: () => true,
  });
</script>

...

<body>
  <h1 data-tag="title">Hello world!</h1>
</body>
```

<!--
## Community

Get help or stay up to date.

- [Contribute](/CONTRIBUTING.md) on [issues](https://github.com/launchsite-tech/launched/issues)
- Ask questions on [discussions](https://github.com/launchsite-tech/launched/discussions)
-->

## License

ISC
