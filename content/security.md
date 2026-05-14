# Security & the Agent Threat Surface

> The new attack surface that agents create. Prompt injection, capability gating, data exfiltration, confidentiality, tool-output poisoning, audit trails, and red-teaming as a continuous practice.


*Area id: `security`*

---

## Prompt injection

`id: security.prompt-injection` · **core**

Direct and indirect injection — the most-shipped vulnerability in agents. Any text the model sees from any source can carry an instruction.

**Competent means:** Can attack their own agent in three ways (direct user input, retrieved document, tool output) and has a defense for each.

**Depends on:** `context.context-poisoning`

**Related:** `security.tool-poisoning`

**Also known as:** prompt injection, indirect prompt injection, jailbreak

**Resources:**

- [Prompt injection: What's the worst that can happen?](https://simonwillison.net/2023/Apr/14/worst-that-can-happen/) — Simon Willison, 2023 · `post` · `beginner` · `free` · ◆ durable *(unverified)*
  - The clearest non-academic walkthrough of the attack surface and the realistic threat model. Required reading; Willison's ongoing index of the topic is the de facto bibliography.

---

## Capability gating & permissions

`id: security.permissions` · **core**

What can the agent do, and on whose behalf? Least-privilege as a default, with explicit elevation when needed.

**Competent means:** Agent runs least-privilege by default. Can enumerate every permission it holds and the justification for each.

**Depends on:** `tools.sandboxing`

**Related:** `security.data-exfiltration`

**Also known as:** least privilege, capability scoping, agent permissions

**Resources:**

- [The Confused Deputy: Re-Examined](https://www.cap-lore.com/CapTheory/ConfusedDeputy.html) — Norm Hardy / canonicalized in capability literature, 1988 · `paper` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The pre-LLM origin of the capability/least-privilege framing. Applies directly to agents: the agent is the confused deputy when it can act on its principal's behalf with the attacker's intent.

---

## Data exfiltration

`id: security.data-exfiltration` · **core**

Side-channel leaks via tool calls, outbound URLs, embeddings, and logs. The model doesn't need a shell to leak — it just needs a tool that can talk to the network.

**Competent means:** Their agent's egress is enumerable (every outbound destination logged) and rate-limited. Knows three exfiltration paths and how each was closed.

**Depends on:** `security.permissions`

**Related:** `security.audit-trail`

**Also known as:** data leak, exfil, side channel

**Resources:**

- [Markdown Image Exfiltration in LLM Agents](https://simonwillison.net/2024/Mar/23/prompt-injection-llm-agents/) — Simon Willison, 2024 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - A specific worked example — markdown-image exfil — that covers the general pattern (any outbound URL is a side channel). Durable because the channel keeps reappearing in new forms.

---

## Confidentiality & PII

`id: security.confidentiality` · *recommended*

Redaction, secrets handling, prompt-leak hygiene. The trace pipeline is often the worst offender, not the agent itself.

**Competent means:** Has a redactor in the trace pipeline that they have tested against synthetic PII. Knows what their LLM provider retains.

**Depends on:** `evals.tracing`

**Related:** `security.audit-trail`

**Also known as:** pii redaction, secrets handling, prompt leak

**Resources:**

- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — OWASP, 2024 · `spec` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The reference taxonomy. Read LLM02 (insecure output handling) and LLM06 (sensitive information disclosure) — durable framing that survives version bumps of the list.

---

## Tool-output poisoning

`id: security.tool-poisoning` · *recommended*

Adversarial content in retrieved docs or tool returns — the indirect-injection surface every retrieval-augmented agent has.

**Competent means:** Distinguishes trusted from untrusted tool outputs in their pipeline and treats untrusted ones as inputs to be sanitized, not instructions to be followed.

**Depends on:** `security.prompt-injection`, `tools.tool-errors`

**Related:** `context.context-poisoning`

**Also known as:** indirect injection, document poisoning

**Resources:**

- [Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection](https://arxiv.org/abs/2302.12173) — Greshake et al., 2023 · `paper` · `advanced` · `free` · ◆ durable *(unverified)*
  - The paper that named indirect prompt injection. Section 3 on attack vectors is required reading for anyone building a retrieval-augmented agent.

---

## Audit trails

`id: security.audit-trail` · *recommended*

Who did what, when, why — provable from logs. The forensic surface that turns a security incident into a recoverable one.

**Competent means:** Their agent's actions are reconstructible months later from structured logs. Has run at least one drill of "given a user report, prove what the agent did."

**Depends on:** `evals.tracing`

**Related:** `security.confidentiality`

**Also known as:** audit log, forensics, action trail

**Resources:**

- [OWASP Top 10 for LLM Applications — LLM09 Overreliance](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — OWASP, 2024 · `spec` · `intermediate` · `free` · ◆ durable *(unverified)*
  - OWASP's framing of audit trails as a defense against overreliance and an enabler of incident response. Durable even as the list version-bumps.

---

## Red-teaming agents

`id: security.red-team` · _optional_

Adversarial eval as continuous discipline. Treats the threat surface like a regression eval — every release runs the attack suite.

**Competent means:** Runs a red-team eval on their agent on a stated cadence and has a backlog of attacks generated by the team (not just imported).

**Depends on:** `security.prompt-injection`, `evals.regression`

**Related:** `reliability.chaos`

**Also known as:** agent red team, adversarial eval

**Resources:**

- [Red Teaming Language Models with Language Models](https://arxiv.org/abs/2202.03286) — Perez et al., 2022 · `paper` · `advanced` · `free` · ◆ durable *(unverified)*
  - The canonical paper on using models to generate red-team inputs. The mechanism (generate, classify, refine) is durable even as model-specific attack catalogues change.

---
