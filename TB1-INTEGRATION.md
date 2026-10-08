# Landing integration for TB1

The source is HTML, CSS and JavaScript. The updated source is submitted for review through a feature branch and a PR to develop; the existing GitHub Pages deployment has not been overwritten.

Clone [friotrack-frontend](https://github.com/upc-pre-202620-1asi0730-8088-FrioTrack/friotrack-frontend/tree/feature/tb1-frontend-application), then run `npm ci` and `npm run dev` from its root on port 5173. Serve this directory on port 4174. Entry CTAs navigate to `#/login` or `#/register`; role CTAs pass `coordinator` or `cargo-client`, and the selected language.

`assets/js/config.js` is the single integration configuration. Before publication, replace `frontendBaseUrl` with the verified HTTPS URL of the deployed Vue application. Do not publish the localhost configuration as production.

English (en-US) is the default for a new visitor. A saved Spanish (es-419) preference is respected. Contact currently validates locally and identifies its demo scope. With an approved real `contactEndpoint`, only HTTP success shows confirmation; errors remain visible without hiding the form.

The GitHub organization is the verified public network link available for the team. Additional social accounts and a real sales/contact channel require real account details.
