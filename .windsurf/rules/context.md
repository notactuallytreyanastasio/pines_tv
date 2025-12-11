---
trigger: always_on
description: Context recovery - query decision graph at session start or when recovering from context loss
---

<context_recovery>

# Context Recovery

When starting a session or recovering context, query the decision graph:

<session_start>
```bash
# 1. See what decisions exist (look for recent/pending)
deciduous nodes

# 2. See how they connect
deciduous edges

# 3. Check git state
git status
git log --oneline -10
```
</session_start>

## After Querying, Report:

1. Current branch and pending changes
2. Recent decisions (especially pending/active ones)
3. Last actions from the command log
4. Suggested next steps

<important>
The decision graph survives context loss. Query it whenever you need to understand
what was decided previously. Then continue logging per the deciduous.md rule.
</important>

</context_recovery>