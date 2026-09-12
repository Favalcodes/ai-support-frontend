// src/widgets/entry.tsx
import { createRoot, Root } from "react-dom/client";
import "../styles/get-lync.widget.css";
import { ChatWidgetContainer } from "../components/ChatWidgetContainer";

// Types for options passed by host
export type LyncOpts = {
  companyId: string;
  position?: "bottom-right" | "bottom-left";
  companyName?: string;
  user?: any;
  apiUrl?: string; // optional
  primaryColor?: string;
};

// Render function: mount your existing ChatWidgetContainer into any element
export function renderGetLyncWidget(target: string | HTMLElement, opts: LyncOpts) {
  let container: HTMLElement | null;

  if (typeof target === "string") {
    container = document.getElementById(target);
    if (!container) {
      console.error(`renderGetLyncWidget: element #${target} not found`);
      return;
    }
  } else {
    container = target;
  }

  // Avoid creating multiple roots for the same container
  let root: Root | undefined = (container as any).__getLyncRoot;
  if (!root) {
    root = createRoot(container);
    (container as any).__getLyncRoot = root;
  }

  // Render your top-level ChatWidgetContainer using the same props shape you used
  root.render(
    <ChatWidgetContainer
      companyId={opts.companyId}
      position={opts.position || "bottom-right"}
      companyName={opts.companyName}
      user={opts.user}
    />
  );
}

/**
 * Auto-mount from the page's widget config.
 *
 * There were three incompatible embed contracts in the tree: the install snippet
 * the backend generates sets `window.chatWidgetConfig`, this file read
 * `window.getLyncConfig`, and the loader stub read `window.getLync._config`,
 * which nothing ever set. `chatWidgetConfig` wins because it is the one the
 * backend actually hands to customers; the older name is still accepted so any
 * page already using it keeps working.
 */
export function initGetLyncAutoMount() {
  const cfg =
    (window as any).chatWidgetConfig ||
    (window as any).getLyncConfig ||
    {};

  if (!cfg.companyId) {
    console.error("Chat Widget: companyId is required in window.chatWidgetConfig");
    return;
  }

  // Create the mount point if the host page did not provide one.
  let el = document.getElementById("get-lync-embed-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "get-lync-embed-root";
    document.body.appendChild(el);
  }
  renderGetLyncWidget(el, {
    companyId: cfg.companyId,
    position: cfg.position,
    companyName: cfg.companyName,
    user: cfg.user,
    apiUrl: cfg.apiUrl,
    primaryColor: cfg.primaryColor,
  });
}

// Expose a tiny API to window (this file will be built to UMD/IIFE)
declare global {
  interface Window {
    renderGetLyncWidget?: typeof renderGetLyncWidget;
    getLync?: any;
    getLyncConfig?: any;
    chatWidgetConfig?: any;
  }
}

// Attach to window when module runs
if (typeof window !== "undefined") {
  window.renderGetLyncWidget = renderGetLyncWidget;
  window.getLync = {
    render: (target: string | HTMLElement, opts: LyncOpts) => renderGetLyncWidget(target, opts),
    initAuto: () => initGetLyncAutoMount(),
    config: (c: Partial<LyncOpts>) => { window.getLyncConfig = { ...(window.getLyncConfig || {}), ...c } }
  };

  // Mount straight away when the page already declared a config, so embedding is
  // just two script tags with no manual init call.
  if (window.chatWidgetConfig || window.getLyncConfig) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => initGetLyncAutoMount());
    } else {
      initGetLyncAutoMount();
    }
  }
}
