# Stateful Motion Button

A production-ready interactive button component built with React, TypeScript, Framer Motion, and Tailwind CSS. It replaces abrupt state switches with intentional motion choreography to communicate user actions clearly at every stage of the lifecycle.

## Features & Lifecycle
* **5 Distinct States:** Handles `idle`, `hover`/`focus`, `loading`, `success`, and `error` gracefully.
* **Interruptible Architecture:** Prevents redundant multi-clicks during active loading states.
* **Accessibility First:** Fully keyboard accessible with visible focus rings (`focus-visible`) and complete support for `prefers-reduced-motion` (instantaneous transitions, no motion sickness triggers).
* **High Performance:** Strictly animates compositor-friendly properties (`transform` and `opacity`) to eliminate layout thrashing and maintain a smooth 60fps experience.

## Duration & Easing Rationale
* **State Transitions (250ms, `cubic-bezier(0.4, 0, 0.2, 1)`):** Fast enough to feel instantaneous and responsive, yet unhurried enough for the eye to register the state morph smoothly.
* **Success State (Spring: `stiffness: 400`, `damping: 25`):** Delivers a tactile, rewarding micro-interaction through a subtle overshoot bounce upon successful completion.
* **Error State (Shake keyframes with `0.4s` duration):** Captures user attention immediately without relying on disruptive layout shifts.
