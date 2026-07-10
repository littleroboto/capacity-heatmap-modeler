import { Fragment, useEffect, useState, type ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ExpandedState,
} from "@tanstack/react-table";
import type { Capacity, Consumer, Reducer, Scenario, Tags, Weekday } from "../domain/types";
import { num } from "./format";

type Tab = "capacities" | "reducers" | "consumers";

interface Props {
  scenario: Scenario;
  onChange: (next: Scenario) => void;
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function setTag(tags: Tags | undefined, key: string, value: string): Tags | undefined {
  const next = { ...(tags ?? {}) };
  if (value === "") delete next[key];
  else next[key] = value;
  return Object.keys(next).length ? next : undefined;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]}`;
}
function weekdaysLabel(w?: Weekday[]): string {
  if (!w || w.length === 0) return "Mon–Fri";
  if (w.length === 7) return "Daily";
  return w.map((d) => d[0].toUpperCase() + d.slice(1)).join(", ");
}
function consumerWhen(c: Consumer): string {
  return c.kind === "spanning" ? `${shortDate(c.start)} – ${shortDate(c.end)}` : weekdaysLabel(c.weekdays);
}

/** Generic expandable, sortable table. Expanding a row reveals its edit form. */
function DataTable<T extends { id: string }>({
  data,
  columns,
  renderSubRow,
  expandId,
}: {
  data: T[];
  columns: ColumnDef<T, any>[];
  renderSubRow: (row: T) => ReactNode;
  expandId: string | null;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Auto-open a freshly added row so it's ready to edit.
  useEffect(() => {
    if (expandId) setExpanded((e) => (e === true ? e : { ...e, [expandId]: true }));
  }, [expandId]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, expanded },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const colCount = table.getAllLeafColumns().length;

  return (
    <div className="dtable-wrap">
      <table className="dtable">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const sortable = h.column.getCanSort();
                const dir = h.column.getIsSorted();
                return (
                  <th
                    key={h.id}
                    className={sortable ? "sortable" : undefined}
                    onClick={sortable ? h.column.getToggleSortingHandler() : undefined}
                    aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : undefined}
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    {sortable && <span className="sort-ind">{dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : ""}</span>}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr className={row.getIsExpanded() ? "row expanded" : "row"}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
              {row.getIsExpanded() && (
                <tr className="subrow">
                  <td colSpan={colCount}>{renderSubRow(row.original)}</td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EntryTable({ scenario, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("consumers");
  const [expandId, setExpandId] = useState<string | null>(null);
  const facet = scenario.config.facetBy;
  const facetDim = scenario.config.dimensions.find((d) => d.id === facet);

  const patch = (part: Partial<Scenario>) => onChange({ ...scenario, ...part });

  function TagSelect({ tags, onSet }: { tags: Tags | undefined; onSet: (t: Tags | undefined) => void }) {
    if (!facet || !facetDim) return null;
    return (
      <select
        className="control"
        value={tags?.[facet] ?? ""}
        onChange={(e) => onSet(setTag(tags, facet, e.target.value))}
        title={facetDim.label}
      >
        <option value="">all {facetDim.label.toLowerCase()}</option>
        {facetDim.values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    );
  }

  // Shared cell renderers.
  const expander: ColumnDef<any, any> = {
    id: "expander",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <button
        className="dt-expander"
        onClick={row.getToggleExpandedHandler()}
        aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
      >
        {row.getIsExpanded() ? "▾" : "▸"}
      </button>
    ),
  };
  const trackCell = (v: string | undefined) => (v ? v : <span className="dt-muted">—</span>);
  const tagColumn = <T,>(getTag: (row: T) => string | undefined): ColumnDef<T, any> => ({
    id: "tag",
    header: facetDim?.label ?? "Tag",
    accessorFn: (row) => getTag(row) ?? "",
    cell: (info) => info.getValue<string>() || <span className="dt-muted">all</span>,
  });

  // ---- Consumers ----
  const updateConsumer = (id: string, part: Partial<Consumer>) =>
    patch({ consumers: scenario.consumers.map((c) => (c.id === id ? ({ ...c, ...part } as Consumer) : c)) });
  const removeConsumer = (id: string) => patch({ consumers: scenario.consumers.filter((c) => c.id !== id) });
  const addConsumer = (kind: "recurring" | "spanning") => {
    const id = uid("con");
    const next: Consumer =
      kind === "recurring"
        ? { id, label: "New recurring", kind: "recurring", amount: 30 }
        : {
            id,
            label: "New spanning",
            kind: "spanning",
            amount: 100,
            start: scenario.config.start,
            end: scenario.config.end,
            shape: { type: "flat" },
          };
    patch({ consumers: [...scenario.consumers, next] });
    setExpandId(id);
  };

  const consumerColumns: ColumnDef<Consumer, any>[] = [
    expander,
    { accessorKey: "label", header: "Name", cell: (i) => <span className="dt-name">{i.getValue<string>()}</span> },
    {
      accessorKey: "kind",
      header: "Kind",
      cell: (i) => <span className={`kind-badge kind-${i.getValue<string>()}`}>{i.getValue<string>()}</span>,
    },
    { accessorKey: "amount", header: "Amount", cell: (i) => <span className="dt-num">{num(i.getValue<number>())}</span> },
    { accessorKey: "track", header: "Track", cell: (i) => trackCell(i.getValue<string>()) },
    {
      id: "when",
      header: "When",
      accessorFn: (c) => (c.kind === "spanning" ? c.start : "\uffff"),
      cell: ({ row }) => <span className="dt-muted">{consumerWhen(row.original)}</span>,
    },
    ...(facetDim ? [tagColumn<Consumer>((c) => c.tags?.[facet!])] : []),
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button className="del" onClick={() => removeConsumer(row.original.id)} title="Delete">
          ✕
        </button>
      ),
    },
  ];

  const renderConsumerForm = (c: Consumer): ReactNode => (
    <div className="dt-form">
      <div className="field">
        <label>Name</label>
        <input className="control" value={c.label} onChange={(e) => updateConsumer(c.id, { label: e.target.value })} />
      </div>
      <div className="grid2">
        <label className="mini">
          {c.kind === "spanning" && c.shape.type !== "flat" ? "Base amount" : "Amount / day"}
          <input
            type="number"
            className="control"
            value={c.amount}
            onChange={(e) => updateConsumer(c.id, { amount: Number(e.target.value) })}
          />
        </label>
        <label className="mini">
          Track (optional)
          <input
            className="control"
            value={c.track ?? ""}
            placeholder="—"
            onChange={(e) => updateConsumer(c.id, { track: e.target.value || undefined })}
          />
        </label>
      </div>
      {c.kind === "spanning" && (
        <>
          <div className="grid2">
            <label className="mini">
              Start
              <input type="date" className="control" value={c.start} onChange={(e) => updateConsumer(c.id, { start: e.target.value })} />
            </label>
            <label className="mini">
              End
              <input type="date" className="control" value={c.end} onChange={(e) => updateConsumer(c.id, { end: e.target.value })} />
            </label>
          </div>
          <div className="hint">
            Shape: {c.shape.type}
            {c.shape.type === "phases" ? ` (${c.shape.phases.length} phases)` : ""} — edit shapes in the YAML tab.
          </div>
        </>
      )}
      {facetDim && (
        <label className="mini tag-field">
          {facetDim.label}
          <TagSelect tags={c.tags} onSet={(t) => updateConsumer(c.id, { tags: t })} />
        </label>
      )}
    </div>
  );

  // ---- Capacities ----
  const updateCapacity = (id: string, part: Partial<Capacity>) =>
    patch({ capacities: scenario.capacities.map((c) => (c.id === id ? { ...c, ...part } : c)) });
  const removeCapacity = (id: string) => patch({ capacities: scenario.capacities.filter((c) => c.id !== id) });
  const addCapacity = () => {
    const id = uid("cap");
    patch({ capacities: [...scenario.capacities, { id, label: "New capacity", amount: 100 }] });
    setExpandId(id);
  };

  const capacityColumns: ColumnDef<Capacity, any>[] = [
    expander,
    { accessorKey: "label", header: "Name", cell: (i) => <span className="dt-name">{i.getValue<string>()}</span> },
    { accessorKey: "amount", header: "Amount / day", cell: (i) => <span className="dt-num">{num(i.getValue<number>())}</span> },
    { accessorKey: "track", header: "Track", cell: (i) => trackCell(i.getValue<string>()) },
    ...(facetDim ? [tagColumn<Capacity>((c) => c.tags?.[facet!])] : []),
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button className="del" onClick={() => removeCapacity(row.original.id)} title="Delete">
          ✕
        </button>
      ),
    },
  ];

  const renderCapacityForm = (c: Capacity): ReactNode => (
    <div className="dt-form">
      <div className="field">
        <label>Name</label>
        <input className="control" value={c.label} onChange={(e) => updateCapacity(c.id, { label: e.target.value })} />
      </div>
      <div className="grid2">
        <label className="mini">
          Amount / day
          <input
            type="number"
            className="control"
            value={c.amount}
            onChange={(e) => updateCapacity(c.id, { amount: Number(e.target.value) })}
          />
        </label>
        <label className="mini">
          Track (optional)
          <input
            className="control"
            value={c.track ?? ""}
            placeholder="—"
            onChange={(e) => updateCapacity(c.id, { track: e.target.value || undefined })}
          />
        </label>
      </div>
      {facetDim && (
        <label className="mini tag-field">
          {facetDim.label}
          <TagSelect tags={c.tags} onSet={(t) => updateCapacity(c.id, { tags: t })} />
        </label>
      )}
    </div>
  );

  // ---- Reducers ----
  const updateReducer = (id: string, part: Partial<Reducer>) =>
    patch({ reducers: scenario.reducers.map((r) => (r.id === id ? { ...r, ...part } : r)) });
  const removeReducer = (id: string) => patch({ reducers: scenario.reducers.filter((r) => r.id !== id) });
  const addReducer = () => {
    const id = uid("red");
    patch({
      reducers: [
        ...scenario.reducers,
        { id, label: "New reducer", multiplier: 0.5, start: scenario.config.start, end: scenario.config.end },
      ],
    });
    setExpandId(id);
  };

  const reducerColumns: ColumnDef<Reducer, any>[] = [
    expander,
    { accessorKey: "label", header: "Name", cell: (i) => <span className="dt-name">{i.getValue<string>()}</span> },
    {
      accessorKey: "multiplier",
      header: "Multiplier",
      cell: (i) => <span className="dt-num">×{i.getValue<number>()}</span>,
    },
    { accessorKey: "track", header: "Track", cell: (i) => trackCell(i.getValue<string>()) },
    {
      id: "when",
      header: "When",
      accessorFn: (r) => r.start,
      cell: ({ row }) => (
        <span className="dt-muted">
          {shortDate(row.original.start)} – {shortDate(row.original.end)}
        </span>
      ),
    },
    ...(facetDim ? [tagColumn<Reducer>((r) => r.tags?.[facet!])] : []),
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button className="del" onClick={() => removeReducer(row.original.id)} title="Delete">
          ✕
        </button>
      ),
    },
  ];

  const renderReducerForm = (r: Reducer): ReactNode => (
    <div className="dt-form">
      <div className="field">
        <label>Name</label>
        <input className="control" value={r.label} onChange={(e) => updateReducer(r.id, { label: e.target.value })} />
      </div>
      <div className="grid2">
        <label className="mini">
          Multiplier (0–1)
          <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            className="control"
            value={r.multiplier}
            onChange={(e) => updateReducer(r.id, { multiplier: Number(e.target.value) })}
          />
        </label>
        <label className="mini">
          Track (optional)
          <input
            className="control"
            value={r.track ?? ""}
            placeholder="—"
            onChange={(e) => updateReducer(r.id, { track: e.target.value || undefined })}
          />
        </label>
      </div>
      <div className="grid2">
        <label className="mini">
          Start
          <input type="date" className="control" value={r.start} onChange={(e) => updateReducer(r.id, { start: e.target.value })} />
        </label>
        <label className="mini">
          End
          <input type="date" className="control" value={r.end} onChange={(e) => updateReducer(r.id, { end: e.target.value })} />
        </label>
      </div>
      {facetDim && (
        <label className="mini tag-field">
          {facetDim.label}
          <TagSelect tags={r.tags} onSet={(t) => updateReducer(r.id, { tags: t })} />
        </label>
      )}
    </div>
  );

  return (
    <div className="section">
      <h3>Data</h3>
      <div className="entry-tabs">
        <button className={tab === "consumers" ? "active" : ""} onClick={() => setTab("consumers")}>
          Consumers ({scenario.consumers.length})
        </button>
        <button className={tab === "capacities" ? "active" : ""} onClick={() => setTab("capacities")}>
          Capacity ({scenario.capacities.length})
        </button>
        <button className={tab === "reducers" ? "active" : ""} onClick={() => setTab("reducers")}>
          Reducers ({scenario.reducers.length})
        </button>
      </div>

      {tab === "consumers" && (
        <>
          <DataTable data={scenario.consumers} columns={consumerColumns} renderSubRow={renderConsumerForm} expandId={expandId} />
          <div className="add-row" style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={() => addConsumer("recurring")}>
              + Recurring
            </button>
            <button className="btn" onClick={() => addConsumer("spanning")}>
              + Spanning
            </button>
          </div>
        </>
      )}

      {tab === "capacities" && (
        <>
          <DataTable data={scenario.capacities} columns={capacityColumns} renderSubRow={renderCapacityForm} expandId={expandId} />
          <button className="btn add-row" onClick={addCapacity}>
            + Add capacity
          </button>
        </>
      )}

      {tab === "reducers" && (
        <>
          <DataTable data={scenario.reducers} columns={reducerColumns} renderSubRow={renderReducerForm} expandId={expandId} />
          <button className="btn add-row" onClick={addReducer}>
            + Add reducer
          </button>
        </>
      )}
    </div>
  );
}
