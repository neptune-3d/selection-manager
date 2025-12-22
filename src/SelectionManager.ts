import type { SelectionManagerProps, SelectionRangeMode } from "./types";

/**
 * Manages selection state and logic for a list of items.
 *
 * The SelectionManager tracks which keys are currently selected,
 * the anchor key used for range selections, and the last key
 * that was interacted with. It provides methods for handling
 * pointer and keyboard interactions in a way that mirrors common
 * UI conventions (click, shift‑click, ctrl‑click, etc.).
 */
export class SelectionManager {
  /**
   * Creates a new SelectionManager.
   *
   * @param props Configuration options for the manager.
   *              Must include a `getKeys` function that returns
   *              the ordered list of all selectable keys. The
   *              order of keys is used to compute ranges.
   */
  constructor(props: SelectionManagerProps) {
    this.getKeys = props.getKeys;
    this.rangeMode = props.rangeMode ?? "replace";
  }

  protected getKeys: () => string[];
  protected rangeMode: SelectionRangeMode;

  protected _selectedKeys: Set<string> = new Set();
  protected _anchorKey: string | null = null;
  protected _lastInteractedKey: string | null = null;

  get selectedKeys(): Set<string> {
    return this._selectedKeys;
  }

  set selectedKeys(keys: Set<string>) {
    this._selectedKeys = keys;
  }

  get anchorKey(): string | null {
    return this._anchorKey;
  }

  set anchorKey(key: string | null) {
    this._anchorKey = key;
  }

  get lastInteractedKey(): string | null {
    return this._lastInteractedKey;
  }

  set lastInteractedKey(key: string | null) {
    this._lastInteractedKey = key;
  }

  /**
   * Checks if there are any selected keys.
   *
   * @returns {boolean} True if at least one key is selected, otherwise false.
   */
  hasSelection(): boolean {
    return this.selectedKeys.size > 0;
  }

  /**
   * Checks if the current selection spans multiple keys.
   *
   * @returns {boolean} True if more than one key is selected, otherwise false.
   */
  isRangeSelection(): boolean {
    return this.selectedKeys.size > 1;
  }

  /**
   * Checks if a specific key is currently selected.
   *
   * @param key The key to check.
   * @returns {boolean} True if the key is selected, otherwise false.
   */
  isKeySelected(key: string): boolean {
    return this.selectedKeys.has(key);
  }

  /**
   * Gets the number of currently selected keys.
   *
   * @returns {number} The count of selected keys.
   */
  getSize(): number {
    return this.selectedKeys.size;
  }

  /**
   * Returns the currently selected keys as an array.
   *
   * @returns {string[]} An array containing all selected keys.
   */
  getSelectedKeysAsArray(): string[] {
    return Array.from(this.selectedKeys);
  }

  /**
   * Retrieves the first key in the current selection.
   *
   * @returns {string | null} The first selected key, or null if no keys are selected.
   */
  getFirstSelectedKey(): string | null {
    const first = this.selectedKeys.values().next();
    return first.done ? null : first.value;
  }

  /**
   * Handles pointer (mouse/touch) down interactions on a given key.
   *
   * Updates `lastInteractedKey` and applies selection behavior
   * based on modifier keys:
   *
   * - **Shift + click**: If an anchor key exists, selects the range
   *   between the anchor and the clicked key.
   * - **Ctrl/Command + click**: Toggles the clicked key in the selection
   *   without affecting other selected keys.
   * - **Plain click**: Selects only the clicked key and sets it as the new anchor.
   *
   * @param key The key that was clicked.
   * @param shiftKey Whether the Shift modifier was pressed.
   * @param ctrlKey Whether the Ctrl/Command modifier was pressed.
   */
  selectOnPointerDown(key: string, shiftKey: boolean, ctrlKey: boolean) {
    this.lastInteractedKey = key;

    if (shiftKey && this.anchorKey) {
      this.selectRange(this.anchorKey, key);
    }
    //
    else if (ctrlKey) {
      this.toggleKey(key);
    }
    //
    else {
      this.selectKey(key);
    }
  }

  /**
   * Handles pointer context menu (right‑click) interactions on a given key.
   *
   * Updates `lastInteractedKey` and sets the selection to only the clicked key.
   * If no anchor key has been established yet, the clicked key becomes the anchor.
   *
   * @param key The key that was right‑clicked.
   */
  selectOnPointerContextMenu(key: string) {
    this.lastInteractedKey = key;

    this.selectedKeys = new Set([key]);

    if (!this.anchorKey) {
      this.anchorKey = key;
    }
  }

  /**
   * Handles keyboard arrow key navigation for selection.
   *
   * Updates `lastInteractedKey` and applies selection behavior
   * based on modifier keys:
   *
   * - **Shift + arrow**: If an anchor key exists, extends the selection
   *   as a range from the anchor to the newly focused key.
   * - **Arrow without Ctrl/Command**: Moves selection to the newly focused key,
   *   replacing any previous selection.
   * - **Arrow with Ctrl/Command**: Only updates `lastInteractedKey` without
   *   altering the selection.
   *
   * @param key The key navigated to with the arrow key.
   * @param shiftKey Whether the Shift modifier was pressed.
   * @param ctrlKey Whether the Ctrl/Command modifier was pressed.
   */
  selectOnKeyboardArrow(key: string, shiftKey: boolean, ctrlKey: boolean) {
    this.lastInteractedKey = key;

    if (shiftKey && this.anchorKey) {
      this.selectRange(this.anchorKey, key);
    }
    //
    else if (!ctrlKey) {
      this.selectKey(key);
    }
  }

  /**
   * Handles keyboard page navigation (Page Up/Page Down) for selection.
   *
   * Updates `lastInteractedKey` and applies selection behavior
   * based on modifier keys:
   *
   * - **Shift + Page key**: If an anchor key exists, extends the selection
   *   as a range from the anchor to the newly focused key.
   * - **Page key without Ctrl/Command**: Moves selection to the newly focused key,
   *   replacing any previous selection.
   * - **Page key with Ctrl/Command**: Only updates `lastInteractedKey` without
   *   altering the selection.
   *
   * @param key The key navigated to with the Page Up/Page Down action.
   * @param shiftKey Whether the Shift modifier was pressed.
   * @param ctrlKey Whether the Ctrl/Command modifier was pressed.
   */
  selectOnKeyboardPage(key: string, shiftKey: boolean, ctrlKey: boolean) {
    this.lastInteractedKey = key;

    if (shiftKey && this.anchorKey) {
      this.selectRange(this.anchorKey, key);
    }
    //
    else if (!ctrlKey) {
      this.selectKey(key);
    }
  }

  /**
   * Handles keyboard Home/End navigation for selection.
   *
   * Updates `lastInteractedKey` and applies selection behavior
   * based on modifier keys:
   *
   * - **Shift + Home/End**: If an anchor key exists, extends the selection
   *   as a range from the anchor to the newly focused key.
   * - **Home/End without Ctrl/Command**: Moves selection to the newly focused key,
   *   replacing any previous selection.
   * - **Home/End with Ctrl/Command**: Only updates `lastInteractedKey` without
   *   altering the selection.
   *
   * @param key The key navigated to with the Home or End action.
   * @param shiftKey Whether the Shift modifier was pressed.
   * @param ctrlKey Whether the Ctrl/Command modifier was pressed.
   */
  selectOnKeyboardHomeEnd(key: string, shiftKey: boolean, ctrlKey: boolean) {
    this.lastInteractedKey = key;

    if (shiftKey && this.anchorKey) {
      this.selectRange(this.anchorKey, key);
    }
    //
    else if (!ctrlKey) {
      this.selectKey(key);
    }
  }

  /**
   * Handles keyboard Space key interactions for selection.
   *
   * Updates `lastInteractedKey` and applies selection behavior
   * based on modifier keys:
   *
   * - **Shift + Space**: If an anchor key exists, extends the selection
   *   as a range from the anchor to the newly focused key.
   * - **Ctrl/Command + Space**: Toggles the clicked key in the selection
   *   without affecting other selected keys.
   * - **Plain Space**: Adds the focused key to the current selection
   *   (without clearing existing selections).
   *
   * @param key The key activated with the Space key.
   * @param shiftKey Whether the Shift modifier was pressed.
   * @param ctrlKey Whether the Ctrl/Command modifier was pressed.
   */
  selectOnKeyboardSpace(key: string, shiftKey: boolean, ctrlKey: boolean) {
    this.lastInteractedKey = key;

    if (shiftKey && this.anchorKey) {
      this.selectRange(this.anchorKey, key);
    }
    //
    else if (ctrlKey) {
      this.toggleKey(key);
    }
    //
    else {
      this.addKey(key);
    }
  }

  /**
   * Selects a single key, replacing any existing selection.
   *
   * Updates `selectedKeys` to contain only the given key, sets
   * `lastInteractedKey` to that key, and optionally updates the
   * anchor key:
   *
   * - By default, the anchor key is set to the selected key.
   * - If `preserveAnchor` is true, the existing anchor key is retained.
   *
   * @param key The key to select.
   * @param preserveAnchor Whether to keep the current anchor key instead of updating it.
   */
  selectKey(key: string, preserveAnchor: boolean = false) {
    this.selectedKeys = new Set([key]);
    if (!preserveAnchor) {
      this.anchorKey = key;
    }
    this.lastInteractedKey = key;
  }

  /**
   * Toggles the selection state of a single key.
   *
   * If the key is already selected, it is removed from the selection.
   * If the key is not selected, it is added to the selection.
   * Updates `lastInteractedKey` to the toggled key.
   *
   * @param key The key to toggle in the selection.
   */
  toggleKey(key: string) {
    const next = new Set(this.selectedKeys);
    if (next.has(key)) {
      next.delete(key);
    }
    //
    else {
      next.add(key);
    }
    this.selectedKeys = next;
    this.lastInteractedKey = key;
  }

  /**
   * Adds a key to the current selection without clearing existing selections.
   *
   * Updates `selectedKeys` to include the given key, sets the anchor key
   * to the newly added key, and records it as the `lastInteractedKey`.
   *
   * @param key The key to add to the selection.
   */
  addKey(key: string) {
    const next = new Set(this.selectedKeys);
    next.add(key);
    this.selectedKeys = next;
    this.anchorKey = key;
    this.lastInteractedKey = key;
  }

  /**
   * Selects a continuous range of keys between two given keys.
   *
   * Uses `getKeyRange` to compute the ordered set of keys from `fromKey`
   * to `toKey`, inclusive. Behavior depends on the configured `rangeMode`:
   *
   * - `"replace"` (default): Replaces the current selection with the new range.
   * - `"add"`: Adds the new range to the existing selection set (union).
   *
   * In both cases, sets the anchor key to `fromKey` and records `toKey`
   * as the `lastInteractedKey`.
   *
   * @param fromKey The starting key of the range.
   * @param toKey The ending key of the range.
   */
  selectRange(fromKey: string, toKey: string) {
    const range = this.getKeyRange(fromKey, toKey);

    if (this.rangeMode === "add") {
      this.selectedKeys = new Set([...this.selectedKeys, ...range]);
    }
    //
    else {
      this.selectedKeys = new Set(range);
    }

    this.anchorKey = fromKey;
    this.lastInteractedKey = toKey;
  }

  /**
   * Clears the entire selection state.
   *
   * Resets `selectedKeys` to an empty set, and sets both
   * `anchorKey` and `lastInteractedKey` to null.
   * Effectively removes all current selections and interaction history.
   */
  clearAll() {
    this.selectedKeys = new Set();
    this.anchorKey = null;
    this.lastInteractedKey = null;
  }

  /**
   * Retrieves a contiguous range of keys between two given keys.
   *
   * Looks up the indices of `fromKey` and `toKey` in the full key list
   * provided by `props.getKeys()`. If either key is not found, returns
   * an empty array. Otherwise, returns all keys between the two indices,
   * inclusive, regardless of their order (handles both forward and backward ranges).
   *
   * @param fromKey The starting key of the range.
   * @param toKey The ending key of the range.
   * @returns {string[]} An array of keys spanning from `fromKey` to `toKey`, inclusive.
   */
  getKeyRange(fromKey: string, toKey: string): string[] {
    const keys = this.getKeys();
    const fromIndex = keys.indexOf(fromKey);
    const toIndex = keys.indexOf(toKey);

    if (fromIndex === -1 || toIndex === -1) return [];

    const [start, end] =
      fromIndex < toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex];

    return keys.slice(start, end + 1);
  }
}
