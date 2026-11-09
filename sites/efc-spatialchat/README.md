# EFC × SpatialChat event website

The deployable website is in `dist/` and has no external runtime dependencies.

## Present locally

Run a static server from the project directory:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173`.

Use the right-side chapter navigation or the Up/Down and Page Up/Page Down keys to move through the presentation.

## Deploy

Upload the contents of `dist/` to any static host. Keep the `assets/` directory beside `index.html`.
