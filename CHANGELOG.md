# Changelog

## V2.2.0

### Changes

- Added support for Support for @dtdot/lego v2

## v2.1.0

### Changes

- Updated `UnguardedRoute` to only check and redirect based on auth status for initial load. This allows login and registration pages to handle their own redirect

## v2.0.0

### Breaking Changes

- Updated `GuardedRoute` to render a component for unauthorized access rather than calling a function
- Updated `UnguardedRoute` to render a component for authorized access with strict mode enabled rather than calling a function

## v1.0.2

### Fixed 

- Loosened some peer dependencies

## v1.0.1

### Fixed 

- Loosened some peer dependencies

## v1.0.0

### Added 

- Initial release