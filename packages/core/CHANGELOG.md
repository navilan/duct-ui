# @duct-ui/core

## 0.8.1

### Patch Changes

- [#77](https://github.com/navilan/duct-ui/pull/77) [`727781c`](https://github.com/navilan/duct-ui/commit/727781c4e87b4dabcaedf68dd037f66b5471a1ae) Thanks [@navilan](https://github.com/navilan)! - Update search core to be in sync with other packages

## 0.8.0

### Minor Changes

- [#75](https://github.com/navilan/duct-ui/pull/75) [`5a3817f`](https://github.com/navilan/duct-ui/commit/5a3817f6afd6e59db26f5dc061a90433fc0780b0) Thanks [@navilan](https://github.com/navilan)! - Sitemap generation and site-wide search.

## 0.7.10

### Patch Changes

- [#71](https://github.com/navilan/duct-ui/pull/71) [`b6ed971`](https://github.com/navilan/duct-ui/commit/b6ed971200c68a6ce2a6ad09003043cf88ee47ff) Thanks [@navilan](https://github.com/navilan)! - Fix relative imports in barrel files

## 0.7.9

### Patch Changes

- [#69](https://github.com/navilan/duct-ui/pull/69) [`53dba6f`](https://github.com/navilan/duct-ui/commit/53dba6fc5fdebdc1e9ddac76a92201ecd909ea0a) Thanks [@navilan](https://github.com/navilan)! - Use tailwind-merge and the cn pattern to merge classes

## 0.7.8

### Patch Changes

- [#67](https://github.com/navilan/duct-ui/pull/67) [`24ab2a4`](https://github.com/navilan/duct-ui/commit/24ab2a4eb1bca2e8aab990b2db54774dd4b00c3a) Thanks [@navilan](https://github.com/navilan)! - Default props to an empty object

## 0.7.7

### Patch Changes

- [#62](https://github.com/navilan/duct-ui/pull/62) [`99b163e`](https://github.com/navilan/duct-ui/commit/99b163e7f91659196fc107119fb5ff877a6a2136) Thanks [@navilan](https://github.com/navilan)! - Better handling of excerpts

## 0.7.6

### Patch Changes

- [#60](https://github.com/navilan/duct-ui/pull/60) [`5c30893`](https://github.com/navilan/duct-ui/commit/5c308936fc851e6950e8893fde834851e92581d7) Thanks [@navilan](https://github.com/navilan)! - Use relative module imports with js extension

## 0.7.5

### Patch Changes

- [#58](https://github.com/navilan/duct-ui/pull/58) [`5c955ba`](https://github.com/navilan/duct-ui/commit/5c955bae2f749c19b56e51d90211868e92cda8e6) Thanks [@navilan](https://github.com/navilan)! - Log errors in config parsing

## 0.7.4

### Patch Changes

- [#56](https://github.com/navilan/duct-ui/pull/56) [`4e136a2`](https://github.com/navilan/duct-ui/commit/4e136a2b1f46cd3c5132aee0373ae7ae3d53f411) Thanks [@navilan](https://github.com/navilan)! - Add markdown parsing for excerpts

## 0.7.3

### Patch Changes

- [#54](https://github.com/navilan/duct-ui/pull/54) [`9797516`](https://github.com/navilan/duct-ui/commit/9797516f14ce47cf546e9f5d23fe3e2100cef48c) Thanks [@navilan](https://github.com/navilan)! - Minor fixes and starter package

## 0.7.2

### Patch Changes

- [#52](https://github.com/navilan/duct-ui/pull/52) [`3e2967f`](https://github.com/navilan/duct-ui/commit/3e2967f391849ccf72ea6ea092bbdd315982feb7) Thanks [@navilan](https://github.com/navilan)! - Add custom markdown parser support

## 0.7.1

### Patch Changes

- [#50](https://github.com/navilan/duct-ui/pull/50) [`74c4ca5`](https://github.com/navilan/duct-ui/commit/74c4ca5371f69bb97d2730482f4fb7c7b06e6fb5) Thanks [@navilan](https://github.com/navilan)! - Use vite config provided by user

## 0.7.0

### Minor Changes

- [#46](https://github.com/navilan/duct-ui/pull/46) [`45711c0`](https://github.com/navilan/duct-ui/commit/45711c017dcc3d70cf53e5b20daf49945e84c15f) Thanks [@navilan](https://github.com/navilan)! - Add support for generating static pages from markdown

  - Add support for generating pages from markdown in a pre-configured `contentDir`
  - Add support for static asset copying
  - Add hot reload for content in dev server
  - Add prism js support
  - Add support for excerpts

## 0.6.2

### Patch Changes

- [#44](https://github.com/navilan/duct-ui/pull/44) [`a6f84d1`](https://github.com/navilan/duct-ui/commit/a6f84d128f7d77454e45206abbcd51cfc3ce7bf8) Thanks [@navilan](https://github.com/navilan)! - Add markdown component and update documentation

## 0.6.1

### Patch Changes

- [#41](https://github.com/navilan/duct-ui/pull/41) [`e54e4e9`](https://github.com/navilan/duct-ui/commit/e54e4e9735d0429fcd2d12a772ea45ad488dcb2d) Thanks [@navilan](https://github.com/navilan)! - Add app container and component reanimation

  - Generate a simple container script during generation
  - Remove main.tsx and html files from demo. Everything is generated.
  - Simplify vite config
  - Streamline demo styles
  - Fix demo ux
  - Remove cloudflare functions

## 0.6.0

### Minor Changes

- [#39](https://github.com/navilan/duct-ui/pull/39) [`4c2ce1d`](https://github.com/navilan/duct-ui/commit/4c2ce1dc421a3aa5d5f8c4e6767f5c86a23619a7) Thanks [@navilan](https://github.com/navilan)! - Add experimental static website generation

  - Generate static website based on file system routes
  - Define interfaces for pages and dyanmic pages
  - Generate sub routes based on function return values
  - Add vite plugin to have all the vite dev server goodnesses
  - Reorganize demos website

## 0.5.1

### Patch Changes

- [#33](https://github.com/navilan/duct-ui/pull/33) [`bd1f7fc`](https://github.com/navilan/duct-ui/commit/bd1f7fcb77069a507c0948c1874b7c7a4900bd2b) Thanks [@navilan](https://github.com/navilan)! - Ensure ref is not rendered.

  - Add landing page for duct website
  - Minor clean up in blueprint

## 0.5.0

### Minor Changes

- Remove factory method pattern for component instantiation

  - Ensure that you can use the imported default component directly
  - Remove getLogic in favor of refs
  - Update all demos & documentation
  - Use regular urls for demo navigation

## 0.4.1

### Patch Changes

- [#28](https://github.com/navilan/duct-ui/pull/28) [`acd8617`](https://github.com/navilan/duct-ui/commit/acd8617930d2b948a6bffdc3eb78d05f863193b1) Thanks [@navilan](https://github.com/navilan)! - Update dependencies and documentation.

## 0.4.0

### Minor Changes

- Add ref as the primary way to bind to component's logic.

## 0.3.0

### Minor Changes

- [#24](https://github.com/navilan/duct-ui/pull/24) [`6ec6a89`](https://github.com/navilan/duct-ui/commit/6ec6a893a91c95a54668380f2056c15ea8e50820) Thanks [@navilan](https://github.com/navilan)! - Add async toggle component and reorganize imports

## 0.2.0

### Minor Changes

- [#18](https://github.com/navilan/duct-ui/pull/18) [`978fa26`](https://github.com/navilan/duct-ui/commit/978fa268121d85fa740b2eb46ee97b03e95f83f3) Thanks [@navilan](https://github.com/navilan)! - Add sidebar nav and add documentation

## 0.1.7

### Patch Changes

- [#16](https://github.com/navilan/duct-ui/pull/16) [`aa34ea5`](https://github.com/navilan/duct-ui/commit/aa34ea5b48e2dee55944ec2ce77950b2b04c9d30) Thanks [@navilan](https://github.com/navilan)! - \* Add tab component
  - Add modal component
  - Add asynchronous load hook that gets called between refresh and bind
  - Allow asynchronous getItems property in list component

## 0.1.6

### Patch Changes

- [#14](https://github.com/navilan/duct-ui/pull/14) [`a79afd3`](https://github.com/navilan/duct-ui/commit/a79afd37abcd16949e2c2e72062c333f674a89ba) Thanks [@navilan](https://github.com/navilan)! - Add toggle button and list component

## 0.1.5

### Patch Changes

- [#12](https://github.com/navilan/duct-ui/pull/12) [`4e93cd0`](https://github.com/navilan/duct-ui/commit/4e93cd035ff43f2899deeec811c332bb169e4782) Thanks [@navilan](https://github.com/navilan)! - Fix event binding issues and upgrade demo components

## 0.1.4

### Patch Changes

- [#8](https://github.com/navilan/duct-ui/pull/8) [`4baff5e`](https://github.com/navilan/duct-ui/commit/4baff5e9a7608157c1c2f295505516faa4a58c58) Thanks [@navilan](https://github.com/navilan)! - More hygienic cleanup of bound event handlers

## 0.1.3

### Patch Changes

- [#6](https://github.com/navilan/duct-ui/pull/6) [`c2a8a22`](https://github.com/navilan/duct-ui/commit/c2a8a22c09548db4d3b7f725f823a54069478071) Thanks [@navilan](https://github.com/navilan)! - Add drawer component

## 0.1.2

### Patch Changes

- [#4](https://github.com/navilan/duct-ui/pull/4) [`02bbba9`](https://github.com/navilan/duct-ui/commit/02bbba9b9ceeeb4a605b39036728f9deb8707f19) Thanks [@navilan](https://github.com/navilan)! - Add select component

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
