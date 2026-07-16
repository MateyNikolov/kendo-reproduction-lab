# Kendo Examples for Bug reproduction

### --- Virtual Scrolling Edit-Row Desync --- Branch -> main

**Description** When using `[scrollable]="'virtual'"` with internal editing, an active edit row becomes unstable if the user scrolls far enough to trigger a virtualization recycle (moving the edit-row index out of the current DOM buffer).

Upon scrolling back to the top, the edit row "flashes" or flickers at the top of the viewport during the scroll momentum and only stabilizes once the scroll position reaches the actual index where the row was added.

**Steps to Reproduce:**
1. Run `npm install` and `npx ng serve`.
2. Open the application at http://localhost:4269.
3. Click the "Add New Row" button in the toolbar. (An empty edit row appears at the top).
4. **Important:** Do not click Save or Cancel. Leave the editor open.
5. Scroll down rapidly for 3-4 "pages" (approx. 150-200 rows).
6. Attempt to scroll back up to the top.

**Expected Behavior** The edit row should remain "virtualized" out of view until the user returns to the top of the grid, where it should re-render stably.

**Actual Behavior** The edit row flickers at the top of the grid container during the upward scroll momentum.

### --- Drag & Drop Index Offset with Virtual Scrolling and Border-Spacing --- Branch -> grid-row-including-border-spacing 

**Description** When using virtual scrolling and interacting with a row (e.g., initiating a drag, or simply selecting a row) selects the wrong data index if CSS border-spacing is applied to the Grid's table element.

The Virtual Scroller calculates the total height based on standard row height, ignoring the border-spacing gaps. This discrepancy causes a pixel-to-index mismatch, resulting in the Grid grabbing an entirely different row than the one the user interacted with.

**Steps to Reproduce:**
1. Run `npm install` and `npx ng serve`.
2. Open the application at http://localhost:4269.
3. Scroll down into the virtualized data - page >= 2 (e.g., to Element 135).
4. Try to click a specific row (e.g., Element 129).

**Expected Behavior** The Grid should correctly identify the clicked row (Element 135), maintain its active index, and allow the user to drag or select the intended row without layout jumps or index desyncs.

**Actual Behavior** The Grid recalculates the index based on the mismatched virtual height, resulting in the wrong row. Also after that if the user at bottom of the pages it is hard to get to the top, because selected row blocks the scrolling mechanism.


