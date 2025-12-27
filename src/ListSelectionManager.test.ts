import { beforeEach, describe, expect, it, vi } from "vitest";
import { ListSelectionManager } from "./ListSelectionManager";

describe("SelectionManager.selectOnPointerDown", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
    vi.clearAllMocks();

    vi.spyOn(manager, "selectKey");
    vi.spyOn(manager, "toggleKey");
    vi.spyOn(manager, "selectRange");
  });

  it("calls selectKey when no modifiers are pressed", () => {
    manager.selectOnPointerDown("item1", false, false);

    expect(manager.lastInteractedKey).toBe("item1");
    expect(manager.selectKey).toHaveBeenCalledWith("item1");
    expect(manager.toggleKey).not.toHaveBeenCalled();
    expect(manager.selectRange).not.toHaveBeenCalled();
  });

  it("calls toggleKey when ctrlKey is true", () => {
    manager.selectOnPointerDown("item2", false, true);

    expect(manager.lastInteractedKey).toBe("item2");
    expect(manager.toggleKey).toHaveBeenCalledWith("item2");
    expect(manager.selectKey).not.toHaveBeenCalled();
    expect(manager.selectRange).not.toHaveBeenCalled();
  });

  it("calls selectRange when shiftKey is true and anchorKey exists", () => {
    manager.anchorKey = "anchor";
    manager.selectOnPointerDown("item3", true, false);

    expect(manager.lastInteractedKey).toBe("item3");
    expect(manager.selectRange).toHaveBeenCalledWith("anchor", "item3");
    expect(manager.selectKey).not.toHaveBeenCalled();
    expect(manager.toggleKey).not.toHaveBeenCalled();
  });

  it("falls back to selectKey when shiftKey is true but no anchorKey", () => {
    manager.anchorKey = null;
    manager.selectOnPointerDown("item4", true, false);

    expect(manager.lastInteractedKey).toBe("item4");
    expect(manager.selectKey).toHaveBeenCalledWith("item4");
    expect(manager.selectRange).not.toHaveBeenCalled();
    expect(manager.toggleKey).not.toHaveBeenCalled();
  });
});

describe("SelectionManager.selectOnPointerContextMenu", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
  });

  it("sets lastInteractedKey and selectedKeys to the given key", () => {
    manager.selectOnPointerContextMenu("item1");

    expect(manager.lastInteractedKey).toBe("item1");
    expect(Array.from(manager.selectedKeys)).toEqual(["item1"]);
  });

  it("sets anchorKey if it was previously null", () => {
    manager.anchorKey = null;
    manager.selectOnPointerContextMenu("item2");

    expect(manager.anchorKey).toBe("item2");
  });

  it("does not overwrite anchorKey if it already exists", () => {
    manager.anchorKey = "existingAnchor";
    manager.selectOnPointerContextMenu("item3");

    expect(manager.anchorKey).toBe("existingAnchor");
    expect(manager.lastInteractedKey).toBe("item3");
    expect(Array.from(manager.selectedKeys)).toEqual(["item3"]);
  });
});

describe("SelectionManager.selectOnKeyboardArrow", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
    vi.clearAllMocks();

    vi.spyOn(manager, "selectRange");
    vi.spyOn(manager, "selectKey");
  });

  it("calls selectRange when shiftKey is true and anchorKey exists", () => {
    manager.anchorKey = "anchor";
    manager.selectOnKeyboardArrow("item1", true, false);

    expect(manager.lastInteractedKey).toBe("item1");
    expect(manager.selectRange).toHaveBeenCalledWith("anchor", "item1");
    expect(manager.selectKey).not.toHaveBeenCalled();
  });

  it("calls selectKey when no modifiers are pressed", () => {
    manager.selectOnKeyboardArrow("item2", false, false);

    expect(manager.lastInteractedKey).toBe("item2");
    expect(manager.selectKey).toHaveBeenCalledWith("item2");
    expect(manager.selectRange).not.toHaveBeenCalled();
  });

  it("does nothing selection-wise when ctrlKey is true", () => {
    manager.selectOnKeyboardArrow("item3", false, true);

    expect(manager.lastInteractedKey).toBe("item3");
    expect(manager.selectKey).not.toHaveBeenCalled();
    expect(manager.selectRange).not.toHaveBeenCalled();
  });

  it("falls back to selectKey when shiftKey is true but no anchorKey", () => {
    manager.anchorKey = null;
    manager.selectOnKeyboardArrow("item4", true, false);

    expect(manager.lastInteractedKey).toBe("item4");
    expect(manager.selectKey).toHaveBeenCalledWith("item4");
    expect(manager.selectRange).not.toHaveBeenCalled();
  });
});

describe("SelectionManager.selectOnKeyboardPage", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
    vi.clearAllMocks();

    vi.spyOn(manager, "selectRange");
    vi.spyOn(manager, "selectKey");
  });

  it("calls selectRange when shiftKey is true and anchorKey exists", () => {
    manager.anchorKey = "anchor";
    manager.selectOnKeyboardPage("item1", true, false);

    expect(manager.lastInteractedKey).toBe("item1");
    expect(manager.selectRange).toHaveBeenCalledWith("anchor", "item1");
    expect(manager.selectKey).not.toHaveBeenCalled();
  });

  it("calls selectKey when no modifiers are pressed", () => {
    manager.selectOnKeyboardPage("item2", false, false);

    expect(manager.lastInteractedKey).toBe("item2");
    expect(manager.selectKey).toHaveBeenCalledWith("item2");
    expect(manager.selectRange).not.toHaveBeenCalled();
  });

  it("does nothing selection-wise when ctrlKey is true", () => {
    manager.selectOnKeyboardPage("item3", false, true);

    expect(manager.lastInteractedKey).toBe("item3");
    expect(manager.selectKey).not.toHaveBeenCalled();
    expect(manager.selectRange).not.toHaveBeenCalled();
  });

  it("falls back to selectKey when shiftKey is true but no anchorKey", () => {
    manager.anchorKey = null;
    manager.selectOnKeyboardPage("item4", true, false);

    expect(manager.lastInteractedKey).toBe("item4");
    expect(manager.selectKey).toHaveBeenCalledWith("item4");
    expect(manager.selectRange).not.toHaveBeenCalled();
  });
});

describe("SelectionManager.selectOnKeyboardHomeEnd", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
    vi.clearAllMocks();

    vi.spyOn(manager, "selectRange");
    vi.spyOn(manager, "selectKey");
  });

  it("calls selectRange when shiftKey is true and anchorKey exists", () => {
    manager.anchorKey = "anchor";
    manager.selectOnKeyboardHomeEnd("item1", true, false);

    expect(manager.lastInteractedKey).toBe("item1");
    expect(manager.selectRange).toHaveBeenCalledWith("anchor", "item1");
    expect(manager.selectKey).not.toHaveBeenCalled();
  });

  it("calls selectKey when no modifiers are pressed", () => {
    manager.selectOnKeyboardHomeEnd("item2", false, false);

    expect(manager.lastInteractedKey).toBe("item2");
    expect(manager.selectKey).toHaveBeenCalledWith("item2");
    expect(manager.selectRange).not.toHaveBeenCalled();
  });

  it("does nothing selection-wise when ctrlKey is true", () => {
    manager.selectOnKeyboardHomeEnd("item3", false, true);

    expect(manager.lastInteractedKey).toBe("item3");
    expect(manager.selectKey).not.toHaveBeenCalled();
    expect(manager.selectRange).not.toHaveBeenCalled();
  });

  it("falls back to selectKey when shiftKey is true but no anchorKey", () => {
    manager.anchorKey = null;
    manager.selectOnKeyboardHomeEnd("item4", true, false);

    expect(manager.lastInteractedKey).toBe("item4");
    expect(manager.selectKey).toHaveBeenCalledWith("item4");
    expect(manager.selectRange).not.toHaveBeenCalled();
  });
});

describe("SelectionManager.selectOnKeyboardSpace", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
    vi.clearAllMocks();

    vi.spyOn(manager, "selectRange");
    vi.spyOn(manager, "toggleKey");
    vi.spyOn(manager, "addKey");
  });

  it("calls selectRange when shiftKey is true and anchorKey exists", () => {
    manager.anchorKey = "anchor";
    manager.selectOnKeyboardSpace("item1", true, false);

    expect(manager.lastInteractedKey).toBe("item1");
    expect(manager.selectRange).toHaveBeenCalledWith("anchor", "item1");
    expect(manager.toggleKey).not.toHaveBeenCalled();
    expect(manager.addKey).not.toHaveBeenCalled();
  });

  it("calls toggleKey when ctrlKey is true", () => {
    manager.selectOnKeyboardSpace("item2", false, true);

    expect(manager.lastInteractedKey).toBe("item2");
    expect(manager.toggleKey).toHaveBeenCalledWith("item2");
    expect(manager.selectRange).not.toHaveBeenCalled();
    expect(manager.addKey).not.toHaveBeenCalled();
  });

  it("calls addKey when no modifiers are pressed", () => {
    manager.selectOnKeyboardSpace("item3", false, false);

    expect(manager.lastInteractedKey).toBe("item3");
    expect(manager.addKey).toHaveBeenCalledWith("item3");
    expect(manager.selectRange).not.toHaveBeenCalled();
    expect(manager.toggleKey).not.toHaveBeenCalled();
  });

  it("falls back to addKey when shiftKey is true but no anchorKey", () => {
    manager.anchorKey = null;
    manager.selectOnKeyboardSpace("item4", true, false);

    expect(manager.lastInteractedKey).toBe("item4");
    expect(manager.addKey).toHaveBeenCalledWith("item4");
    expect(manager.selectRange).not.toHaveBeenCalled();
    expect(manager.toggleKey).not.toHaveBeenCalled();
  });
});

describe("SelectionManager.selectKey", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
  });

  it("selects a single key and sets anchor/lastInteractedKey by default", () => {
    manager.selectKey("item1");

    expect(Array.from(manager.selectedKeys)).toEqual(["item1"]);
    expect(manager.anchorKey).toBe("item1");
    expect(manager.lastInteractedKey).toBe("item1");
  });

  it("selects a single key but preserves existing anchor when preserveAnchor=true", () => {
    manager.anchorKey = "existingAnchor";
    manager.selectKey("item2", true);

    expect(Array.from(manager.selectedKeys)).toEqual(["item2"]);
    // anchor should remain unchanged
    expect(manager.anchorKey).toBe("existingAnchor");
    expect(manager.lastInteractedKey).toBe("item2");
  });

  it("overwrites anchor when preserveAnchor=false", () => {
    manager.anchorKey = "oldAnchor";
    manager.selectKey("item3", false);

    expect(Array.from(manager.selectedKeys)).toEqual(["item3"]);
    expect(manager.anchorKey).toBe("item3");
    expect(manager.lastInteractedKey).toBe("item3");
  });
});

describe("SelectionManager.toggleKey", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
    manager.selectedKeys = new Set(); // start clean
  });

  it("adds the key when it is not already selected", () => {
    manager.toggleKey("item1");

    expect(Array.from(manager.selectedKeys)).toEqual(["item1"]);
    expect(manager.lastInteractedKey).toBe("item1");
  });

  it("removes the key when it is already selected", () => {
    manager.selectedKeys = new Set(["item2"]);
    manager.toggleKey("item2");

    expect(Array.from(manager.selectedKeys)).toEqual([]);
    expect(manager.lastInteractedKey).toBe("item2");
  });

  it("can add multiple keys over successive calls", () => {
    manager.toggleKey("itemA");
    manager.toggleKey("itemB");

    expect(Array.from(manager.selectedKeys)).toEqual(["itemA", "itemB"]);
    expect(manager.lastInteractedKey).toBe("itemB");
  });

  it("removes one key but keeps others intact", () => {
    manager.selectedKeys = new Set(["itemX", "itemY"]);
    manager.toggleKey("itemX");

    expect(Array.from(manager.selectedKeys)).toEqual(["itemY"]);
    expect(manager.lastInteractedKey).toBe("itemX");
  });
});

describe("SelectionManager.addKey", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
    manager.selectedKeys = new Set(); // start clean
  });

  it("adds a new key to an empty selection", () => {
    manager.addKey("item1");

    expect(Array.from(manager.selectedKeys)).toEqual(["item1"]);
    expect(manager.anchorKey).toBe("item1");
    expect(manager.lastInteractedKey).toBe("item1");
  });

  it("adds a new key to an existing selection", () => {
    manager.selectedKeys = new Set(["itemA"]);
    manager.addKey("itemB");

    expect(Array.from(manager.selectedKeys)).toEqual(["itemA", "itemB"]);
    expect(manager.anchorKey).toBe("itemB");
    expect(manager.lastInteractedKey).toBe("itemB");
  });

  it("does not remove existing keys when adding a new one", () => {
    manager.selectedKeys = new Set(["itemX", "itemY"]);
    manager.addKey("itemZ");

    expect(Array.from(manager.selectedKeys)).toEqual([
      "itemX",
      "itemY",
      "itemZ",
    ]);
    expect(manager.anchorKey).toBe("itemZ");
    expect(manager.lastInteractedKey).toBe("itemZ");
  });

  it("re-adding the same key keeps it in the set and updates anchor/lastInteractedKey", () => {
    manager.selectedKeys = new Set(["item1"]);
    manager.addKey("item1");

    expect(Array.from(manager.selectedKeys)).toEqual(["item1"]);
    expect(manager.anchorKey).toBe("item1");
    expect(manager.lastInteractedKey).toBe("item1");
  });
});

describe("SelectionManager.selectRange", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({ getKeys: () => [] });
    vi.clearAllMocks();

    // Stub getKeyRange to return predictable ranges
    vi.spyOn(manager, "getKeyRange").mockImplementation((from, to) => {
      return [from, to];
    });
  });

  it("sets selectedKeys to the range returned by getKeyRange", () => {
    manager.selectRange("item1", "item3");

    expect(manager.getKeyRange).toHaveBeenCalledWith("item1", "item3");
    expect(Array.from(manager.selectedKeys)).toEqual(["item1", "item3"]);
  });

  it("sets anchorKey to fromKey", () => {
    manager.selectRange("start", "end");
    expect(manager.anchorKey).toBe("start");
  });

  it("sets lastInteractedKey to toKey", () => {
    manager.selectRange("first", "last");
    expect(manager.lastInteractedKey).toBe("last");
  });

  it("works with identical fromKey and toKey", () => {
    manager.getKeyRange = vi.fn().mockReturnValue(["same"]);
    manager.selectRange("same", "same");

    expect(Array.from(manager.selectedKeys)).toEqual(["same"]);
    expect(manager.anchorKey).toBe("same");
    expect(manager.lastInteractedKey).toBe("same");
  });

  it("unions ranges when rangeMode is 'add'", () => {
    manager = new ListSelectionManager({ getKeys: () => [], rangeMode: "add" });
    vi.spyOn(manager, "getKeyRange").mockImplementation((from, to) => [
      from,
      to,
    ]);

    manager.selectedKeys = new Set(["existing"]);
    manager.selectRange("item1", "item3");

    expect(Array.from(manager.selectedKeys)).toEqual([
      "existing",
      "item1",
      "item3",
    ]);
  });
});

describe("SelectionManager.getKeyRange", () => {
  let manager: ListSelectionManager;

  beforeEach(() => {
    manager = new ListSelectionManager({
      getKeys: () => ["item1", "item2", "item3", "item4", "item5"],
    });
  });

  it("returns a forward range when fromKey comes before toKey", () => {
    const range = manager.getKeyRange("item1", "item3");
    expect(range).toEqual(["item1", "item2", "item3"]);
  });

  it("returns a backward range when fromKey comes after toKey", () => {
    const range = manager.getKeyRange("item4", "item2");
    expect(range).toEqual(["item2", "item3", "item4"]);
  });

  it("returns a single-element range when fromKey and toKey are the same", () => {
    const range = manager.getKeyRange("item3", "item3");
    expect(range).toEqual(["item3"]);
  });

  it("returns empty array if fromKey is not found", () => {
    const range = manager.getKeyRange("missing", "item2");
    expect(range).toEqual([]);
  });

  it("returns empty array if toKey is not found", () => {
    const range = manager.getKeyRange("item2", "missing");
    expect(range).toEqual([]);
  });

  it("returns the full range when selecting first to last", () => {
    const range = manager.getKeyRange("item1", "item5");
    expect(range).toEqual(["item1", "item2", "item3", "item4", "item5"]);
  });
});
