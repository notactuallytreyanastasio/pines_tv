---
trigger: always_on
description: Decision graph workflow - log all goals, decisions, actions, and outcomes in real-time using deciduous CLI
---

<decision_graph_workflow>

# Decision Graph Workflow

This project uses Deciduous for persistent decision tracking. You MUST log decisions in real-time.

## MANDATORY: Log These Events

<logging_triggers>
- **New feature request** → `deciduous add goal "Feature name" -c 90`
- **Choosing between approaches** → `deciduous add decision "What to decide" -c 75`
- **Considering an option** → `deciduous add option "Option name" -c 70`
- **About to write code** → `deciduous add action "What you're implementing" -c 85`
- **Noticed something** → `deciduous add observation "What you found" -c 80`
- **Something completed** → `deciduous add outcome "Result" -c 95`
</logging_triggers>

## MANDATORY: The Feedback Loop

<workflow>
1. USER REQUEST → Log goal/decision FIRST (before any code)
2. BEFORE coding → Log action
3. AFTER changes → Log outcome + link nodes
4. BEFORE git push → Run `deciduous sync`
</workflow>

## Commands

<commands>
```bash
# Add nodes (with confidence 0-100)
deciduous add goal "Title" -c 90
deciduous add decision "Title" -c 75
deciduous add action "Title" -c 85
deciduous add outcome "Title" -c 95
deciduous add observation "Title" -c 80

# Optional metadata flags for nodes
# -p, --prompt "..."   Store the user prompt that triggered this
# -f, --files "a.rs,b.rs"   Associate files with this node
# -b, --branch <name>   Git branch (auto-detected)
# --commit <hash>   Link to a git commit

# Example with prompt and files
deciduous add goal "Add auth" -c 90 -p "User asked: add login feature" -f "src/auth.rs,src/routes.rs"

# Filter by branch
deciduous nodes --branch main
deciduous nodes --branch feature-x

# Link nodes together
deciduous link <from> <to> -r "reason"
deciduous link 1 2 --edge-type chosen -r "Selected this approach"

# View current graph
deciduous nodes
deciduous edges

# Sync before pushing
deciduous sync
```
</commands>

## Branch-Based Grouping

<branch_grouping>
**Nodes are automatically tagged with the current git branch.**

Configure in `.deciduous/config.toml`:
```toml
[branch]
main_branches = ["main", "master"]
auto_detect = true
```

### CLI Commands
```bash
deciduous nodes --branch main       # Filter by branch
deciduous add goal "X" -b feature-x # Override branch
deciduous add goal "X" --no-branch  # No branch tag
```

### Web UI
Branch dropdown filter in stats bar filters all views.
</branch_grouping>

## Edge Types

<edge_types>
- `leads_to` - Natural progression (default)
- `chosen` - Selected this option
- `rejected` - Did not select (include why!)
- `requires` - Dependency
- `blocks` - Preventing progress
- `enables` - Makes possible
</edge_types>

## ⚠️ CRITICAL: Maintain Connections

<connection_rules>
**The graph's value is in its CONNECTIONS, not just nodes.**

| When you create... | IMMEDIATELY link to... |
|-------------------|------------------------|
| `outcome` | The action/goal it resolves |
| `action` | The goal/decision that spawned it |
| `option` | Its parent decision |
| `observation` | Related goal/action |

**Root `goal` nodes are the ONLY valid orphans.**

### Audit Before Every Sync
1. Does every **outcome** link to what caused it?
2. Does every **action** link to why you did it?
3. Any **dangling outcomes** without parents?
</connection_rules>

## Multi-User Sync

<multi_user_sync>
Share decisions across teammates:

```bash
# Export your branch's decisions
deciduous diff export --branch feature-x -o .deciduous/patches/my-feature.json

# Apply patches from teammates (idempotent)
deciduous diff apply .deciduous/patches/*.json

# Preview before applying
deciduous diff apply --dry-run .deciduous/patches/teammate.json
```

PR workflow: Export patch → commit patch file → PR → teammates apply.
</multi_user_sync>

</decision_graph_workflow>