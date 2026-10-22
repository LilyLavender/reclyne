# *reclyne*
#### *reclyne* is a lightweight calendar built to showcase the utility of a line-by-line layout.
*reclyne* is designed to have everything you need to know in the app itself. However, the Wiki on this GitHub page exists to provide clarification.

## Using *reclyne*
*reclyne* runs in the browser at https://lilylavender.github.io/reclyne/

All data is stored in your browser's local storage. Use the export button to back it up and the import button to restore it.

## Development
Requires [Node.js](https://nodejs.org/).

```
npm install       # install dependencies
npm run dev       # start the dev server with hot reload
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

Pushes to `main` are built and deployed to GitHub Pages automatically.

## Optimization
- As of now, *reclyne* has only been tested on Chrome and Firefox, but optimization for other browsers is planned for beta.
- *reclyne* is currently optimized for PC usage. Mobile optimization is not currently planned.

## How Can I Help?
#### Conceptual Help
Report bugs, nitpicks, features you want, or whatever else to the issues page  
When reporting bugs, please include your browser & operating system. It helps optimize for other browsers and devices
#### Programming
If you wish to help with programming *reclyne*, feel free to message me or make a pr.

## Credits
All of the main code was written by [Lily](https://github.com/LilyLavender).

*reclyne* is built with [Vue](https://vuejs.org/), [Vite](https://vite.dev/), and [Pinia](https://pinia.vuejs.org/).

*reclyne* uses [Bootstrap Icons](https://icons.getbootstrap.com/).
