# 十二时辰

A static, reusable Chinese traditional time reference app.

## Structure

- `data/shichen.json` — the 12 traditional time-period records.
- `src/shichen-engine.js` — reusable lookup/current-time engine.
- `index.html` — the website UI.
- `manifest.webmanifest` + `sw.js` — PWA support.

## Engine

```js
const engine = await loadShichenEngine();
engine.list();
engine.get("wu");
engine.getByHour(12);
engine.getCurrent(new Date());
engine.getNext("wu");
```

The data deliberately excludes 八字-dependent calculations such as 时柱、时干、十神、旺衰 and other birth-chart interpretation.

The JSON and engine are plain static files so other projects may reuse them directly.
