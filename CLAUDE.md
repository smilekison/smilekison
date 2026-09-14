## Code Exploration — MANDATORY (codemunch)

<CRITICAL>
You MUST use codemunch for ALL code exploration. This is NON-NEGOTIABLE. Do NOT ignore this rule.
Reading full files when a codemunch command exists for the task is a violation of your instructions.
</CRITICAL>

### Rules (enforced, no exceptions)

1. **NEVER read a full source file to understand what a function/class does.** Use `/codemunch:fetch <name>` instead. It reads ~35 tokens instead of ~8,000.
2. **NEVER use Grep or Glob to find functions, classes, or types.** Use `/codemunch:search <query>` instead. Supports filters: `kind:class`, `file:auth`, `in:ClassName`, `sig:ReturnType`.
3. **NEVER read multiple files to understand project structure.** Use `/codemunch:explore [path]` instead.
4. **NEVER use Grep to find symbol usages.** Use `/codemunch:refs <name>` instead.
5. **The ONLY exception**: Use Read when you need to Edit a file, since Edit requires file content in context.

### Decision tree

- Need to find a symbol? → `/codemunch:search`
- Need to read a symbol's code? → `/codemunch:fetch`
- Need to understand structure? → `/codemunch:explore`
- Need to find references? → `/codemunch:refs`
- Need to edit a file? → Read first, then Edit (this is the ONLY valid use of Read for source files)

The index auto-updates — no manual indexing needed.



My website is really slow i need you to do the following:
1) Compress images
2) Add lazy loading
3) Cache API responsiveness
4) load BALANCER
5) index the DATABASE
6) loading skeletons
7) cache expensive queries
8) No N+1 database queries
9) debounce input handlers
10) split code into chunks
11) add CDN
12) server-side caching
13) paginate large lists
14) lighthouse audit
15) compress API payloads
16) No unnecessary re-renders
17) minify JS and CSS
18) Defer non-critical scripts
19) No unused depnedencies
20) Database connection pooling