# Decision Graph Patches

This directory contains exported decision graph patches for code reviewers to import and analyze the complete decision-making workflow.

## What's Included

- **`media-collection-viewer.json`** - Main feature branch decisions (26 nodes, 31 edges)
- **`alternative-ui-design.json`** - Alternative UI design branch decisions (3 nodes, 3 edges)

## For Code Reviewers: How to Import

### Prerequisites
Install Deciduous:
```bash
# Install via cargo
cargo install deciduous

# Or download from releases
# https://github.com/deciduously/deciduous/releases
```

### Import the Decision Graph

1. **Clone the repository:**
```bash
git clone https://github.com/notactuallytreyanastasio/pines_tv.git
cd pines_tv
```

2. **Import the patches:**
```bash
# Import main feature branch decisions
deciduous diff apply deciduous-patches/media-collection-viewer.json

# Optionally import alternative UI branch
deciduous diff apply deciduous-patches/alternative-ui-design.json
```

3. **View the decision graph:**
```bash
deciduous serve --port 3001
# Open http://localhost:3001 in your browser
```

### What You'll See

The decision graph shows the complete workflow with:
- **33 total nodes** across all branches
- **36 edges** showing decision flow
- **5 phases:** Architecture → Implementation → UI Design → Debugging → Documentation

### Key Decision Points to Review

1. **Node #2:** Architecture choice (standalone vs integrated API client)
   - Decision: Standalone (proven by dual implementation)
   
2. **Nodes #11-15:** Framework implementations
   - Vanilla JS validated the API client design
   - React demonstrated extensibility
   
3. **Node #17:** UI design aesthetic
   - Both colorful and dark minimalist implemented
   
4. **Nodes #22-30:** Debugging journey
   - ES module exports issue
   - React JSX imports issue
   - Both resolved and documented

### Branch Filtering

The graph includes branch tags. Filter by branch in the web UI:
- `feature/media-collection-viewer` - Main work (26 nodes)
- `feature/alternative-ui-design` - UI variant (3 nodes)
- `main` - Initial commit

### CLI Commands

```bash
# View all nodes
deciduous nodes

# View all edges
deciduous edges

# Filter by branch
deciduous nodes --branch feature/media-collection-viewer

# View specific node details
deciduous nodes | grep "Node #2"
```

## Decision Graph Structure

```
Goal (Node #1: Build media collection viewer)
  ↓
Architecture Decision (Node #2)
  ↓ [CHOSEN: Standalone API client]
API Client Implementation (Nodes #3-10)
  ↓
Vanilla JS Implementation (Nodes #11-13) ✅
  ↓
React Implementation (Nodes #14-15) ✅
  ↓
UI Design Exploration (Nodes #16-19)
  ↓
Debugging & Fixes (Nodes #22-30)
  ↓
Documentation & PR (Nodes #25-27)
  ↓
Final Validation (Nodes #31-33) ✅
```

## Why This Matters

The decision graph provides:
- **Complete audit trail** of all architectural choices
- **Rationale** for each decision with evidence
- **Debugging journey** showing problem-solving process
- **Validation points** proving decisions were correct
- **Alternative paths** explored and documented

## Questions?

See the main documentation:
- `README.md` - Project overview
- `IMPLEMENTATION_SUMMARY.md` - Detailed decision analysis
- PR #1 - Complete story with decision evidence

---

**Note:** The patches are idempotent - you can apply them multiple times safely.
