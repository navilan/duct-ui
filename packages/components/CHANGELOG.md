# @duct-ui/components

## 0.6.2

### Patch Changes

- [#44](https://github.com/navilan/duct-ui/pull/44) [`a6f84d1`](https://github.com/navilan/duct-ui/commit/a6f84d128f7d77454e45206abbcd51cfc3ce7bf8) Thanks [@navilan](https://github.com/navilan)! - Add markdown component and update documentation

- Updated dependencies [[`a6f84d1`](https://github.com/navilan/duct-ui/commit/a6f84d128f7d77454e45206abbcd51cfc3ce7bf8)]:
  - @duct-ui/core@0.6.2

## 0.6.1

### Patch Changes

- [#41](https://github.com/navilan/duct-ui/pull/41) [`e54e4e9`](https://github.com/navilan/duct-ui/commit/e54e4e9735d0429fcd2d12a772ea45ad488dcb2d) Thanks [@navilan](https://github.com/navilan)! - Add app container and component reanimation

  - Generate a simple container script during generation
  - Remove main.tsx and html files from demo. Everything is generated.
  - Simplify vite config
  - Streamline demo styles
  - Fix demo ux
  - Remove cloudflare functions

- Updated dependencies [[`e54e4e9`](https://github.com/navilan/duct-ui/commit/e54e4e9735d0429fcd2d12a772ea45ad488dcb2d)]:
  - @duct-ui/core@0.6.1

## 0.6.0

### Minor Changes

- [#39](https://github.com/navilan/duct-ui/pull/39) [`4c2ce1d`](https://github.com/navilan/duct-ui/commit/4c2ce1dc421a3aa5d5f8c4e6767f5c86a23619a7) Thanks [@navilan](https://github.com/navilan)! - Add experimental static website generation

  - Generate static website based on file system routes
  - Define interfaces for pages and dyanmic pages
  - Generate sub routes based on function return values
  - Add vite plugin to have all the vite dev server goodnesses
  - Reorganize demos website

### Patch Changes

- Updated dependencies [[`4c2ce1d`](https://github.com/navilan/duct-ui/commit/4c2ce1dc421a3aa5d5f8c4e6767f5c86a23619a7)]:
  - @duct-ui/core@0.6.0

## 0.5.1

### Patch Changes

- [#33](https://github.com/navilan/duct-ui/pull/33) [`bd1f7fc`](https://github.com/navilan/duct-ui/commit/bd1f7fcb77069a507c0948c1874b7c7a4900bd2b) Thanks [@navilan](https://github.com/navilan)! - Ensure ref is not rendered.

  - Add landing page for duct website
  - Minor clean up in blueprint

- Updated dependencies [[`bd1f7fc`](https://github.com/navilan/duct-ui/commit/bd1f7fcb77069a507c0948c1874b7c7a4900bd2b)]:
  - @duct-ui/core@0.5.1

## 0.5.0

### Minor Changes

- Remove factory method pattern for component instantiation

  - Ensure that you can use the imported default component directly
  - Remove getLogic in favor of refs
  - Update all demos & documentation
  - Use regular urls for demo navigation

### Patch Changes

- Updated dependencies []:
  - @duct-ui/core@0.5.0

## 0.4.1

### Patch Changes

- [#28](https://github.com/navilan/duct-ui/pull/28) [`acd8617`](https://github.com/navilan/duct-ui/commit/acd8617930d2b948a6bffdc3eb78d05f863193b1) Thanks [@navilan](https://github.com/navilan)! - Update dependencies and documentation.

- Updated dependencies [[`acd8617`](https://github.com/navilan/duct-ui/commit/acd8617930d2b948a6bffdc3eb78d05f863193b1)]:
  - @duct-ui/core@0.4.1

## 0.4.0

### Minor Changes

- Add ref as the primary way to bind to component's logic.

### Patch Changes

- Updated dependencies []:
  - @duct-ui/core@0.4.0

## 0.3.0

### Minor Changes

- [#24](https://github.com/navilan/duct-ui/pull/24) [`6ec6a89`](https://github.com/navilan/duct-ui/commit/6ec6a893a91c95a54668380f2056c15ea8e50820) Thanks [@navilan](https://github.com/navilan)! - Add async toggle component and reorganize imports

### Patch Changes

- Updated dependencies [[`6ec6a89`](https://github.com/navilan/duct-ui/commit/6ec6a893a91c95a54668380f2056c15ea8e50820)]:
  - @duct-ui/core@0.3.0

## 0.2.0

### Minor Changes

- [#18](https://github.com/navilan/duct-ui/pull/18) [`978fa26`](https://github.com/navilan/duct-ui/commit/978fa268121d85fa740b2eb46ee97b03e95f83f3) Thanks [@navilan](https://github.com/navilan)! - Add sidebar nav and add documentation

### Patch Changes

- Updated dependencies [[`978fa26`](https://github.com/navilan/duct-ui/commit/978fa268121d85fa740b2eb46ee97b03e95f83f3)]:
  - @duct-ui/core@0.2.0

## 0.1.7

### Patch Changes

- [#16](https://github.com/navilan/duct-ui/pull/16) [`aa34ea5`](https://github.com/navilan/duct-ui/commit/aa34ea5b48e2dee55944ec2ce77950b2b04c9d30) Thanks [@navilan](https://github.com/navilan)! - \* Add tab component
  - Add modal component
  - Add asynchronous load hook that gets called between refresh and bind
  - Allow asynchronous getItems property in list component
- Updated dependencies [[`aa34ea5`](https://github.com/navilan/duct-ui/commit/aa34ea5b48e2dee55944ec2ce77950b2b04c9d30)]:
  - @duct-ui/core@0.1.7

## 0.1.6

### Patch Changes

- [#14](https://github.com/navilan/duct-ui/pull/14) [`a79afd3`](https://github.com/navilan/duct-ui/commit/a79afd37abcd16949e2c2e72062c333f674a89ba) Thanks [@navilan](https://github.com/navilan)! - Add toggle button and list component

- Updated dependencies [[`a79afd3`](https://github.com/navilan/duct-ui/commit/a79afd37abcd16949e2c2e72062c333f674a89ba)]:
  - @duct-ui/core@0.1.6

## 0.1.5

### Patch Changes

- [#12](https://github.com/navilan/duct-ui/pull/12) [`4e93cd0`](https://github.com/navilan/duct-ui/commit/4e93cd035ff43f2899deeec811c332bb169e4782) Thanks [@navilan](https://github.com/navilan)! - Fix event binding issues and upgrade demo components

- Updated dependencies [[`4e93cd0`](https://github.com/navilan/duct-ui/commit/4e93cd035ff43f2899deeec811c332bb169e4782)]:
  - @duct-ui/core@0.1.5

## 0.1.4

### Patch Changes

- [#8](https://github.com/navilan/duct-ui/pull/8) [`4baff5e`](https://github.com/navilan/duct-ui/commit/4baff5e9a7608157c1c2f295505516faa4a58c58) Thanks [@navilan](https://github.com/navilan)! - More hygienic cleanup of bound event handlers

- Updated dependencies [[`4baff5e`](https://github.com/navilan/duct-ui/commit/4baff5e9a7608157c1c2f295505516faa4a58c58)]:
  - @duct-ui/core@0.1.4

## 0.1.3

### Patch Changes

- [#6](https://github.com/navilan/duct-ui/pull/6) [`c2a8a22`](https://github.com/navilan/duct-ui/commit/c2a8a22c09548db4d3b7f725f823a54069478071) Thanks [@navilan](https://github.com/navilan)! - Add drawer component

- Updated dependencies [[`c2a8a22`](https://github.com/navilan/duct-ui/commit/c2a8a22c09548db4d3b7f725f823a54069478071)]:
  - @duct-ui/core@0.1.3

## 0.1.2

### Patch Changes

- [#4](https://github.com/navilan/duct-ui/pull/4) [`02bbba9`](https://github.com/navilan/duct-ui/commit/02bbba9b9ceeeb4a605b39036728f9deb8707f19) Thanks [@navilan](https://github.com/navilan)! - Add select component

- Updated dependencies [[`02bbba9`](https://github.com/navilan/duct-ui/commit/02bbba9b9ceeeb4a605b39036728f9deb8707f19)]:
  - @duct-ui/core@0.1.2

## 0.1.1

### Patch Changes

- [#2](https://github.com/navilan/duct-ui/pull/2) [`7a8aff4`](https://github.com/navilan/duct-ui/commit/7a8aff4c46f27862dd713b23d59257a799e51ebc) Thanks [@navilan](https://github.com/navilan)! - Initial release for duct ui + core component library.

  - Core component library is working to an acceptable level of DX and functionality.
  - Reasonable standard library of components:
    - Button
    - IconButton
    - Editable Label
    - Menu
    - Sidebar Navigation
    - Tree View

- Updated dependencies [[`7a8aff4`](https://github.com/navilan/duct-ui/commit/7a8aff4c46f27862dd713b23d59257a799e51ebc)]:
  - @duct-ui/core@0.1.1
