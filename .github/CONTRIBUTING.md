# Contributing Guide

## How to contribute?

You can find problems from [Issues](https://github.com/frame00/oo-elements/issues) or fix other problems.

Basic Pull Request steps:

1. Fork this repository
2. Create your feature branch: `git checkout -b awesome-feature`
3. Commit your changes: `git commit -am "Add awesome feature"`
4. Push to the branch: `git push origin awesome-feature`
5. Submit a pull-request

## How to start development?

First as follows:

```bash
git clone git@github.com:frame00/oo-elements.git
cd oo-elements
npm install
```

Preview with your browser:

1. Add `.html` directory and create HTML file for preview. ( e.g. `.html/index.html` )
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Preview</title>
</head>
<body>
	<script src="../dist/oo-elements.js"></script>
	<oo-commands></oo-commands>
</body>
</html>
```

2. Start up the server and browse `.html`
```bash
npm start
```

If you change something:
```bash
npm run build
```

If there is no problem build succeeds!

## How to run tests?

Run all tests:

```bash
npm test
```
