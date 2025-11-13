# PRP System v3.0 - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Basic PRP Creation
```bash
# Create a new PRP for your feature
claude --working-dir _PRPs-agentic-dev3.0 /prp-create
```

### 2. Execute the PRP
```bash
# Run the PRP you created
claude --working-dir _PRPs-agentic-dev3.0 /prp-execute
```

### 3. Use Specialized Agents
```bash
# For code review
claude --working-dir _PRPs-agentic-dev3.0 /code-reviewer

# For UI/UX tasks
claude --working-dir _PRPs-agentic-dev3.0 /ui-ux-agent
```

## 📋 Common Workflows

### Development Workflow
1. **Initialize Context**: `/context-prime`
2. **Create PRP**: `/prp-create`
3. **Execute PRP**: `/prp-execute`
4. **Review Code**: `/review-uncommitted`
5. **Commit Changes**: `/smart-commit`
6. **Create PR**: `/create-pr`

### Debugging Workflow
1. **Analyze Error**: `/debug-RCA`
2. **Review Code**: `/review-general`
3. **Fix Issues**: Use appropriate commands
4. **Validate**: `/review-uncommitted`

### TypeScript Development
1. **Analyze Module**: `/ts-module-analyzer`
2. **Generate Interface**: `/ts-quick-interface`
3. **Refactor Code**: `/ts-refactor-extract`
4. **Generate Tests**: `/ts-test-generator`

## 🎯 Pro Tips

### 1. Use Agents for Complex Tasks
Instead of multiple commands, use agents:
```bash
# Let the code-reviewer agent handle the entire review
claude /code-reviewer "Review my authentication module"
```

### 2. Leverage Experimental Commands
For hackathons or rapid prototyping:
```bash
# Parallel PRP creation for speed
claude /parallel-prp-creation
```

### 3. Configure Your Environment
Edit `.claude/settings.local.json` to customize:
```json
{
  "toolPermissions": {
    "allowlist": ["bash", "write", "read"]
  }
}
```

## 📁 Key Directories

- **Commands**: `.claude/commands/`
- **Agents**: `.claude/agents/`
- **Templates**: `PRPs/templates/`
- **Documentation**: `agent_wiki/` and `PRPs/ai_docs/`

## 🔧 Advanced Usage

### Running PRPs with the Script
```bash
# Interactive mode
python PRPs/scripts/prp_runner.py --prp my_feature --interactive

# With specific agent
python PRPs/scripts/prp_runner.py --prp my_feature --agent ui-ux-agent

# Validate only
python PRPs/scripts/prp_runner.py --prp my_feature --validate-only
```

### Creating Custom Agents
Use the meta-agent to create new specialized agents:
```bash
claude /meta-agent "Create an agent for database migrations"
```

## 📚 Learning Path

1. Start with basic commands (`/prp-create`, `/prp-execute`)
2. Explore code quality commands (`/review-general`, `/debug-RCA`)
3. Try specialized agents (`/code-reviewer`, `/ui-ux-agent`)
4. Experiment with advanced features (experimental commands)
5. Create custom workflows combining multiple tools

## 🆘 Need Help?

- Check `VERSION_MANIFEST.md` for component details
- Read `agent_wiki/` for best practices
- Review `PRPs/ai_docs/` for AI development guides
- Explore example PRPs in `PRPs/templates/`

---

Ready to build faster and smarter with PRP v3.0! 🚀