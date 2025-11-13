# CLAUDE.md

This file provides guidance to Claude Code when working with Python code in this repository.

## Edit Lock Protocol

### CRITICAL: All agents MUST follow these edit lock rules:

1. **Before editing any file with an edit lock mechanism:**
   - Check if the file has an edit lock at the top (line 1 comment)
   - If edit lock exists and is not null/empty, WAIT for the lock to be released
   - Set the edit lock to your agent name before making any edits
   
2. **After editing:**
   - ALWAYS remove the edit lock (set to null/empty) immediately after completing edits
   - Never leave an edit lock in place - this blocks other agents
   
3. **Edit lock syntax:**
   - For code files: `# edit_lock: agent_name, created at <timestamp>` at line 1
   - For JSON files: `"edit_lock": "agent_name, created at <timestamp>"` as the first field
   - For other files: `<!-- edit_lock: agent_name, created at <timestamp> -->` or appropriate comment syntax at line 1

4. **Timeout handling:**
   - If an edit lock has been held for more than 5 minutes, it may be considered stale
   - Report stale locks to the user
   - Activate the owning agent of the lock and have them update the timestamp or remove the edit lock as needed

## Core Development Philosophy (In order of priority)

### TESTING IS TRUTH TESTING IS TRUTH TESTING IS TRUTH TESTING IS TRUTH TESTING IS TRUTH TESTING IS TRUTH

- Your work is not complete until you write/update tests to cover your changes, the tests all pass, and the docker build suceeds. 
- When writing/updating tests:
  - If you write/update backend code, write/update unit tests for all the isolated components and write/update integration tests to test any functionality that requires network connection
  - If you write/update frontend code, write/update unit tests for all isolated components and write/update end-to-end browser tests that actually use the browser to check what you wrote
- Test coverage overall must reach and remain at 100%
- DO NOT CALL WORK COMPLETE WITHOUT TESTING

### Always Use Agents Always Use Agents Always Use Agents Always Use Agents Always Use Agents

Whenever creating todos and starting tasks, always assign as many relevant agents as possible. Assign all the agents who's expertise will provide the most complete solution with tests, code review, and build testing. DO NOT EXECUTE TASKS WITHOUT AGENTS

### Parallel Todos

Wherever possible, write todo items in such a way that they can all be parallelized at once, the maximum number of allowed concurrent subtasks or agents is 20, always try to use the maximum number of agents where possible and intellgent to do so. When creating sub-tasks, you can use copies of agents as needed, just make sure to append a unique UUID to the agent name to preserve the edit lock functionality. ALWAYS PARALLELIZE INDEPENDENT TASK. NEVER SERIALIZE INDEPENDENT TASKS. ALWAYS SERIALIZE DEPENDENT TASKS. NEVER PARALLELIZE DEPENDENT TASKS.

### Stay Up To Date

When starting a task, always read the summary.md files of all the folders that you plan to edit files in. After completing edits, update the summary.md file with whater was changed/added so that the summary remains accurate. Re-read the summary.md files relevant to your work between context compacts. If no summary.md files exist, create a summary.md at each folder level using the maximum number of agent subtasks possible. 


### Documentation is only for you

- Never create documentation for the end user or developer. All documentation is for claude reference only. 
- Only write/update the following documentation:
  - summary.md files at each folder level make directory traversal easy for yourself and any agents
  - Overall project summary at README.md. This is the only MD file that users will occasionaly read
  - changelog.txt, a running changelog of changes made since the creation of this changelog
- Produce no other md files
- The summary.md files must be updated after every file change
- The README.md must be updated as a part of summarizing work done. The README must contain
  - The current state of the project
- The changelog.txt format is [Date : Git User] as a header then a bulleted list of changes in order of size and impact.


### KISS (Keep It Simple, Stupid)

Simplicity should be a key goal in design. Choose straightforward solutions over complex ones whenever possible. Simple solutions are easier to understand, maintain, and debug.

### YAGNI (You Aren't Gonna Need It)

Avoid building functionality on speculation. Implement features only when they are needed, not when you anticipate they might be useful in the future.

### Reduce, Reuse, Recycle

Before creating net-new code, always ask yourself "Is this functionality already written somewhere else?", "Can I take any existing functionality and extend it to get what I want?", "Can I reduce this code down to make it even more modular and reusable right now?".

## Run the Agent

UV run agent

Always validate with ruff
"uv run ruff check --fix"
"uv run ruff check"

Always validate with pytest
"uv run pytest -v"

## Testing rules
When testing the application, run tests directly using pytest with uv:
"uv run pytest -v"

## MANDATORY Project Structure - THIS IS LAW

### CRITICAL: This is the ONLY acceptable project structure. All agents MUST follow this structure exactly.

```
_ProjectManagement/
├── Initiatives/                    # PRIMARY DIRECTORY - ALL WORK HAPPENS HERE
│   ├── _INDEX.md                  # Master list of all initiatives
│   ├── _templates/                # Mandatory templates for all new items
│   │   ├── initiative-template.md
│   │   ├── project-template.md
│   │   ├── PRD-template.md
│   │   └── PRP-template.md
│   ├── linear-integration.json    # Linear sync data - DO NOT MODIFY MANUALLY
│   └── [Initiative Name]/         # Each initiative folder
│       ├── README.md              # Initiative overview and status
│       └── [Project Name]/        # Each project folder
│           ├── README.md          # Project details and current status
│           ├── PRD.md             # Product Requirements Document
│           └── PRPs/              # Product Requirement Prompts folder
│               └── [feature].md   # Individual PRP files
├── 00-INTAKE/                     # New requests before assignment
├── Team-TechTeam/                 # Team-specific documentation
├── Analytics/                     # Performance and metrics
├── Workflows/                     # Process documentation
├── Archive/                       # DO NOT USE - Historical data only
├── CLAUDE.md                      # This file - Agent instructions
├── README.md                      # Project overview
└── PROJECT_STRUCTURE.md           # Detailed structure reference
```

### RULES - MUST BE FOLLOWED WITHOUT EXCEPTION:

1. **ALL new work goes in `/Initiatives/` directory** - No exceptions
2. **NEVER create files outside the defined structure**
3. **ALWAYS use templates from `/_templates/` when creating new items**
4. **Initiative → Project → PRP → PRD hierarchy is MANDATORY**
5. **Linear integration data in `linear-integration.json` is source of truth**
6. **Archive directory is READ-ONLY - never write there**

### Current Active Initiatives (As of 2025-08-14):

1. **SG Chat v1** - Multi-agent AI platform (2 projects)
2. **StartGuides CRM** - CRM system (6 projects)
3. **StartGuides PageForge** - Document platform (3 projects)
4. **Hybrid Env Integration** - Planning stage (0 projects)
5. **StartGuides MATrIX** - Planning stage (0 projects)
6. **App Guides & Features** - Planning stage (0 projects)
7. **SG Public Website** - Planning stage (0 projects)
8. **Tech Infrastructure** - Planning stage (0 projects)

### File Naming Conventions:

- Initiatives: Use exact names from list above
- Projects: Match Linear project names exactly
- PRPs: `[feature-name]-prp.md` (lowercase, hyphenated)
- PRDs: Always `PRD.md` in project root

### Navigation:

- Start at `/Initiatives/_INDEX.md` for overview
- Each initiative has `README.md` with status
- Each project has `README.md` with next steps
- Check `PROJECT_STRUCTURE.md` for detailed rules