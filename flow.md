1. Define site schema
   - Determine keys
   - Set all defaults

```ts
defineSchema({
  title: "",
  ...
}): Record<string, {data: T, setData: Dispatch<SetStateAction<T>>, ref: RefObject<HTMLElement>}>

// returns
{
  title: {data: “”, setData: (prev: T) => {}, ref: {current: null}},
  ...
}
```

2. Register react element

```ts
/*
@param {string} key - The unique identifier of the schema-defined element
@param {T?} initialValue - The element’s initially rendered value; overrides schema
@returns {[T, RefObject<HTMLElement>]} - A touple with the data state and an element
  ref (?) to be forwarded for rendering
*/

const [data, tag] = useRegister(“title”, “Loading...”);
...
return <h1 ref={tag}>{data}</h1>
```

3. Render

- Loop through schema and collect all refs
- Create roots at each ref
- Render helper elements using collected states and internal setters
