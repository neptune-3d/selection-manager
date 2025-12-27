# @neptune3d/selection-manager

Accessible, spec-compliant selection state managers

[![NPM Version](https://img.shields.io/npm/v/%40neptune3d%2Fselection-manager)](https://www.npmjs.com/package/@neptune3d/selection-manager)

```bash
npm install @neptune3d/selection-manager
```

## Usage

```ts
import { ListSelectionManager } from "@neptune3d/selection-manager";

const selection = new ListSelectionManager({
  getKeys: () => ["a", "b", "c"],
});

window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") {
    // get next focused key
    // const focusedKey = ...

    // or e.metaKey instead of e.ctrlKey if on MacOS
    selection.selectOnKeyboardArrow(focusedKey, e.shiftKey, e.ctrlKey);

    // update selection ( and focus ) UI
  }
  //
  else if (e.code === "PageUp") {
    // get next page jump focused key
    // const focusedKey = ...

    selection.selectOnKeyboardPage(focusedKey, e.shiftKey, e.ctrlKey);

    // update selection ( and focus ) UI
  }
});

// update UI

tableRow.classList.toggle("selected", selection.isKeySelected(row.key));
```
