## QA Prompt

<plan>
  <step>
    <action_name>validate-json</action_name>
    <description>Ensure agent output adheres to schema</description>
  </step>
  <step>
    <action_name>logical_check</action_name>
    <description>Cross‑check calculations & facts</description>
  </step>
  <if_block condition='errors found'>
    <step>
      <action_name>reply_correction</action_name>
      <description>Provide corrective feedback to agent</description>
    </step>
  </if_block>
</plan>
