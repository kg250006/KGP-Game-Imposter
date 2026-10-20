# Netlify redirect for theimpostergame.online

The game now lives on KGP Host at https://imposter.sitepage.app. This folder is the whole
Netlify deploy for the old domain: a forced 301 for every path (query strings kept, so Stripe
returns still activate premium) and a kill-switch `sw.js` that clears old PWA installs.

Deploy (Netlify is not git-linked; deploys are manual):

```bash
netlify deploy --prod --dir netlify-redirect --site 49bbaef2-944c-4782-aa0d-c3cc5e2c7286
```

To undo, restore the previous app deploy in the Netlify dashboard (Deploys > 691b24c69bc059363cae9395 > Publish deploy).
