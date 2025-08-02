## Build Commands

Update your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "node node_modules/@duct-ui/cli/dist/cli.js build",
    "preview": "vite preview"
  }
}
```