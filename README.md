# oo-elements
Web Components for [Double O](https://ooapp.co)

<a href="https://travis-ci.org/frame00/oo-elements">
  <img src="https://api.travis-ci.org/frame00/oo-elements.svg?branch=master" alt="build status">
</a>

## Browsers support <sub><sup><sub><sub>made by <a href="https://godban.github.io">godban</a></sub></sub></sup></sub>

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- |
| last version| last version

# Usage
`oo-elements` is a set of classes that define some Custom Elements.

## Use from HTML
`oo-elements` is serving from CDN.

e.g. Use stable script

```html
<script async src="//elements.ooapp.co/stable/oo-elements.js"></script>
<oo-button data-iam="{Your Double O UID}"></oo-button>
```

e.g. Use stable mjs

```html
<script type="module">
  import {ooButton} from 'https://elements.ooapp.co/stable/oo-elements.mjs'
  window.customElements.define('oo-button', ooButton)
</script>

<oo-button data-iam="{Your Double O UID}"></oo-button>
```

### Tips
#### Use a small script that defines one Custom Element
e.g. Only `<oo-button>`
```
elements.ooapp.co/stable/oo-elements.js
                         ^^^^^^^^^^^
                         ↓
                         oo-button.js
```

#### Use an unstable but up-to-date source
e.g.
```
elements.ooapp.co/stable/oo-elements.js
                  ^^^^^^
                  ↓
                  unstable
```

## Use from JavaScript
Install `oo-elements` from npm.

```bash
npm i -D oo-elements
```

Import predefined file

```js
import 'oo-elements'
```

Import ES Module

```js
import {ooButton} from 'oo-elements/dist/oo-elements.mjs'
```

# Development

## Install
```bash
git clone git@github.com:frame00/oo-elements.git
cd oo-elements
npm install
```

## Preview
```bash
npm start
```

## Build

```bash
npm run build
```

or partial build

```bash
npm run build oo-button
```

## Test

```bash
npm test
```
