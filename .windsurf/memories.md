# Project Memories

## Decision Graph System

This project uses **Deciduous** for persistent decision tracking.

<memory>
**What is Deciduous?**
A decision graph tool that tracks goals, decisions, actions, and outcomes.
The graph survives context loss - when sessions end or context compacts,
the reasoning persists in the database.
</memory>

<memory>
**Why log decisions?**
- Context compaction loses your reasoning
- The graph survives and is queryable by future sessions
- Retroactive logging misses details - log in the moment
- The user may be watching the graph live
</memory>

<memory>
**Key Commands**
- `deciduous nodes` - see all decisions
- `deciduous edges` - see connections
- `deciduous add <type> "title" -c <confidence>` - add node
- `deciduous link <from> <to> -r "reason"` - connect nodes
- `deciduous sync` - export to docs/graph-data.json
</memory>

<memory>
**Node Types**
- goal: High-level objective
- decision: Choice point
- option: Possible approach
- action: Implementation step
- outcome: Result
- observation: Finding/insight
</memory>

<memory>
**The Rule**
LOG BEFORE YOU CODE, NOT AFTER.
SYNC BEFORE YOU PUSH.
</memory>
