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
> Your site needs to be made with react for Launched to work. Learn react [here](https://react.dev).

> [!NOTE]
> Launched is still in development. Be careful when using it in production.

## Download

```shell
npm install launched
```

### CDN

```html
<!-- Include the Launched library -->
<script type="module" src="https://cdn.jsdelivr.net/npm/launched/dist/bundle.js"></script>

<!-- Include React and ReactDOM dependencies -->
<script crossorigin src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script>
<script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js"></script>
```

## Getting started

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

<!--
## Community

Get help or stay up to date.

- [Contribute](/CONTRIBUTING.md) on [issues](https://github.com/launchsite-tech/launched/issues)
- Ask questions on [discussions](https://github.com/launchsite-tech/launched/discussions)
-->

## License

ISC
