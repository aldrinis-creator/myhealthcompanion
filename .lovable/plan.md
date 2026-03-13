
Restore Troubleshooting Plan (March 10 state)

1) Confirm we are restoring the correct snapshot
- In History, pick the entry from March 10 that is clearly before the unwanted changes.
- If there are multiple March 10 entries, start with the earliest one.

2) Run restore correctly (both device paths)
- Desktop: Plus (+) in chat input → History (or clock icon in top nav) → select March 10 entry → click Restore.
- Mobile: switch to Preview mode → clock icon bottom-left (or ... menu bottom-right → History) → select March 10 entry → tap Restore.

3) Verify restore actually applied
- Immediately check one “known changed” screen (you are on /dashboard now).
- If visuals/content are unchanged, repeat restore using a different March 10 entry (timezone/order can make the wrong snapshot look identical).

4) Push restored version live
- Restore only updates editor state first.
- Click Publish → Update so the published URL reflects the restored snapshot.

5) If restore still appears to do nothing
- Hard refresh preview (Cmd/Ctrl+Shift+R) and reopen History.
- Test in an incognito/private window to bypass cached assets.
- Use chat-message-level Revert on the message right before unwanted edits as a fallback path.

Clarification needed from you before final recovery execution
- Are you on desktop or mobile right now?
- After pressing Restore, do you see any toast/confirmation, or absolutely nothing?
- Does Preview URL change behavior while Published URL stays old, or are both unchanged?

Technical details
- Restoring from History swaps project code snapshot; it can appear like “nothing happened” if the selected snapshot matches current state.
- Published site does not change until Publish → Update is clicked.
- Snapshot ordering can differ by timezone, so nearby entries on March 10 may be required to find the exact original state.
