# NOTES.md: Custom W3C Components vs. shadcn/ui (Radix Primitives)

## Overview

This document outlines the architectural differences, accessibility trade-offs, and concrete feature gaps between our hand-crafted, W3C APG-compliant TypeScript components (`Modal`, `Tabs`, `Disclosure`) and the production-grade primitives provided by **shadcn/ui** (backed by Radix UI primitives).

---

## Component-by-Component Analysis

### 1. Modal Dialog

- **Custom Version Approach:**
  - Implemented as a single monolithic component (`Modal.tsx`) accepting props (`isOpen`, `onClose`, `title`, `children`).
  - Uses manual DOM querying (`querySelectorAll`) via `useRef` and event listeners to trap focus and handle the `Escape` key.
  - Renders inline within the standard React component tree hierarchy.
- **shadcn/ui (Radix) Approach:**
  - Uses a **Compound Component pattern** (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, etc.), cleanly separating layout markup from behavior.
  - Automatically mounts overlays via React Portals (`ReactDOM.createPortal`) directly into `document.body`, preventing clipping or stacking context errors from parent containers (`overflow: hidden`, `z-index`, `transform`).
  - Integrates advanced focus locking (`@radix-ui/react-focus-scope`) and scroll locking (`react-remove-scroll`), which compensates for scrollbar width to eliminate layout shift when the modal opens.

### 2. Tabs

- **Custom Version Approach:**
  - Passes a `tabs` data array containing id, label, and content nodes.
  - Manages active tab state and listens to `ArrowLeft` / `ArrowRight` key events to shift focus across the `tablist` ribbon.
- **shadcn/ui (Radix) Approach:**
  - Decouples state via headless primitives, supporting both **automatic activation** (focusing a tab activates it) and **manual activation** (focusing requires `Space`/`Enter` to select).
  - Automatically handles orientation shifts (`vertical` vs `horizontal`) and manages roving `tabindex` attributes seamlessly across dynamic items.

### 3. Disclosure

- **Custom Version Approach:**
  - Uses native `<button>` element paired with `aria-expanded` and a hidden content container.
- **shadcn/ui (Radix) Approach:**
  - Utilizes `@radix-ui/react-collapsible` or accordion primitives, which support smooth height animation measurement (`collapsible` content sizing) and handle disabled states out of the box.

---

## Key Concrete Gaps Identified

1. **Portal Rendering & Stacking Context Isolation:**
   - _Gap:_ Our custom modal renders inline in the DOM tree, making it vulnerable to clipping if a parent wrapper has `overflow: hidden` or restrictive positioning.
   - _shadcn:_ Renders via portal into `document.body` while maintaining React event bubbling context.
2. **Dynamic Focus Scope Management:**
   - _Gap:_ Our custom focus trap relies on a static query of focusable elements when the modal opens. If asynchronous content renders inside the modal later, the focus boundary may desynchronize.
   - _shadcn:_ Utilizes dynamic focus scopes that continually re-evaluate and lock focus within the active layer, even across nested portals or dropdowns.
3. **Scroll Locking & Layout Shift Prevention:**
   - _Gap:_ Opening our custom modal leaves the background body scrollable unless custom CSS body-lock overrides are manually written.
   - _shadcn:_ Automatically locks background scrolling and injects padding-right compensation matching the scrollbar width to prevent page layout jumps.
