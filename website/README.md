This website was created with [Docusaurus](https://docusaurus.io/).

The official documentation webpage is hosted [here](https://CenterForTheBuiltEnvironment.github.io/comfort_tool/docs/ashrae55.html).

# Update documentation

In order for this to work you need to have writing permission to the main `CenterForTheBuiltEnvironment/comfort_tool/` repository.

## Clone the repository

Clone the repository to your machine.

## Run the website locally

Ensure you have the latest version of [Node](https://nodejs.org/en/download/) installed. We also recommend you install [Yarn](https://yarnpkg.com/en/docs/install) as well. However you do not need Yarn and in the commands below you can replace the `yarm` command with `npm`

    > You have to be on Node >= 8.x and Yarn >= 1.5.

Change directory to `comfort_tool\website` then install the packages and run the local webserver using:
```
npm install
npm start
```

The website should load automatically. If it does not click on this URL http://localhost:3000
There's also a LiveReload server running and any changes made to the docs and files in the `website` directory will cause the page to refresh.

## Documentation Structure

The documentation website structure should look like this. Feel free to add pages and imgages to the `docs` folder.

```
comfort_tool/
  docs/
    doc-1.md
    doc-2.md
    doc-3.md
  website/
    blog/
      2016-3-11-oldest-post.md
      2017-10-24-newest-post.md
    core/
    node_modules/
    pages/
    static/
      css/
      img/
    package.json
    sidebars.json
    siteConfig.js
```

Once you have customized the documentation to your liking, more info below or on the Docusaurus webpage, you can create a static build of your website by running the following script from the website directory:

```
yarn run build # or `npm run build`
```

This will generate a `build` directory inside the `website` directory containing the `.html` files from all of your docs and other pages included in `pages`.


## Push the changes to gh-pages

`gh-pages` is the branch that is hosting the documentation website. To push your changes to this branch, run the following commands:

```
cd website
cmd /C "set GIT_USER=CenterForTheBuiltEnvironment&& set CURRENT_BRANCH=master && set USE_SSH=true && yarn run publish-gh-pages"
```

The fact that there is no space between the words `Environment` and `&&` is okay, do not add a space since that will cause an error.

# Editing Content

## Editing an existing docs page

Edit docs by navigating to `docs/` and editing the corresponding document:

`docs/doc-to-be-edited.md`

```markdown
---
id: page-needs-edit
title: This Doc Needs To Be Edited
---

Edit me...
```

For more information about docs, click [here](https://docusaurus.io/docs/en/navigation)

# Adding Content

## Adding a new docs page to an existing sidebar

1. Create the doc as a new markdown file in `/docs`, example `docs/newly-created-doc.md`:

```md
---
id: newly-created-doc
title: This Doc Needs To Be Edited
---

My new content here..
```

1. Refer to that doc's ID in an existing sidebar in `website/sidebars.json`:

```javascript
// Add newly-created-doc to the Getting Started category of docs
{
  "docs": {
    "Getting Started": [
      "quick-start",
      "newly-created-doc" // new doc here
    ],
    ...
  },
  ...
}
```

For more information about adding new docs, click [here](https://docusaurus.io/docs/en/navigation)

## Adding items to your site's top navigation bar

1. Add links to docs, custom pages or external links by editing the headerLinks field of `website/siteConfig.js`:

`website/siteConfig.js`

```javascript
{
  headerLinks: [
    ...
    /* you can add docs */
    { doc: 'my-examples', label: 'Examples' },
    /* you can add custom pages */
    { page: 'help', label: 'Help' },
    /* you can add external links */
    { href: 'https://github.com/facebook/docusaurus', label: 'GitHub' },
    ...
  ],
  ...
}
```

For more information about the navigation bar, click [here](https://docusaurus.io/docs/en/navigation)

## Adding custom pages

1. Docusaurus uses React components to build pages. The components are saved as .js files in `website/pages/en`:
1. If you want your page to show up in your navigation header, you will need to update `website/siteConfig.js` to add to the `headerLinks` element:

`website/siteConfig.js`

```javascript
{
  headerLinks: [
    ...
    { page: 'my-new-custom-page', label: 'My New Custom Page' },
    ...
  ],
  ...
}
```

For more information about custom pages, click [here](https://docusaurus.io/docs/en/custom-pages).

# Full Documentation

Full documentation can be found on the [website](https://docusaurus.io/).
