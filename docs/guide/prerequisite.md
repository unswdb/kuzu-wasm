# Prerequisite: Enable Cross-Origin-isolation

## Reason
Since Kùzu does not currently have a fully single-threaded version, the process of compiling Kùzu into Kùzu-wasm using Emscripten requires the use of Pthreads. To support Pthreads, SharedArrayBuffer must be enabled. This means we need to configure the Cross-Origin Opener Policy (COOP) and Cross-Origin Embedder Policy (COEP) headers.

## Explaination
Emscripten has support for multithreading using SharedArrayBuffer in browsers. That API allows sharing memory between the main thread and web workers as well as atomic operations for synchronization, which enables Emscripten to implement support for the Pthreads (POSIX threads) API. This support is considered stable in Emscripten.

::: tip Note from Emscripten

Browsers [that have implemented and enabled](https://webassembly.org/features/) SharedArrayBuffer, are gating it behind Cross Origin Opener Policy (COOP) and Cross Origin Embedder Policy (COEP) headers. Pthreads code will not work in deployed environment unless these headers are correctly set. For more information click [this](https://web.dev/coop-coep)

:::

## Solution
Modify the COOP/COEP heade.
### In your own server: you can control the header
Please refer to [cross-origin-isolation-guide](https://web.dev/articles/cross-origin-isolation-guide?hl=en#enable_cross-origin_isolation)

### Github Pages
Please refer to [coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker)
::: warning Notice
Put `coi-serviceworker.js` next to your index file
:::

### Netlify
`netlify.toml` template
```yaml
[[headers]]
for = "/*"
  [headers.values]
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Embedder-Policy = "require-corp"
    Access-Control-Allow-Origin = "*"
```

### Vercel
`vercel.json` template
```yaml
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}

```

###  Express.js
```javascript
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
```
