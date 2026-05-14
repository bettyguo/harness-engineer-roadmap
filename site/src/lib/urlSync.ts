// URL fragment <-> active node id sync. Uses location.hash so the page
// is sharable: <site>/#node/<id> opens that node's panel on load.

export function readActiveNodeFromUrl(): string | null {
  const hash = window.location.hash;
  const match = /^#node\/([a-z0-9.-]+)/i.exec(hash);
  return match ? match[1] : null;
}

export function writeActiveNodeToUrl(nodeId: string | null): void {
  if (nodeId === null) {
    if (window.location.hash) {
      // remove the fragment without scrolling
      const url = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", url);
    }
    return;
  }
  const next = `#node/${nodeId}`;
  if (window.location.hash !== next) {
    window.history.replaceState(null, "", next);
  }
}

export function subscribeHash(cb: (id: string | null) => void): () => void {
  const handler = () => cb(readActiveNodeFromUrl());
  window.addEventListener("hashchange", handler);
  return () => window.removeEventListener("hashchange", handler);
}
