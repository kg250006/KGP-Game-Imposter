# PRP: Move The Imposter Game from Netlify to KGP Host (imposter.sitepage.app)

```xml
<prp name="netlify-to-kgp-hosting" version="1.0">

<metadata>
  <created>2026-10-20</created>
  <author>software-architect skill</author>
  <target-branch>main</target-branch>
  <work-branch>chore/kgp-hosting-migration</work-branch>
  <estimated-effort>M</estimated-effort>
  <confidence-score>8</confidence-score>
  <required-skills>KGP:kgp-hosting (load before any kgp call; follow its prerequisites and guardrails)</required-skills>
</metadata>

<goal>
The static Vite/React PWA builds from this repo and is published as a live KGP Host release at
https://imposter.sitepage.app. The repo has a `kgp.toml` linked to site `imposter`, a committed
`.env.production` holding the production build values, and a `public/_headers` file. Deep links fall back to
`index.html`, all 16 `/words/*.json` category files load, and the platform security headers are present.
The Netlify site (theimpostergame.online) keeps running untouched.
</goal>

<intent-anchors>
  <what>A working, published KGP Host release of the game at https://imposter.sitepage.app, migrated from the Netlify config.</what>
  <who>The site owner (KG) runs the migration. Players use the new address afterwards.</who>
  <why>Host the game on the owner's own KGP platform instead of Netlify.</why>
  <out-of-scope>
    <item>Moving, redirecting or retiring theimpostergame.online (owner will decide later; no `kgp domains add`, no DNS changes)</item>
    <item>Deleting or disabling the Netlify site, or removing netlify.toml</item>
    <item>Porting server functions (the site has none)</item>
    <item>Switching Google Analytics to Matomo</item>
    <item>Gameplay, UI or styling changes</item>
    <item>Changing canonical / Open Graph / sitemap URLs (they stay on theimpostergame.online)</item>
  </out-of-scope>
  <success-signal>After publish, `curl -sI https://imposter.sitepage.app/` returns 200 with an `X-KGP-Release` header, a deep link (`/lobby`) returns index.html, and `/words/animals.json` returns 200 JSON.</success-signal>
</intent-anchors>

<context>
  <business-value>
    Moves hosting onto the owner's KGP platform: immutable releases, one-command rollback, and no dependency on
    Netlify. The game is purely static, so the move has no function rewrites and low risk.
  </business-value>

  <decisions>
    <decision id="D1">
      <topic>Custom domain theimpostergame.online</topic>
      <choice>Not touched. Netlify keeps serving it. Owner will redirect or retire it later.</choice>
      <rationale>User: "I'll redirect it or retire it... not an issue right now".</rationale>
    </decision>
    <decision id="D2">
      <topic>Hardcoded absolute URLs in index.html (canonical, og:*, twitter:*, JSON-LD) and public/sitemap.xml, public/robots.txt</topic>
      <choice>Leave them pointing at https://theimpostergame.online/.</choice>
      <rationale>Keeps SEO and share previews on the real domain while it still exists. Revisit when the domain decision is made.</rationale>
    </decision>
    <decision id="D3">
      <topic>Cache headers from netlify.toml</topic>
      <choice>Drop the site-wide `Cache-Control: public, max-age=0, must-revalidate` and all per-extension `immutable` rules. Keep only the 1-hour cache for /sitemap.xml and /robots.txt in `public/_headers`.</choice>
      <rationale>KGP Host already caches `/assets/` (Vite's hashed output) for a year and revalidates everything else. The Netlify `/*.json` immutable rule cached unhashed word lists for a year, so word updates never reached returning players. A site-wide Cache-Control in kgp.toml could override the platform's `/assets/` caching.</rationale>
    </decision>
    <decision id="D4">
      <topic>`payment=()` in Permissions-Policy</topic>
      <choice>Remove it: `Permissions-Policy = "geolocation=(), microphone=(), camera=()"` (the platform default).</choice>
      <rationale>User approved. `payment=()` disables the Payment Request API that Apple Pay / wallet buttons rely on.</rationale>
    </decision>
    <decision id="D5">
      <topic>Production build variables</topic>
      <choice>Create a committed `.env.production` that is a copy of the committed `.env`. Remove `.env.production` from .gitignore.</choice>
      <rationale>User asked to copy values from Netlify. Checked on 2026-10-20: Netlify site `theimpostergame` (id 49bbaef2-944c-4782-aa0d-c3cc5e2c7286) sets only VITE_FEATURE_APPLE_PAY_ENABLED in production, value `false`, identical to `.env`. All values are public `VITE_*` client values (they ship in the JS bundle), so committing them leaks nothing. KGP Host has no build-variable dashboard, so production values need an explicit home in the repo.</rationale>
    </decision>
    <decision id="D6">
      <topic>Stripe "after payment" redirect</topic>
      <choice>Do not change it in this PRP. Report it as an owner decision with exact instructions.</choice>
      <rationale>Premium is stored in localStorage per origin. Whichever address the Stripe Payment Link redirects to is where premium activates. While theimpostergame.online stays live on Netlify, pointing Stripe at the new host would break premium for domain users. Switch it when traffic moves.</rationale>
    </decision>
  </decisions>

  <prerequisites>
    <prerequisite>kgp CLI 0.2.0+ installed and logged in (verified 2026-10-20: kgp 0.3.0, instance `kgp`, agent_secret present).</prerequisite>
    <prerequisite>Site `imposter` does NOT exist yet (verified: `site_not_found`). Creating it is owner-only (task 1.1 gate).</prerequisite>
    <prerequisite>Node 18+ and npm; `npm install` already run.</prerequisite>
  </prerequisites>

  <owner-gates>
    <!-- The executor MUST stop and ask with AskUserQuestion before each of these; run only on an explicit yes. -->
    <gate task="1.1">kgp sites create imposter</gate>
    <gate task="1.2">kgp migrate netlify --write --site imposter</gate>
    <gate task="3.2">kgp releases publish DEPLOY_ID (production publish)</gate>
    <gate task="4.3">git push / PR creation (commit is allowed; push only on request)</gate>
  </owner-gates>
</context>

<codebase-analysis>
  <existing-patterns>
    <pattern file="netlify.toml" usage="Source config: build `npm run build`, publish `dist`, SPA rewrite `/* -> /index.html 200`, header blocks. `kgp migrate netlify` reads it."/>
    <pattern file="vite.config.ts" usage="vite-plugin-pwa with registerType autoUpdate, start_url/scope '/'. Generates dist/sw.js and dist/manifest.webmanifest. Vite copies public/* (including _headers) to the dist root."/>
    <pattern file=".env" usage="Committed, 21 VITE_* public flags/IDs. Vite loads .env then .env.production in `vite build`."/>
    <pattern file="src/features/payment/hooks/useStripe.ts" usage="Comment at line 23 documents the Stripe redirect: https://DOMAIN/?session=success&amp;method=stripe"/>
    <pattern file="src/features/payment/utils/paymentSuccess.ts" usage="Activates premium from ?session=success&amp;method=... on the current origin (localStorage)."/>
  </existing-patterns>

  <affected-files>
    <file action="create" path="kgp.toml" reason="Written by `kgp migrate netlify --write --site imposter`, then headers trimmed (D3, D4)."/>
    <file action="create" path="public/_headers" reason="1-hour Cache-Control for /sitemap.xml and /robots.txt (compiled on deploy, not served)."/>
    <file action="create" path=".env.production" reason="Committed production VITE_* values (copy of .env, D5)."/>
    <file action="modify" path=".gitignore" reason="Stop ignoring .env.production; ignore .env.kgp-dev and .env.server."/>
    <file action="modify" path="CLAUDE.md" reason="Deployment section: KGP Host is the deploy target; Netlify still serves the custom domain."/>
    <file action="modify" path="README.md" reason="Deployment section: KGP Host steps."/>
    <file action="modify" path="DEPLOYMENT_CHECKLIST.md" reason="Add KGP Host deploy/publish/rollback checklist."/>
  </affected-files>

  <dependencies>
    <dependency name="kgp CLI" version=">=0.2.0 (0.3.0 installed)" purpose="Migration, local dev, deploy, publish, rollback"/>
    <!-- No npm packages added or removed. -->
  </dependencies>

  <gotchas>
    <gotcha>`.gitignore` line 28 ignores `.env.production`. Remove that line or `git add` silently skips the file.</gotcha>
    <gotcha>`kgp migrate netlify` proposes `Cache-Control: public, max-age=0, must-revalidate` in `[headers]`. Remove it (D3).</gotcha>
    <gotcha>The 8 `unsupported` items from the migration plan are all per-path cache headers. They are resolved by D3, not by copying them all into _headers.</gotcha>
    <gotcha>A new site can redirect to /404.html or show a certificate warning for a few minutes after `kgp sites create`. Wait and re-check with `kgp sites info imposter --json --yes`. Never switch to http://.</gotcha>
    <gotcha>sitepage.app is HTTPS-only (HSTS preload). All checks use https://.</gotcha>
    <gotcha>`kgp dev` keeps running. Start it in the background and stop it when the smoke test ends.</gotcha>
    <gotcha>The service worker (dist/sw.js) must not be long-cached. The platform revalidates non-/assets/ files, so do not add a Cache-Control rule for it.</gotcha>
    <gotcha>`npm run build` runs `tsc` first. Type errors fail the build (kgp exit 4).</gotcha>
    <gotcha>Players on theimpostergame.online and imposter.sitepage.app have separate localStorage (premium, stats, custom words, theme). That's expected and not a bug to fix here.</gotcha>
  </gotchas>
</codebase-analysis>

<research-findings>
  <recommended-libraries>
    <library name="none" purpose="No new dependencies">
      <rationale>The kgp CLI already provides the migration bridge (`kgp migrate netlify`), local runtime (`kgp dev`) and deploy pipeline. Static Vite output needs nothing else.</rationale>
      <docs-url>~/.claude/plugins/cache/KGP/KGP/2.17.1/skills/kgp-hosting/SKILL.md</docs-url>
      <install>n/a</install>
    </library>
  </recommended-libraries>

  <patterns-to-follow>
    <pattern source="kgp-hosting skill quick_start">
      <description>Draft deploy, report the deploy_id, publish only on request, read `verification`, roll back if it failed and was not auto-rolled-back.</description>
      <applicability>Tasks 3.1 and 3.2 follow it exactly.</applicability>
    </pattern>
    <pattern source="Vite docs: Env Variables and Modes (https://vitejs.dev/guide/env-and-mode)">
      <description>`vite build` loads `.env`, then `.env.production`. Mode-specific files win.</description>
      <applicability>`.env.production` becomes the explicit production source (D5).</applicability>
    </pattern>
    <pattern source="kgp-hosting references/site-anatomy.md">
      <description>`_redirects` / `_headers` at the publish root are compiled into rules and not served. `spa = true` serves root index.html for extensionless paths.</description>
      <applicability>public/_headers (task 1.4) and SPA deep links (task 2.2).</applicability>
    </pattern>
  </patterns-to-follow>

  <pitfalls-to-avoid>
    <pitfall source="kgp-hosting guardrails">
      <issue>Publishing to production or running owner-only commands without an explicit yes.</issue>
      <mitigation>Owner gates in context/owner-gates. Ask with AskUserQuestion every time.</mitigation>
    </pitfall>
    <pitfall source="kgp-hosting guardrails">
      <issue>Shipping .htaccess or PHP in dist, or putting secrets in kgp.toml.</issue>
      <mitigation>Task 2.1 checks dist. kgp.toml holds only build/spa/headers/site.</mitigation>
    </pitfall>
    <pitfall source="Netlify config review">
      <issue>Long `immutable` caching of unhashed files (words/*.json, images) stops updates reaching players.</issue>
      <mitigation>D3: rely on the platform's /assets/ caching only.</mitigation>
    </pitfall>
    <pitfall source="kgp-hosting corporate_hardening">
      <issue>A Strict-Transport-Security header with `preload` is refused (exit 7).</issue>
      <mitigation>Do not add an HSTS header. The platform sends it.</mitigation>
    </pitfall>
  </pitfalls-to-avoid>

  <documentation-references>
    <reference url="~/.claude/plugins/cache/KGP/KGP/2.17.1/skills/kgp-hosting/references/commands.md" topic="kgp commands">
      <key-points>
        <point>Every call uses `--json --yes`. Read stdout only; logs go to stderr.</point>
        <point>Exit codes: 3 auth, 4 build, 5 upload (re-run), 6 publish/verify, 7 config.</point>
      </key-points>
    </reference>
    <reference url="~/.claude/plugins/cache/KGP/KGP/2.17.1/skills/kgp-hosting/references/troubleshooting.md" topic="Troubleshooting">
      <key-points>
        <point>"Nothing lives here." (X-KGP-No-Site: 1) before the first publish is normal.</point>
        <point>Exit 6 with details.state = rolled_back means the previous release is live again.</point>
      </key-points>
    </reference>
  </documentation-references>
</research-findings>

<phases>

  <phase id="0" name="Preflight">
    <description>Confirm tooling, login and a green baseline before changing anything.</description>
    <tasks>
      <task id="0.1" agent="devops-engineer" effort="S" value="H" timeout="default">
        <description>Load the KGP:kgp-hosting skill. Verify kgp CLI version and login, confirm a clean tree, and create the work branch.</description>
        <files/>
        <pseudocode>
kgp --version                      # must be >= 0.2.0
kgp whoami --json --yes            # must show agent_secret: "present"; exit 3/7 -> STOP, owner must log in
git status --porcelain             # must be empty; otherwise STOP and report
git switch -c chore/kgp-hosting-migration
        </pseudocode>
        <acceptance-criteria>
          <criterion>`kgp whoami --json --yes | grep -q '"agent_secret":"present"'` exits 0</criterion>
          <criterion>`git rev-parse --abbrev-ref HEAD` prints `chore/kgp-hosting-migration`</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Nothing</expects>
          <produces>Verified CLI + work branch</produces>
        </handoff>
      </task>

      <task id="0.2" agent="qa-engineer" effort="S" value="H" timeout="extended">
        <description>Run the baseline quality gate. If anything fails before any change is made, STOP and report it as pre-existing. Do not fix unrelated code in this PRP.</description>
        <files/>
        <pseudocode>
npm run type-check
npm run lint
npx vitest run
npm run build
        </pseudocode>
        <acceptance-criteria>
          <criterion>All four commands exit 0</criterion>
          <criterion>`test -f dist/index.html` exits 0</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Verified CLI + work branch</expects>
          <produces>Green baseline</produces>
        </handoff>
      </task>
    </tasks>
  </phase>

  <phase id="1" name="Foundation: site and config">
    <description>Create the site (owner gate), write kgp.toml (owner gate), and set headers and build variables.</description>
    <tasks>
      <task id="1.1" agent="devops-engineer" effort="S" value="H" timeout="extended">
        <description>OWNER GATE. Ask with AskUserQuestion: "Create KGP site `imposter` now (address https://imposter.sitepage.app)?" Run it only on yes. On no, STOP the PRP and report.</description>
        <files/>
        <pseudocode>
kgp sites info imposter --json --yes      # expect site_not_found; if it already exists, skip create
kgp sites create imposter --json --yes    # owner-approved only; waits up to 5 min
kgp sites info imposter --json --yes      # confirm it exists
        </pseudocode>
        <acceptance-criteria>
          <criterion>`kgp sites info imposter --json --yes` exits 0</criterion>
          <criterion>The user's explicit yes is recorded in the execution log</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Green baseline</expects>
          <produces>Site `imposter`</produces>
        </handoff>
      </task>

      <task id="1.2" agent="devops-engineer" effort="S" value="H" timeout="default">
        <description>OWNER GATE. Ask: "Write kgp.toml now with `kgp migrate netlify --write --site imposter`?" Run it on yes, then show the resulting file. `--write` also writes an env template and a `netlify-proxy/` folder (a Netlify-side `/api/*` proxy). This site has no functions and the domain stays on Netlify unchanged (D1), so delete `netlify-proxy/` and any generated env template that has no variable names. Report each path from `wrote_files` and what was done with it.</description>
        <files>
          <file action="create">kgp.toml</file>
        </files>
        <pseudocode>
kgp migrate netlify --write --site imposter --json --yes
# read "wrote" / "wrote_files" from stdout; confirm kgp.toml listed
cat kgp.toml
rm -rf netlify-proxy          # not used: no functions, domain untouched (D1)
# remove a generated env template only if it contains no NAME= lines (env_template was "" in the plan)
        </pseudocode>
        <acceptance-criteria>
          <criterion>`grep -Eq '^site *= *"imposter"' kgp.toml` exits 0</criterion>
          <criterion>`grep -Eq '^spa *= *true' kgp.toml` exits 0</criterion>
          <criterion>`grep -q 'npm run build' kgp.toml &amp;&amp; grep -q '"dist"' kgp.toml` exits 0</criterion>
          <criterion>`test ! -e netlify-proxy` exits 0</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Site `imposter`</expects>
          <produces>kgp.toml as generated</produces>
        </handoff>
      </task>

      <task id="1.3" agent="devops-engineer" effort="S" value="H" timeout="default">
        <description>Edit kgp.toml `[headers]` per D3 and D4. Remove the `Cache-Control` key. Change Permissions-Policy to drop `payment=()`. Keep X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy and X-Robots-Tag. Change nothing else the tool wrote.</description>
        <files>
          <file action="modify">kgp.toml</file>
        </files>
        <pseudocode>
[headers]
"X-Frame-Options" = "DENY"
"X-Content-Type-Options" = "nosniff"
"X-XSS-Protection" = "1; mode=block"
"Referrer-Policy" = "strict-origin-when-cross-origin"
"Permissions-Policy" = "geolocation=(), microphone=(), camera=()"
"X-Robots-Tag" = "index, follow"
# (no Cache-Control, no Strict-Transport-Security)
        </pseudocode>
        <acceptance-criteria>
          <criterion>`! grep -qi 'cache-control' kgp.toml` exits 0</criterion>
          <criterion>`! grep -q 'payment=' kgp.toml` exits 0</criterion>
          <criterion>`! grep -qiE 'secret|token|password|key *=' kgp.toml` exits 0</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>kgp.toml as generated</expects>
          <produces>Final kgp.toml</produces>
        </handoff>
      </task>

      <task id="1.4" agent="devops-engineer" effort="S" value="M" timeout="default">
        <description>Create public/_headers carrying over the only per-path rules worth keeping: a 1-hour cache and the content type for sitemap.xml and robots.txt. Vite copies it to dist/_headers, and kgp compiles it on deploy.</description>
        <files>
          <file action="create">public/_headers</file>
        </files>
        <pseudocode>
/sitemap.xml
  Cache-Control: public, max-age=3600
  Content-Type: application/xml

/robots.txt
  Cache-Control: public, max-age=3600
  Content-Type: text/plain
        </pseudocode>
        <acceptance-criteria>
          <criterion>`grep -c 'max-age=3600' public/_headers` prints 2</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Nothing</expects>
          <produces>public/_headers</produces>
        </handoff>
      </task>

      <task id="1.5" agent="devops-engineer" effort="S" value="H" timeout="default">
        <description>Create a committed .env.production per D5 and update .gitignore. Values are public VITE_* only. Never add a non-VITE secret here. Do not print values in chat; list names only.</description>
        <files>
          <file action="create">.env.production</file>
          <file action="modify">.gitignore</file>
        </files>
        <pseudocode>
# header comment: "Production build values for KGP Host (public VITE_* only; ships in the JS bundle)."
cp .env .env.production   # then prepend the comment
# .gitignore: delete the line `.env.production`; append:
.env.kgp-dev
.env.server
        </pseudocode>
        <acceptance-criteria>
          <criterion>`git check-ignore -q .env.production` exits 1 (not ignored)</criterion>
          <criterion>`git check-ignore -q .env.kgp-dev &amp;&amp; git check-ignore -q .env.server` exits 0</criterion>
          <criterion>`! grep -vE '^(#|$|VITE_[A-Z0-9_]+=)' .env.production` exits 0 (only VITE_ keys)</criterion>
          <criterion>`diff &lt;(grep -E '^VITE_' .env | sort) &lt;(grep -E '^VITE_' .env.production | sort)` exits 0</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Nothing</expects>
          <produces>.env.production and updated .gitignore</produces>
        </handoff>
      </task>
    </tasks>
  </phase>

  <phase id="2" name="Build and local test">
    <description>Build the production bundle and smoke-test it with kgp dev before any upload.</description>
    <tasks>
      <task id="2.1" agent="devops-engineer" effort="S" value="H" timeout="extended">
        <description>Production build and dist sanity checks.</description>
        <files/>
        <pseudocode>
npm run build
test -f dist/index.html &amp;&amp; test -f dist/_headers &amp;&amp; test -f dist/sw.js &amp;&amp; test -f dist/manifest.webmanifest
ls dist/words/*.json | wc -l          # 16
find dist \( -name '*.php' -o -name '.htaccess' \) | wc -l   # 0
        </pseudocode>
        <acceptance-criteria>
          <criterion>`npm run build` exits 0</criterion>
          <criterion>`test $(ls dist/words/*.json | wc -l) -eq 16` exits 0</criterion>
          <criterion>`test -z "$(find dist \( -name '*.php' -o -name .htaccess \))"` exits 0</criterion>
          <criterion>`test -f dist/_headers &amp;&amp; test -f dist/sw.js` exits 0</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Final kgp.toml + public/_headers + .env.production and updated .gitignore</expects>
          <produces>dist/ ready to deploy</produces>
        </handoff>
      </task>

      <task id="2.2" agent="qa-engineer" effort="M" value="H" timeout="extended">
        <description>Run `kgp dev` in the background (port 8888) and smoke-test pages, the SPA fallback, word files, headers and the reserved /api path. Stop kgp dev afterwards. No .env.kgp-dev is needed because there are no functions.</description>
        <files/>
        <pseudocode>
kgp dev   (run_in_background; wait until http://localhost:8888/ answers)
B=http://localhost:8888
curl -s -o /dev/null -w '%{http_code}' $B/                      # 200
curl -s $B/lobby | grep -q '&lt;div id="root"'                     # SPA fallback serves index.html
curl -s -o /dev/null -w '%{http_code}' $B/words/animals.json    # 200
curl -s $B/words/animals.json | python3 -c 'import json,sys;json.load(sys.stdin)'
curl -s -o /dev/null -w '%{http_code}' $B/privacy.html          # 200
curl -sI $B/sitemap.xml | grep -qi 'max-age=3600'
curl -sI $B/ | grep -qi 'x-frame-options: DENY'
curl -sI $B/ | grep -i 'permissions-policy' | grep -vq 'payment'
curl -s -o /dev/null -w '%{http_code}' $B/api/anything          # 404 (no functions)
# stop kgp dev (TaskStop / kill the background job)
        </pseudocode>
        <acceptance-criteria>
          <criterion>Every curl check above passes (record each result in the execution log)</criterion>
          <criterion>`lsof -ti :8888` prints nothing after the task (kgp dev stopped)</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>dist/ ready to deploy</expects>
          <produces>Local smoke test passed</produces>
        </handoff>
      </task>
    </tasks>
  </phase>

  <phase id="3" name="Deploy and publish">
    <description>Draft deploy, publish behind an owner gate, then verify live.</description>
    <tasks>
      <task id="3.1" agent="devops-engineer" effort="S" value="H" timeout="extended">
        <description>Check status, then create a draft (unpublished) release. Report the deploy_id. On exit 5, re-run the same command. On exit 7 `secret_in_build`, STOP and report.</description>
        <files/>
        <pseudocode>
kgp status --json --yes          # expect no live release yet
kgp deploy --json --yes          # builds, uploads, creates a ready release
# capture deploy_id from stdout JSON
        </pseudocode>
        <acceptance-criteria>
          <criterion>`kgp deploy --json --yes` exits 0 and stdout contains a `deploy_id`</criterion>
          <criterion>`kgp releases list --json --yes` lists that deploy_id as ready and unpublished</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Local smoke test passed</expects>
          <produces>DEPLOY_ID</produces>
        </handoff>
      </task>

      <task id="3.2" agent="devops-engineer" effort="S" value="H" timeout="extended">
        <description>OWNER GATE. Ask: "Publish release DEPLOY_ID to https://imposter.sitepage.app now?" Publish only on yes. Read `verification`. If it failed and `details.state` is not `rolled_back`, run `kgp rollback --json --yes` and STOP with a report of the failed checks.</description>
        <files/>
        <pseudocode>
kgp releases publish DEPLOY_ID --json --yes
# verification.ok must be true
        </pseudocode>
        <acceptance-criteria>
          <criterion>The publish command exits 0 and `verification` reports success</criterion>
          <criterion>`kgp status --json --yes` shows DEPLOY_ID as the live release</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>DEPLOY_ID</expects>
          <produces>Live release</produces>
        </handoff>
      </task>

      <task id="3.3" agent="qa-engineer" effort="M" value="H" timeout="extended">
        <description>Verify the live site over HTTPS with the same checks as 2.2, plus the release header and the PWA files. If the certificate is still being issued, wait and retry (up to about 10 minutes). Never use http://.</description>
        <files/>
        <pseudocode>
B=https://imposter.sitepage.app
curl -sI $B/ | grep -qi '^x-kgp-release:'
curl -s -o /dev/null -w '%{http_code}' $B/                       # 200
curl -s $B/lobby | grep -q '&lt;div id="root"'
for c in $(ls public/words | sed 's/.json//'); do curl -s -o /dev/null -w "$c %{http_code}\n" $B/words/$c.json; done   # all 200
curl -s -o /dev/null -w '%{http_code}' $B/sw.js                  # 200
curl -s -o /dev/null -w '%{http_code}' $B/manifest.webmanifest   # 200
curl -sI $B/ | grep -qi 'strict-transport-security'
curl -sI $B/sitemap.xml | grep -qi 'max-age=3600'
curl -sI $B/ | grep -i 'permissions-policy' | grep -vq 'payment'
! curl -s $B/_headers | grep -q 'max-age=3600'                  # _headers is compiled, never served (SPA may answer index.html)
kgp instance doctor --json --yes   # report any failing check for site imposter (read-only)
        </pseudocode>
        <acceptance-criteria>
          <criterion>All checks above pass. All 16 word files return 200.</criterion>
          <criterion>Results table recorded in the execution log</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Live release</expects>
          <produces>Verified live site</produces>
        </handoff>
      </task>
    </tasks>
  </phase>

  <phase id="4" name="Handover">
    <description>Report owner follow-ups, update docs, and commit.</description>
    <tasks>
      <task id="4.1" agent="project-coordinator" effort="S" value="H" timeout="default">
        <description>Write the owner follow-up list for the final report. Do NOT change Stripe or DNS (D1, D6). Items: (a) Stripe Payment Link "After payment" redirect: today it should point at https://theimpostergame.online/?session=success&amp;method=stripe. Switch it to https://imposter.sitepage.app/?session=success&amp;method=stripe only when players move, because premium activates on whichever origin Stripe returns to. (b) theimpostergame.online: when ready, either `kgp domains add theimpostergame.online --site imposter --primary` (owner) and set the printed DNS records, or add a Netlify redirect to the new address. Keep Netlify running until DNS and the certificate are confirmed. (c) If the domain is retired, update canonical/OG/JSON-LD URLs in index.html and public/sitemap.xml + public/robots.txt (D2).</description>
        <files/>
        <pseudocode>Collect items (a)–(c) for the final report. No commands.</pseudocode>
        <acceptance-criteria>
          <criterion>The final report contains a "Waiting on owner" section listing items (a), (b) and (c) with exact URLs/commands</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Verified live site</expects>
          <produces>Owner follow-up list</produces>
        </handoff>
      </task>

      <task id="4.2" agent="document-specialist" effort="M" value="M" timeout="default">
        <description>Update deployment docs. CLAUDE.md "Deployment" section: replace the Netlify subsection with KGP Host (site `imposter`, https://imposter.sitepage.app, `kgp deploy --json --yes` draft, publish on request, `kgp rollback --json --yes`, build values in .env.production) and note that netlify.toml is kept while theimpostergame.online is still on Netlify. Also update the tech stack line "Deployment: Netlify". README.md "Deployment" section: same, briefly. DEPLOYMENT_CHECKLIST.md: add a "KGP Host" section with the deploy/publish/verify/rollback steps. Match each file's existing tone and heading style.</description>
        <files>
          <file action="modify">CLAUDE.md</file>
          <file action="modify">README.md</file>
          <file action="modify">DEPLOYMENT_CHECKLIST.md</file>
        </files>
        <pseudocode>
### KGP Host (imposter.sitepage.app)
- Config: `kgp.toml` (site `imposter`, SPA mode, headers). Build values: `.env.production`.
- Draft: `npm run build &amp;&amp; kgp deploy --json --yes` → note `deploy_id`
- Publish (only when intended): `kgp releases publish DEPLOY_ID --json --yes`
- Roll back: `kgp rollback --json --yes`
- Netlify still serves theimpostergame.online until the domain is moved.
        </pseudocode>
        <acceptance-criteria>
          <criterion>`test -z "$(grep -L 'imposter.sitepage.app' CLAUDE.md README.md DEPLOYMENT_CHECKLIST.md)"` exits 0</criterion>
          <criterion>`grep -q 'kgp rollback' CLAUDE.md` exits 0</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Verified live site</expects>
          <produces>Updated docs</produces>
        </handoff>
      </task>

      <task id="4.3" agent="devops-engineer" effort="S" value="M" timeout="extended">
        <description>Run the full gate, then commit on the work branch. Ask before pushing or opening a PR (owner gate).</description>
        <files/>
        <pseudocode>
npm run type-check &amp;&amp; npm run lint &amp;&amp; npx vitest run
git add kgp.toml public/_headers .env.production .gitignore CLAUDE.md README.md DEPLOYMENT_CHECKLIST.md
git commit -m "Move hosting to KGP Host (imposter.sitepage.app)

- kgp.toml from netlify.toml (SPA, headers; drop Cache-Control and payment=())
- public/_headers for sitemap/robots caching
- committed .env.production with public VITE_* build values
- deployment docs

Co-Authored-By: Claude Opus 5.5 &lt;noreply@anthropic.com&gt;"
        </pseudocode>
        <acceptance-criteria>
          <criterion>`git status --porcelain` is empty after the commit</criterion>
          <criterion>`git log -1 --name-only` lists kgp.toml and .env.production</criterion>
        </acceptance-criteria>
        <handoff>
          <expects>Updated docs + Owner follow-up list</expects>
          <produces>Committed branch chore/kgp-hosting-migration</produces>
        </handoff>
      </task>
    </tasks>
  </phase>

</phases>

<validation>
  <level name="syntax" run-after="each-task">
    <command>npm run type-check</command>
    <command>npm run lint</command>
  </level>

  <level name="unit" run-after="phase">
    <command>npx vitest run</command>
  </level>

  <level name="integration" run-after="all">
    <command>npm run build</command>
    <command>kgp status --json --yes</command>
    <command>curl -sfI https://imposter.sitepage.app/ | grep -qi '^x-kgp-release:'</command>
    <command>curl -sf https://imposter.sitepage.app/lobby | grep -q '&lt;div id="root"'</command>
    <command>curl -sf https://imposter.sitepage.app/words/animals.json | python3 -c 'import json,sys;json.load(sys.stdin)'</command>
  </level>
</validation>

<success-criteria>
  <criterion priority="P0">https://imposter.sitepage.app/ returns 200 with an X-KGP-Release header matching the published DEPLOY_ID</criterion>
  <criterion priority="P0">Deep link /lobby serves index.html. All 16 /words/*.json return 200 valid JSON.</criterion>
  <criterion priority="P0">Nothing was published, created, or written with an owner-only command without the user's explicit yes at that gate</criterion>
  <criterion priority="P0" verify="adversarial">No secret is in kgp.toml, .env.production, dist/, or any chat message. .env.production holds only VITE_* keys.</criterion>
  <criterion priority="P0">theimpostergame.online (Netlify) is unchanged and still returns 200</criterion>
  <criterion priority="P1">Live Permissions-Policy has no `payment=()`. sitemap.xml and robots.txt have max-age=3600. No site-wide Cache-Control override.</criterion>
  <criterion priority="P1">Deployment docs updated. The work is committed on chore/kgp-hosting-migration.</criterion>
</success-criteria>

<anti-patterns>
  <avoid>Running `kgp deploy --prod`, `kgp releases publish`, `kgp sites create`, `kgp migrate netlify --write`, or `kgp domains add` without asking at that moment</avoid>
  <avoid>Touching DNS, the Netlify site, netlify.toml, or the Stripe dashboard</avoid>
  <avoid>Copying every Netlify per-extension `immutable` cache rule into _headers</avoid>
  <avoid>Adding .htaccess, PHP, or a Strict-Transport-Security header</avoid>
  <avoid>Printing .env values in chat (list names only)</avoid>
  <avoid>Using http:// for sitepage.app checks</avoid>
  <avoid>Fixing unrelated pre-existing test/lint failures inside this PRP</avoid>
</anti-patterns>

</prp>
```
