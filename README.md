# Fragiola UI

A copy-paste React component library built on [Base UI](https://base-ui.com) and [Tailwind CSS](https://tailwindcss.com). Composable color palettes you can scope to any subtree, shared style families, and one way to do each thing. No package to install — the source lands in your project, and it is yours.

## Documentation

Visit https://fragiola.com/ui to view the documentation.

## Development

```bash
pnpm install
pnpm site:dev --base /ui --port 5174    # the examples, served for fragiola.com's dev server
pnpm site:export --base /ui --out out   # what fragiola.com builds /ui from
```

The documentation site itself lives in [fragiola/www](https://github.com/fragiola/www);
this repository provides its pages (`site/docs`), its examples (`examples/react`)
and the registry (`packages/registry`).

Requires Node.js ≥ 24 and pnpm ≥ 11.

## License

Licensed under the [MIT license](./LICENSE).
