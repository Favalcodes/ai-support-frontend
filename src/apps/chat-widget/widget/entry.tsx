// src/widgets/entry.tsx
import React from "react";
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

// Convenience: auto-mount a default container created by the loader
export function initGetLyncAutoMount() {
  const el = document.getElementById("get-lync-embed-root");
  if (!el) return;
  // read config placed on window by loader
  const cfg = (window as any).getLyncConfig || {};
  if (!cfg.companyId) {
    console.error("getLync: companyId required in getLyncConfig");
    return;
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
}
