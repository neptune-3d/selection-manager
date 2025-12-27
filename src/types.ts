/**
 * Props used to configure a SelectionManager instance.
 */
export type SelectionManagerProps = {
  /**
   * Returns the ordered list of all selectable keys.
   *
   * This function should provide a stable array of string identifiers
   * representing the items that can be selected. The order of keys in
   * the array is used by range‑selection logic (e.g. shift‑click or
   * keyboard range selection).
   *
   * @returns {SelectionKey[]} An array of keys in the order they appear in the UI.
   */
  getKeys: () => SelectionKey[];
  /**
   * Determines how range selections are applied when using shift‑based interactions.
   *
   * - `"replace"` (default): Each new range selection replaces the previous selection.
   * - `"add"`: Each new range selection is added to the existing selection set.
   */
  rangeMode?: SelectionRangeMode;
};

export type SelectionRangeMode = "replace" | "add";

export type SelectionKey = string | number;
