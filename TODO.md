## Features

### dx

- [ ] `useLaunched` hook
  - [ ] Unsubscribing from data changes
  - [ ] Automatically inferring tag type from tag name
  - [ ] Move away from context
- [ ] More customizability
  - [ ] "Editing" toggle
  - [ ] `async` initial values
- [ ] Custom tag types
  - [x] Registering custom tag types
  - [ ] Default addon tag types
    - [x] Text
    - [x] Paragraph
    - [ ] Object
    - [ ] Number
    - [ ] Date
    - [ ] Time
  - [ ] Custom tag type validation

### ux

- [ ] Tag rendering
  - [ ] Object view
    - [ ] Nested properties
  - [ ] Primitive components
    - [ ] Text input
    - [ ] Paragraph input
    - [ ] Number input
    - [ ] Date input
    - [ ] Time input

## Bugs

### Inline editor

- [ ] Improper height resizing
- [ ] Whitespace copying

### Object editor

- [x] Popup not closing
- [x] Unwanted root instances
- [ ] Object fields inconsistently updating

Switch to schemaless {...render()}
In the future, add support for data attributes

1. Search for existing react dom in tree
2. If none exist, create new one
3. Portal all children to their respective parents
