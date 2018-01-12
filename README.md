# oo-elements
Web Components for OO

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

### Preview with Now
Easy publish preview with [Now](https://zeit.co/now).

```bash
now --static example/
# > Ready! https://XXXXXX.now.sh
```

#### Use aslias
```bash
now alias https://XXXXXX.now.sh oo-elements
```

You can access https://oo-elements.now.sh/ .

## Build

```bash
npm run build
```

or partial build

```bash
npm run build src/elements/oo-button/define.ts
```

## Test

```bash
npm test
```
