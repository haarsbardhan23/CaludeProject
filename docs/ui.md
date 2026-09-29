# UI Coding Standards

This document defines the rules for building UI anywhere in this project. They apply to every page, layout and feature, with no exceptions.

## The core rule: shadcn/ui components ONLY

**All UI in this project MUST be built exclusively with [shadcn/ui](https://ui.shadcn.com) components.**

- ✅ **ONLY** use shadcn/ui components for UI.
- ❌ **ABSOLUTELY NO** custom UI components may be created.
- ❌ **NO** other component libraries (MUI, Chakra, Ant Design, Mantine, Headless UI, etc.).
- ❌ **NO** hand-rolled replacements for things shadcn/ui already provides (buttons, inputs, dialogs, dropdowns, cards, tables, tooltips, and so on).

If a piece of UI is needed, the answer is always: **find the shadcn/ui component for it and install it.**

## Project configuration

shadcn/ui is already set up (see `components.json`):

| Setting        | Value               |
| -------------- | ------------------- |
| Style          | `base-nova`         |
| Base color     | `neutral`           |
| CSS variables  | enabled             |
| Global CSS     | `app/globals.css`   |
| Icon library   | `lucide`            |
| UI components  | `@/components/ui`   |
| Utils (`cn`)   | `@/lib/utils`       |

Do not change these settings without team agreement.

## Adding a component

Always add components through the shadcn CLI. Never copy-paste component code from elsewhere or write it by hand.

```bash
npx shadcn@latest add <component>
# e.g.
npx shadcn@latest add card dialog input
```

Components are generated into `components/ui/`. Before adding, check whether the component already exists there.

## Using components

Import shadcn/ui components from the `@/components/ui` alias:

```tsx
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button variant="outline">Save</Button>;
}
```

- Use the component's built-in **variants and sizes** (e.g. `variant="destructive"`, `size="sm"`) rather than restyling it.
- Compose pages by **combining shadcn/ui components directly** in route files (`app/**/page.tsx`, `layout.tsx`).
- Use **`lucide-react`** for icons, as configured in `components.json`.

## What is NOT allowed

- ❌ Creating new files of reusable UI components (e.g. `components/MyButton.tsx`, `components/CustomCard.tsx`).
- ❌ Wrapping shadcn/ui components in custom components to change their look or behaviour.
- ❌ Building UI elements from raw HTML + Tailwind when a shadcn/ui component exists for that purpose (e.g. a styled `<button>` or `<input>`).
- ❌ Installing or importing any third-party UI component library.
- ❌ Editing the design of generated files in `components/ui/` to create a "custom" variant of a component.

## Styling

- Styling is Tailwind CSS v4 with shadcn/ui's CSS-variable theme defined in `app/globals.css`.
- Use Tailwind utility classes only for **layout and spacing** around shadcn/ui components (e.g. `flex`, `grid`, `gap-4`, `p-6`, `max-w-*`).
- Use the theme tokens (`bg-background`, `text-muted-foreground`, `border`, etc.) instead of hard-coded colours.
- Merge classes with `cn()` from `@/lib/utils` when passing `className` to a component.

## If no shadcn/ui component fits

Do **not** create a custom component. Instead:

1. Check the full shadcn/ui component list and blocks at <https://ui.shadcn.com/docs/components>.
2. Compose the requirement from existing shadcn/ui components.
3. If it still can't be built, raise it with the team before writing any UI code.

## Review checklist

Before submitting UI changes, confirm:

- [ ] Every UI element comes from a shadcn/ui component in `components/ui/`.
- [ ] No new custom UI component files were created.
- [ ] Any new components were added via `npx shadcn@latest add`.
- [ ] No other UI libraries were introduced.
- [ ] Colours use theme tokens, and Tailwind is used only for layout and spacing.
