"use client";

import { useEffect, useState } from "react";
import { adminCopy, errors } from "@/lib/copy";
import { formatWhen, statusClass, wordPreview } from "@/lib/format";
import type { ReportDetail, ReportListItem, ReportStatus } from "@/lib/report-shape";
import type { ContactRow, DemoRow, Overview } from "@/lib/public-types";
import { ErrorText } from "./ErrorText";

type Tab = "reports" | "contacts" | "demos";

function StatusPill({ status }: { status: ReportStatus }) {
  return <span className={statusClass(status)}>{adminCopy.status[status]}</span>;
}

function SourcePill({ sample }: { sample: boolean }) {
  return <span className={sample ? "pill-status pill-sample" : "pill-status pill-real"}>{sample ? adminCopy.sample : adminCopy.real}</span>;
}

function MessagePreview({ text }: { text: string }) {
  if (!text) return <span>—</span>;
  if (text.length <= 140) return <p className="message">{text}</p>;
  return (
    <details>
      <summary>
        {text.slice(0, 140)}…
      </summary>
      <p className="message">{text}</p>
    </details>
  );
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols}>{adminCopy.empty}</td>
    </tr>
  );
}

function LoadingRows() {
  return (
    <>
      {[0, 1, 2, 3].map((row) => (
        <tr key={row} className="skel-row">
          <td colSpan={7}>
            <div className="skel" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("reports");
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<Overview | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [detailError, setDetailError] = useState("");
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    fetch("/api/admin/overview", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.replace("/admin/login");
          return;
        }
        if (!response.ok) throw new Error("load");
        const body = (await response.json()) as Overview;
        setData(body);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState("error");
      });
    return () => controller.abort();
  }, [tick]);

  async function copyText(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setCopyError("");
    } catch {
      setCopyError(errors.copyFail);
    }
  }

  async function showReport(id: string) {
    setDetail(null);
    setDetailError("");
    setOpening(id);
    try {
      const response = await fetch(`/api/admin/reports/${encodeURIComponent(id)}`, { method: "POST", cache: "no-store" });
      if (response.status === 401) {
        window.location.replace("/admin/login");
        return;
      }
      const body = (await response.json().catch(() => null)) as { ok?: boolean; report?: ReportDetail } | null;
      if (!response.ok || !body?.ok || !body.report) {
        setDetailError(errors.open);
        return;
      }
      setDetail(body.report);
    } catch {
      setDetailError(errors.open);
    } finally {
      setOpening(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.replace("/admin/login");
  }

  const stats = data?.stats;

  return (
    <>
      <header className="admin-head">
        <h1>{adminCopy.title}</h1>
        <button className="ghost" type="button" onClick={logout}>
          {adminCopy.signOut}
        </button>
      </header>
      <section className="stats" aria-label="Counts">
        <article>
          <strong>{state === "ready" && stats ? stats.reports : "—"}</strong>
          <span>{adminCopy.stats.reports}</span>
        </article>
        <article>
          <strong>{state === "ready" && stats ? stats.newThisWeek : "—"}</strong>
          <span>{adminCopy.stats.week}</span>
        </article>
        <article>
          <strong>{state === "ready" && stats && stats.contacts !== null ? stats.contacts : "—"}</strong>
          <span>{adminCopy.stats.contacts}</span>
        </article>
        <article>
          <strong>{state === "ready" && stats && stats.demos !== null ? stats.demos : "—"}</strong>
          <span>{adminCopy.stats.demos}</span>
        </article>
      </section>
      <div className="tabs" role="tablist">
        {(["reports", "contacts", "demos"] as const).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)}>
            {adminCopy.tabs[item]}
          </button>
        ))}
      </div>
      {state === "error" ? (
        <div className="banner">
          <ErrorText>{errors.load}</ErrorText>
          <button className="ghost" type="button" onClick={() => setTick((value) => value + 1)}>
            Retry
          </button>
        </div>
      ) : null}
      {state === "ready" && data?.liveError ? (
        <div className="banner">
          <ErrorText>{adminCopy.liveError}</ErrorText>
          <button className="ghost" type="button" onClick={() => setTick((value) => value + 1)}>
            Retry
          </button>
        </div>
      ) : null}
      {copyError ? <ErrorText>{copyError}</ErrorText> : null}
      {tab === "reports" ? (
        <div className="table-wrap">
          <table className="rows">
            <caption className="sr">{adminCopy.tabs.reports}</caption>
            <thead>
              <tr>
                <th scope="col">{adminCopy.columns.date}</th>
                <th scope="col">{adminCopy.columns.report}</th>
                <th scope="col">{adminCopy.columns.category}</th>
                <th scope="col">{adminCopy.columns.preview}</th>
                <th scope="col">{adminCopy.columns.status}</th>
                <th scope="col">{adminCopy.columns.source}</th>
                <th scope="col">{adminCopy.columns.open}</th>
              </tr>
            </thead>
            <tbody>
              {state === "loading" ? <LoadingRows /> : null}
              {state === "ready" && data && data.reports.length === 0 ? <EmptyRow cols={7} /> : null}
              {state === "ready" && data
                ? data.reports.map((report) => (
                    <ReportRow key={report.id} report={report} opening={opening === report.id} onShow={showReport} />
                  ))
                : null}
            </tbody>
          </table>
        </div>
      ) : null}
      {tab === "contacts" ? (
        <PeopleTable
          rows={state === "ready" ? data?.contacts ?? null : null}
          loading={state === "loading"}
          copied={copied}
          onCopy={copyText}
          company={() => "—"}
        />
      ) : null}
      {tab === "demos" ? (
        <PeopleTable
          rows={state === "ready" ? data?.demos ?? null : null}
          loading={state === "loading"}
          copied={copied}
          onCopy={copyText}
          company={(row) => row}
        />
      ) : null}
      <p className="notice">{adminCopy.note}</p>
      {detailError ? <ErrorText>{detailError}</ErrorText> : null}
      {detail ? (
        <section className="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <div className="detail-head">
            <h2 id="detail-title">{detail.category}</h2>
            <button className="ghost" type="button" onClick={() => setDetail(null)}>
              {adminCopy.close}
            </button>
          </div>
          <p className="meta">
            <span>{formatWhen(detail.createdAt)}</span>
            <StatusPill status={detail.status} />
            <SourcePill sample={detail.sample} />
          </p>
          <p className="meta">
            {detail.platform} · {detail.occurredAt}
          </p>
          <p className="kicker">{adminCopy.summary}</p>
          <p className="narrative">{detail.summary}</p>
          <p className="kicker">{adminCopy.record}</p>
          {detail.entries.map((entry, index) =>
            entry.kind === "file" ? (
              <div key={`${detail.id}-file-${index}`} className="narrative">
                <p className="kicker">{adminCopy.evidence}</p>
                {entry.url ? (
                  <>
                    {/* Signed URLs must not pass through the image optimizer. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={entry.url} alt="Evidence file" />
                    <p>
                      <a href={entry.url} rel="noreferrer">
                        {adminCopy.evidenceLink}
                      </a>
                    </p>
                    <p className="hint">{errors.evidenceExpires}</p>
                  </>
                ) : (
                  <p>{errors.evidenceMissing}</p>
                )}
              </div>
            ) : (
              <p key={`${detail.id}-${index}`} className="narrative">
                {entry.kind === "signal" ? <span className="kicker">Signal</span> : null}
                {entry.text}
              </p>
            ),
          )}
          <p className="id-line">{detail.id}</p>
        </section>
      ) : null}
    </>
  );
}

function ReportRow({ report, opening, onShow }: { report: ReportListItem; opening: boolean; onShow: (id: string) => void }) {
  return (
    <tr className={report.sample ? "sample" : undefined}>
      <td data-label={adminCopy.columns.date}>{formatWhen(report.createdAt)}</td>
      <td data-label={adminCopy.columns.report} className="mono">
        {report.id}
      </td>
      <td data-label={adminCopy.columns.category}>{report.category}</td>
      <td data-label={adminCopy.columns.preview}>{wordPreview(report.words)}</td>
      <td data-label={adminCopy.columns.status}>
        <StatusPill status={report.status} />
      </td>
      <td data-label={adminCopy.columns.source}>
        <SourcePill sample={report.sample} />
      </td>
      <td data-label={adminCopy.columns.open}>
        <button className="ghost" type="button" onClick={() => onShow(report.id)} disabled={opening}>
          {opening ? adminCopy.opening : adminCopy.show}
        </button>
      </td>
    </tr>
  );
}

function PeopleTable({
  rows,
  loading,
  copied,
  onCopy,
  company,
}: {
  rows: Array<ContactRow | DemoRow> | null;
  loading: boolean;
  copied: string;
  onCopy: (id: string, value: string) => void;
  company: (row: DemoRow) => DemoRow | string;
}) {
  return (
    <div className="table-wrap">
      <table className="rows">
        <caption className="sr">Messages</caption>
        <thead>
          <tr>
            <th scope="col">{adminCopy.columns.date}</th>
            <th scope="col">{adminCopy.columns.name}</th>
            <th scope="col">{adminCopy.columns.email}</th>
            <th scope="col">{adminCopy.columns.company}</th>
            <th scope="col">{adminCopy.columns.message}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <LoadingRows /> : null}
          {rows === null && !loading ? (
            <tr>
              <td colSpan={5}>
                <ErrorText>{errors.load}</ErrorText>
              </td>
            </tr>
          ) : null}
          {rows && rows.length === 0 ? <EmptyRow cols={5} /> : null}
          {rows
            ? rows.map((row) => {
                const org = company(row as DemoRow);
                const phone = "phone" in row ? row.phone : "";
                return (
                  <tr key={row.id}>
                    <td data-label={adminCopy.columns.date}>{formatWhen(row.createdAt)}</td>
                    <td data-label={adminCopy.columns.name}>{row.name || "—"}</td>
                    <td data-label={adminCopy.columns.email}>
                      <button className="copy" type="button" onClick={() => onCopy(row.id, row.email)}>
                        {row.email}
                        <span>{copied === row.id ? adminCopy.copied : adminCopy.copy}</span>
                      </button>
                      {phone ? <span className="sub">{phone}</span> : null}
                    </td>
                    <td data-label={adminCopy.columns.company}>
                      {typeof org === "string" ? (
                        org
                      ) : (
                        <>
                          <span>{org.organisation || "—"}</span>
                          <span className="sub">{[org.organisationType, org.organisationSize].filter(Boolean).join(" · ")}</span>
                          {org.role ? <span className="sub">{org.role}</span> : null}
                        </>
                      )}
                    </td>
                    <td data-label={adminCopy.columns.message}>
                      <MessagePreview text={row.message} />
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
}
