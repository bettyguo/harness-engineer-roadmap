# GitHub repo setup script.
#
# Runs after `gh auth login` has completed. Idempotent — safe to re-run.
#
# Creates / configures the repo `bettyguo/harness-engineer-roadmap`:
#   - Creates the repo if missing.
#   - Pushes main.
#   - Sets the description, homepage, topics.
#   - Enables Discussions, Wiki, Issues.
#   - Enables GitHub Pages (source: GitHub Actions).
#   - Applies the labels manifest from .github/labels.json.
#   - Pushes the wiki seed pages from wiki/ to the repo's wiki.
#
# Usage:
#   cd c:\opensource\harness-engineer-roadmap
#   .\scripts\github-setup.ps1
#
# Prereqs:
#   - gh.exe authenticated (`gh auth login` done)
#   - The fine-grained PAT must have: Administration RW, Contents RW,
#     Issues RW, Pages RW, Workflows RW, Metadata R, Discussions RW.

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

$GH = "C:\Program Files\GitHub CLI\gh.exe"
$REPO = "bettyguo/harness-engineer-roadmap"
$DESCRIPTION = "An interactive roadmap for harness engineering — building the agent loop, tool layers, context engineering, memory, retrieval, eval harnesses, and the rest of the scaffolding around modern LLMs."
$HOMEPAGE = "https://bettyguo.github.io/harness-engineer-roadmap/"
$TOPICS = @(
  "harness-engineering","agent-harness","context-engineering",
  "agent-infrastructure","agentops","llm-agents","agent-frameworks","roadmap"
)

function Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }

Step "Verifying gh auth"
& $GH auth status 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) { throw "gh is not authenticated. Run 'gh auth login' first." }

Step "Ensuring repo $REPO exists"
$repoExists = $false
try {
  & $GH repo view $REPO --json name 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { $repoExists = $true }
} catch { $repoExists = $false }
if (-not $repoExists) {
  Step "Creating $REPO (public)"
  & $GH repo create $REPO --public --description $DESCRIPTION --homepage $HOMEPAGE --disable-issues=$false --disable-wiki=$false
  if ($LASTEXITCODE -ne 0) { throw "repo create failed" }
} else {
  Write-Host "    repo already exists; updating metadata"
  & $GH repo edit $REPO --description $DESCRIPTION --homepage $HOMEPAGE
}

Step "Ensuring origin remote points to $REPO"
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
  git remote add origin "https://github.com/$REPO.git"
} elseif ($remoteUrl -notmatch "harness-engineer-roadmap") {
  git remote set-url origin "https://github.com/$REPO.git"
}

Step "Pushing main"
git push -u origin main

Step "Setting repo topics"
& $GH repo edit $REPO --add-topic ($TOPICS -join ",")

Step "Enabling Issues, Wiki, Discussions, Projects"
& $GH api -X PATCH "repos/$REPO" `
  -F has_issues=true `
  -F has_wiki=true `
  -F has_discussions=true `
  -F has_projects=true `
  -F allow_squash_merge=true `
  -F allow_merge_commit=false `
  -F allow_rebase_merge=true `
  -F delete_branch_on_merge=true | Out-Null

Step "Enabling GitHub Pages (source: GitHub Actions)"
# 409 if already enabled — ignore.
$pagesBody = '{"build_type":"workflow"}'
try {
  $pagesBody | & $GH api -X POST "repos/$REPO/pages" --input - 2>&1 | Out-Host
} catch { Write-Host "    (pages may already be enabled — continuing)" }

Step "Applying labels from .github/labels.json"
$labels = Get-Content -Raw -Path .github/labels.json | ConvertFrom-Json
foreach ($l in $labels) {
  $payload = @{ name = $l.name; color = $l.color; description = $l.description } | ConvertTo-Json -Compress
  # try create, fall back to update
  $payload | & $GH api -X POST "repos/$REPO/labels" --input - 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) {
    $encoded = [Uri]::EscapeDataString($l.name)
    $payload | & $GH api -X PATCH "repos/$REPO/labels/$encoded" --input - 2>$null | Out-Null
  }
  Write-Host "    label: $($l.name)"
}

Step "Seeding the wiki from wiki/"
$wikiDir = ".wiki"
if (Test-Path $wikiDir) {
  Remove-Item -Recurse -Force $wikiDir
}
git clone "https://github.com/$REPO.wiki.git" $wikiDir 2>&1 | Out-Host
if (-not (Test-Path $wikiDir)) {
  # wiki repo doesn't exist until first edit on github — create an empty one locally and push
  New-Item -ItemType Directory -Path $wikiDir | Out-Null
  Set-Location $wikiDir
  git init | Out-Host
  git checkout -b master | Out-Host
  Set-Location ..
}
Copy-Item -Path wiki\*.md -Destination $wikiDir -Force
Set-Location $wikiDir
git add -A
$diff = git diff --cached --name-only
if ($diff) {
  git -c user.email=jacob.jikun.wu@gmail.com -c user.name=AIR commit -m "seed wiki: Home, What-Is, Reading-Paths, Curation-Bar, Durable-vs-Current, Maintenance-Cadence"
  git push origin HEAD:master 2>&1 | Out-Host
} else {
  Write-Host "    wiki has no changes"
}
Set-Location ..

Step "Done. Final state:"
& $GH repo view $REPO

Write-Host ""
Write-Host "Next steps (manual, if any):" -ForegroundColor Yellow
Write-Host "  - Wait ~3 min for the first Pages deploy to finish (Actions tab)."
Write-Host "  - Visit https://bettyguo.github.io/harness-engineer-roadmap/"
Write-Host "  - Optionally pin the repo on your GitHub profile."
