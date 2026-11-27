"use client";

/**
 * SA-019 — Task Templates & Workflow Builder (demo data).
 * Templates are versioned: draft → simulation → independent approval →
 * publish / rollback. Open cases keep their version unless migrated with
 * approval; mandatory legal and eligibility gates cannot be bypassed. The
 * visual workflow is a static specification, not a drag-and-drop editor.
 */

import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Check, Col, Columns, DataTable, Field, Flow, KVList, NativeSelect, Panel, Screen, TextBox, ink } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Templates", "Workflow Builder", "Simulation", "Version History"] as const;
const modeOpts = ["Approval-based", "Manual", "Automatic"] as const;

const library = [
  { name: "Free cremation support", version: "v1.2", state: "Draft" },
  { name: "Unclaimed body workflow", version: "v1.0", state: "Published" },
  { name: "Family assistance", version: "v1.0", state: "Published" },
  { name: "Document verification", version: "v1.1", state: "Review" },
];

const steps = [
  ["Intake", "Helpline", "Automatic", "Request record"],
  ["Eligibility", "Verification User", "Manual", "Evidence check"],
  ["Legal clearance", "Authorised verifier", "Manual", "Mandatory where applicable"],
  ["Case approval", "Operations Admin", "Approval", "Independent decision"],
  ["Dispatch", "Field coordinator", "Approval", "Assignment accepted"],
  ["Closure", "Case owner", "Manual", "Evidence & audit"],
];

const safeguards = ["Validate all required gates", "Prevent circular transitions", "Independent approval", "Retain version for open cases", "Rollback plan required"];

export default function SA019WorkflowBuilder() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const [selected, setSelected] = useState(library[0].name);
  const t = library.find((x) => x.name === selected)!;
  const [name, setName] = useState(t.name);
  const [mode, setMode] = useState<string>(modeOpts[0]);

  const choose = (n: string) => {
    setSelected(n);
    setName(n);
  };

  return (
    <Screen
      code="SA-019"
      title="Task Templates & Workflow Builder"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: "04", label: "Templates" },
        { value: "02", label: "Published" },
        { value: "01", label: "Draft" },
        { value: "01", label: "Under review" },
        { value: "02", label: "Mandatory gates" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title={`Selected template — ${t.name}`}>
            <div className="grid grid-cols-1 gap-x-[13px] gap-y-[7px] sm:grid-cols-2">
              <Field label="Template name"><TextBox value={name} onChange={setName} label="Template name" /></Field>
              <Field label="Version"><TextBox value={`${t.version} (${t.state.toLowerCase()})`} readOnly label="Version" /></Field>
              <Field label="Mode"><NativeSelect label="Mode" value={mode} options={modeOpts} onChange={setMode} className="w-full" /></Field>
              <Field label="Scope"><TextBox value="Ghaziabad" readOnly label="Scope" /></Field>
            </div>
            <div className="mt-[8px]">
              <Flow steps={["Intake", "Eligibility", "Legal clearance", "Approval", "Dispatch", "Closure"]} h={58} />
            </div>
            <div className="mt-[8px] grid grid-cols-1 gap-x-[12px] rounded-[6px] border border-dashed border-[#e2c071] bg-[#fff9ed] px-[9px] py-[5px] text-[12.3px] leading-[18px] sm:grid-cols-2">
              <p className={ink}>Eligibility / clearance failed</p>
              <p className="text-[#8a5b00]">→ Hold &amp; human review</p>
              <p className={ink}>Dispatch delivery failed</p>
              <p className="text-[#8a5b00]">→ Retry / manual assignment</p>
            </div>
            <div className="mt-[8px]">
              <DataTable head={["Step", "Owner", "Mode", "Gate / output"]} rowH={30} rows={steps.map((s) => ({ key: s[0], cells: s }))} />
            </div>
            <Buttons>
              <Btn primary onClick={() => { setTab("Simulation"); notice.show(`Simulation run for "${name}" — all mandatory gates passed (demo).`); }}>Run simulation</Btn>
              <Btn onClick={() => notice.show("Submitted for independent approval before publishing (demo).")}>Submit for approval</Btn>
              <Btn onClick={() => notice.show(`Draft saved: ${name} ${t.version} (demo).`)}>Save draft</Btn>
            </Buttons>
          </Panel>
        </Col>

        <Col>
          <Panel title="Template library" h={214}>
            <div>
              {library.map((l) => (
                <button
                  key={l.name}
                  type="button"
                  onClick={() => choose(l.name)}
                  aria-pressed={selected === l.name}
                  className={`flex h-[28px] w-full items-center gap-[12px] border-b border-[#e1e7f0] text-left text-[13.3px] ${ink} ${selected === l.name ? "bg-[#e9f0fc]" : "hover:bg-[#eef3fb]"}`}
                >
                  <span className="min-w-0 flex-1 truncate pt-px">{l.name}</span>
                  <span className="shrink-0 pt-px">{l.version} • {l.state}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Publishing safeguards">
            {safeguards.map((s) => <Check key={s} label={s} checked disabled />)}
            <Buttons className="!mt-[8px]">
              <Btn primary onClick={() => setTab("Version History")}>View versions</Btn>
              <Btn onClick={() => notice.show("Compare v1.2 (draft) with v1.1 (demo).")}>Compare changes</Btn>
            </Buttons>
            <div className="mt-[6px]">
              <KVList
                rowH={27}
                rows={[
                  ["Failure path", "Retry + human review"],
                  ["Conditional branches", "Mandatory gates locked"],
                ]}
              />
            </div>
            <Buttons className="!mt-[8px]">
              <Btn onClick={() => notice.show("Branch edits stay in draft until approved (demo).")}>Edit branch</Btn>
              <Btn onClick={() => notice.show("Node review: owner, gate and output (demo).")}>Review node</Btn>
            </Buttons>
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
