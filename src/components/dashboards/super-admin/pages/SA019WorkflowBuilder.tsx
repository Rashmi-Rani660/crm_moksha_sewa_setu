"use client";

/**
 * SA-019 — Task Templates & Workflow Builder (demo data).
 * Templates are versioned: draft → simulation → independent approval →
 * publish / rollback. Open cases keep their version unless migrated with
 * approval; mandatory legal and eligibility gates cannot be bypassed. The
 * visual workflow is a static specification, not a drag-and-drop editor.
 */

import { useState } from "react";
import { useResource } from "@/lib/crm/useResource";
import { EMPTY, count, text, records } from "@/lib/crm/data";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Check, Col, Columns, DataTable, Field, Flow, KVList, NativeSelect, Panel, Screen, TextBox, ink } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Templates", "Workflow Builder", "Simulation", "Version History"] as const;
const modeOpts = ["Approval-based", "Manual", "Automatic"] as const;

const safeguards = ["Validate all required gates", "Prevent circular transitions", "Independent approval", "Retain version for open cases", "Rollback plan required"];

export default function SA019WorkflowBuilder() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const live = useResource("/tasks/templates", "workflows", notice.show, {}, { paginated: false, summary: null });
  const library = live.rows.map(row => ({ id: text(row.id), name: text(row.name), version: text(row.version), state: text(row.status) }));
  const [selected, setSelected] = useState("");
  const t = library.find((x) => x.name === selected) ?? library[0] ?? { id: "", name: EMPTY, version: EMPTY, state: EMPTY };
  const steps = records(live.detail.data?.steps).map(step => [text(step.title), EMPTY, text(step.typeCode), text(step.dueInMinutes)]);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<string>(modeOpts[0]);

  const choose = (n: string) => {
    setSelected(n);
    live.select(library.find(row => row.name === n)?.id ?? null);
    setName(n);
  };

  return (
    <Screen
      code="SA-019"
      title="Task Templates & Workflow Builder"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: live.list.data ? count(library.length) : EMPTY, label: "Templates" },
        { value: EMPTY, label: "Published" },
        { value: EMPTY, label: "Draft" },
        { value: EMPTY, label: "Under review" },
        { value: EMPTY, label: "Mandatory gates" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title={`Selected template — ${t.name}`}>
            <div className="grid grid-cols-1 gap-x-[13px] gap-y-[7px] sm:grid-cols-2">
              <Field label="Template name"><TextBox value={name || t.name} onChange={setName} label="Template name" /></Field>
              <Field label="Version"><TextBox value={`${t.version} (${t.state.toLowerCase()})`} readOnly label="Version" /></Field>
              <Field label="Mode"><NativeSelect label="Mode" value={mode} options={modeOpts} onChange={setMode} className="w-full" /></Field>
              <Field label="Scope"><TextBox value={EMPTY} readOnly label="Scope" /></Field>
            </div>
            <div className="mt-[8px]">
              <Flow steps={["Intake", "Eligibility", "Legal clearance", "Approval", "Dispatch", "Closure"]} h={58} />
            </div>
            <div className="mt-[8px] grid grid-cols-1 gap-x-[12px] rounded-[6px] border border-dashed border-[#e2c071] bg-[#fff9ed] px-[9px] py-[5px] text-[14.3px] leading-[18px] sm:grid-cols-2">
              <p className={ink}>Eligibility / clearance failed</p>
              <p className="text-[#8a5b00]">→ Hold &amp; human review</p>
              <p className={ink}>Dispatch delivery failed</p>
              <p className="text-[#8a5b00]">→ Retry / manual assignment</p>
            </div>
            <div className="mt-[8px]">
              <DataTable head={["Step", "Owner", "Mode", "Gate / output"]} rowH={30} rows={steps.map((s) => ({ key: s[0], cells: s }))} />
            </div>
            <Buttons>
              <Btn primary disabled onClick={() => setTab("Simulation")}>Run simulation</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Submit for approval</Btn>
              <Btn disabled={!live.can("workflows.edit") || live.mutation.busy || !live.detail.data} onClick={() => live.action("", "workflows.edit", { name: name || t.name }, "PATCH")}>Save draft</Btn>
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
                  className={`flex h-[28px] w-full items-center gap-[12px] border-b border-[#e1e7f0] text-left text-[15.3px] ${ink} ${selected === l.name ? "bg-[#e9f0fc]" : "hover:bg-[#eef3fb]"}`}
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
              <Btn primary disabled onClick={() => setTab("Version History")}>View versions</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Compare changes</Btn>
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
              <Btn disabled onClick={() => notice.show(EMPTY)}>Edit branch</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Review node</Btn>
            </Buttons>
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
