# v0.1.1-alpha.1 (7/23/24)

## Breaking changes

- Renamed useTag 'isMutable' flag to 'arrayMutable'
- Tag type is now declared inside of useTag options
- Appended "Type" to all helper type exports from launched/components

## Bug fixes

- Removed random history entries from demo rich text editors
- Fixed array editor not rendering when starting in preview mode

# v0.1.0-alpha.9 (7/19/24)

## Breaking changes

- Renamed useTag 'isMutable' flag to 'mutable'

## Features

- Improved InlineEditor content sanitization

## Bug fixes

- Removed unnecessary flex container from toolbar

# v0.1.0-alpha.8 (7/15/24)

## Features

- ParentValidator helpers are now exposed globally
- onImageUpload can now return upload URLs to image editors

## Bug fixes

- Toolbar will now start in preview mode if "locked" is toggled in config

# v0.1.0-alpha.7 (7/15/24)

## Features

- Added mutable array functionality
- Added global flag for setting all arrays to mutable by default
- Tag setData now works with callbacks

## Bug fixes

- Made InlineEditor parent font color transparent
- Toolbar buttons are now visually and functionality disabled in preview mode
- Tags with custom array types no longer inherit child typing
