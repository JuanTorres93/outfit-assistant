# PR Description Generator

## How to use

Use this prompt whenever you need to create a Pull Request description from recent work.

1. Provide the number of commits to analyze.
2. Run the prompt from the branch containing the changes you want to submit.
3. The agent will inspect both the commit history and the actual diff.
4. Review the generated PR title and description before submitting the PR.

Example:

> Analyze the last 8 commits and write the PR description.

The goal is to produce a concise, useful PR that gives the team enough context to understand the changes without turning the description into an AI-generated essay.

---

## Prompt

Analyze the last **N commits** on the current branch and write a complete Pull Request description based on them.

Do not rely only on commit messages. Inspect the actual changes introduced by those commits so you can understand what was really changed.

### What to do

1. Review the last N commits.
2. Inspect the relevant diffs.
3. Identify the meaningful functional, technical, and behavioral changes.
4. Group related changes together instead of describing commits one by one.
5. Distinguish between important changes and implementation noise.
6. Ignore or briefly group purely mechanical changes, formatting changes, generated files, or other details that are not useful to reviewers.
7. Do not invent context, motivations, tests, or behavior that cannot be inferred from the repository.

### Output

Return the result as **raw Markdown inside a single fenced code block**, ready to copy and paste directly into the GitHub Pull Request description.

Do not render or interpret the Markdown yourself. The code block must contain the exact Markdown that should be pasted into GitHub.

The Markdown must contain only:

# [Short, descriptive PR title]

## Summary

2–4 sentences explaining what changed and, when clear from the code or commits, why.

## Changes

A short bullet list of the most relevant changes, grouped by feature, behavior, or area of the codebase.

## Tests

Briefly describe the tests or validation performed, if this can be determined from the repository, commits, or available evidence.

### Writing guidelines

- Keep it concise.
- The entire PR description should ideally take less than one minute to read.
- Write like an experienced developer communicating with teammates, not like an AI generating a report.
- Focus on what matters to reviewers.
- Do not provide a chronological summary of the commits.
- Do not list every modified file unless a file is particularly relevant.
- Do not repeat the same information across sections.
- Avoid generic statements such as "Various improvements have been made."
- Use technical terminology when useful, but do not explain concepts that the development team already understands.
- Do not use emojis.
- Do not add unnecessary sections such as "Conclusion", "Next Steps", "Technical Details", or "Implementation Notes".
- If the changes are small, keep the PR description small.
- If the changes are large, group them into clear areas and summarize the important parts rather than documenting every detail.
- Prefer concrete statements over vague descriptions.
- Mention breaking changes, behavioral changes, migrations, or notable risks when they are actually present.
- Never fabricate tests or claim that something was verified if there is no evidence that it was.

The final result should feel like a PR written by a developer who understands the project and wants teammates to quickly understand what changed.

When the user provides N, analyze exactly the last N commits.
