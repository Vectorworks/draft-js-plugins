# @vectorworks/draft-js-plugins

## Installation

Configure npm to resolve the `@vectorworks` scope from GitHub Packages:

```ini
@vectorworks:registry=https://npm.pkg.github.com/Vectorworks
```

For a private package, authenticate with a personal access token that has the
`read:packages` scope:

```sh
npm login --scope=@vectorworks --auth-type=legacy --registry=https://npm.pkg.github.com
```

Enter the token as the password when prompted.

Then install the editor:

```sh
npm install @vectorworks/draft-js-plugins
```

Checkout www.draft-js-plugins.com
