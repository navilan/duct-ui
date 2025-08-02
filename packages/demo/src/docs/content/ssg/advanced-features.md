## Advanced Features

### Environment Variables

Access environment variables in your page components:

```typescript
export default function HomePage({ env }: { env: Record<string, any> }) {
  return (
    <div>
      <h1>Welcome to {env.SITE_NAME}</h1>
      <p>API URL: {env.API_URL}</p>
    </div>
  )
}
```

### Conditional Rendering

Different behavior for static vs. client-side rendering:

```typescript
export default function MyPage() {
  const isSSG = typeof window === 'undefined'

  return (
    <div>
      <h1>My Page</h1>
      {!isSSG && (
        <div>This only renders on the client</div>
      )}
    </div>
  )
}
```
