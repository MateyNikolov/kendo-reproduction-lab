# Kendo Examples for Bug reproduction

--- Virtual Scrolling Edit-Row Desync ---
Description
When using [scrollable]="'virtual'" with internal editing, an active edit row becomes unstable if the user scrolls far enough to trigger a virtualization recycle (moving the edit-row index out of the current DOM buffer).

Upon scrolling back to the top, the edit row "flashes" or flickers at the top of the viewport during the scroll momentum and only stabilizes once the scroll position reaches the actual index where the row was added.

Steps to Reproduce:
1.Run npm install and npx ng serve.
2.Open the application at http://localhost:4269.
3.Click the "Add New Row" button in the toolbar. (An empty edit row appears at the top).
  Important: Do not click Save or Cancel. Leave the editor open.
4.Scroll down rapidly for 3-4 "pages" (approx. 150-200 rows).
5.Attempt to scroll back up to the top.

Expected Behavior
The edit row should remain "virtualized" out of view until the user returns to the top of the grid, where it should re-render stably.

Actual Behavior
The edit row flickers at the top of the grid container during the upward scroll momentum.
