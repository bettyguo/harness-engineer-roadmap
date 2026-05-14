# Bootstrapping the Wiki

GitHub wikis have a quirk: the `.wiki.git` repo doesn't exist until someone creates the **first** wiki page through the web UI. This is a GitHub limitation — no API and no `git push` will create it. After the first manual page exists, every subsequent push works as you'd expect.

## The one-time manual step

1. Open <https://github.com/bettyguo/harness-engineer-roadmap/wiki> in a browser.
2. Click **"Create the first page"**.
3. Title it `Home` (you'll overwrite it in step 5).
4. Save (any content is fine — even just the word "placeholder").
5. Back in this repo on your machine, run:

    ```powershell
    cd c:\opensource\harness-engineer-roadmap
    if (Test-Path .wiki) { Remove-Item -Recurse -Force .wiki }
    git clone https://github.com/bettyguo/harness-engineer-roadmap.wiki.git .wiki
    Copy-Item -Path wiki\*.md -Destination .wiki -Force
    cd .wiki
    git add -A
    git -c user.email=jacob.jikun.wu@gmail.com -c user.name=AIR commit -m "seed wiki: Home, What-Is, Reading-Paths, Curation-Bar, Durable-vs-Current, Maintenance-Cadence"
    git push origin HEAD
    cd ..
    ```

That overwrites the placeholder page with the real `Home.md` and adds the five other seed pages.

## Why we keep `wiki/*.md` in the main repo

The seed pages live in `wiki/` so they're versioned alongside the code. They're also editable as ordinary files in PRs (the GitHub Wiki UI accepts pushes; PRs against the main repo against the `wiki/` directory are the curatorial-review path). On wiki rebuilds, copy the latest `wiki/*.md` over the wiki clone and push.

## After the bootstrap

Future updates can use either:

- Direct edits on the Wiki tab (good for small one-off changes by anyone with repo access).
- PRs against `wiki/*.md` in the main repo, followed by the same copy-and-push step above (good for curatorial review and full git history).
