# PRP (Product Requirement Prompt) System v3.0

## Overview

PRP v3.0 combines the best features from v1.0 and v2.0 to create a comprehensive agentic development system that leverages Claude Code's capabilities for rapid, intelligent software development.

## Key Features

### 🤖 Enhanced Sub-Agent Architecture
- **5 Specialized Agents** for different development tasks
  - `meta-agent`: Creates new custom agents on demand
  - `code-reviewer`: Comprehensive code review and analysis
  - `ui-ux-agent`: UI/UX focused development assistance
  - `prd-generator`: Product requirement document generation
  - `slides-agent`: Technical presentation creation

### 📋 Streamlined Command System
- **Core Commands**: Essential development workflows
- **PRP Commands**: Simplified creation and execution
- **Code Quality**: Review, debug, and RCA capabilities
- **Git Operations**: Advanced worktree and conflict resolution
- **TypeScript**: Specialized TypeScript development commands
- **Experimental**: Parallel processing and rapid development

### 📚 Comprehensive Documentation
- **Agent Wiki**: Best practices and architecture guides
- **AI Documentation**: Claude Code mastery resources
- **PRP Templates**: Structured templates for different use cases

### 🚀 Enhanced Infrastructure
- **PRP Runner Script**: Python-based execution system
- **Settings Management**: Formal configuration with schema validation
- **Security Model**: Permission-based allowlist system

## Directory Structure

```
_PRPs-agentic-dev3.0/
├── .claude/
│   ├── agents/                    # Specialized sub-agents
│   ├── commands/
│   │   ├── code-quality/         # Code review and debugging
│   │   ├── core/                 # Essential commands
│   │   ├── dev/                  # Development workflows
│   │   ├── experimental/         # Advanced/experimental features
│   │   ├── git/                  # Git operations
│   │   ├── prp-commands/         # PRP creation/execution
│   │   └── typescript/           # TypeScript specific
│   └── settings.local.json       # Configuration
├── agent_wiki/                   # Knowledge base
│   └── best_practices/          # Claude Code best practices
├── PRPs/
│   ├── ai_docs/                 # AI development documentation
│   ├── scripts/                 # PRP runner and utilities
│   └── templates/               # PRP templates
├── CLAUDE.md                    # Project-specific guidance
└── README.md                    # This file
```

## Quick Start

### 1. Create a PRP
```bash
/prp-create
```

### 2. Execute a PRP
```bash
/prp-execute
```

### 3. Use Specialized Agents
```bash
/code-reviewer  # For code review
/ui-ux-agent    # For UI/UX tasks
```

## What's New in v3.0

### From v1.0
- Retained comprehensive AI documentation
- Kept experimental rapid development commands
- Preserved PRP runner script infrastructure
- Maintained TypeScript-specific commands

### From v2.0
- Integrated sub-agent architecture
- Adopted simplified command structure
- Included agent wiki knowledge base
- Applied security configuration model

### New in v3.0
- Unified command system with best of both versions
- Enhanced PRP templates with validation improvements
- Consolidated documentation structure
- Hybrid execution model (agents + scripts)

## Best Practices

1. **Use Agents for Complex Tasks**: Leverage specialized agents for domain-specific work
2. **Follow CLAUDE.md Guidelines**: Project-specific rules are defined there
3. **Utilize Templates**: Start with templates for consistent PRP structure
4. **Experiment Safely**: Use experimental commands in isolated environments

## Command Categories

### Core Development
- `/context-prime` - Initialize development context
- `/smart-commit` - Intelligent git commits
- `/create-pr` - Automated pull request creation
- `/onboarding` - Project onboarding assistance

### Code Quality
- `/review-general` - General code review
- `/review-uncommitted` - Review uncommitted changes
- `/debug-RCA` - Root cause analysis for bugs

### PRP Management
- `/prp-create` - Create new PRPs
- `/prp-execute` - Execute existing PRPs

### Git Operations
- `/conflict-resolver` - Resolve merge conflicts
- `/create-worktrees` - Setup git worktrees

### TypeScript
- `/ts-module-analyzer` - Analyze TypeScript modules
- `/ts-quick-interface` - Generate interfaces
- `/ts-refactor-extract` - Extract and refactor code
- `/ts-test-generator` - Generate tests

### Experimental
- Parallel PRP creation commands
- Rapid validation tools
- Hackathon-optimized workflows

## Configuration

Edit `.claude/settings.local.json` to configure:
- Tool permissions
- Command allowlists
- Custom settings

## Contributing

This is an evolving system. Key areas for contribution:
- New specialized agents
- Enhanced PRP templates
- Additional experimental commands
- Documentation improvements

## Version History

- **v1.0**: Command-focused system with comprehensive research
- **v2.0**: Agent-based architecture with simplified workflows
- **v3.0**: Unified system combining best of both approaches

---

Built for rapid, intelligent development with Claude Code.