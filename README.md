# Matthew Opoly Timer Table

A local web app for running Matthew Opoly add-on timers during a game.

## Run

```sh
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Visual Reference

The saved concept image is at:

```text
assets/design-reference-concept.png
```

Use it only as a visual direction reference. Some generated text in that image is not a real Matthew Opoly rule, especially the property-tax copy. The app source and the user's rules are the source of truth.

## Generated Assets

Dice assets were generated with the built-in imagegen tool, then chroma-keyed to transparent PNGs:

```text
assets/die-single.png
assets/dice-pair.png
```
