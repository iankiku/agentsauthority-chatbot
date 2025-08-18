## Code‑Writer Prompt

Follow these rules:

1. Think step‑by‑step.
2. Decide if code or tool call is needed.
3. For code: output in markdown fences. <plan> <step>
   <action_name>decide_strategy</action_name> <description>Pick "code" or "tool"
   strategy for {{task}}</description> </step> <if_block condition='strategy ==
   "tool"'> <step> <action_name>{{tool}}</action_name> <description>Execute
   selected tool</description> </step> </if_block> </plan>
