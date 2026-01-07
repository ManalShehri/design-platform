export default function ExecutiveSummarySection({
  execRows,
  addExecRow,
  removeExecRow,
  updateExecRow,
}) {
  return (
<div className="mt-6 border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-800 text-sm">صفوف الجدول (حتى 6)</h3>
              <button
                type="button"
                onClick={addExecRow}
                disabled={execRows.length >= 6}
                className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
              >
                + إضافة صف
              </button>
            </div>

            {execRows.map((row, idx) => (
              <div key={row.id || idx} className="border rounded-lg p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">صف رقم {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExecRow(idx)}
                    className="text-[11px] text-red-500"
                  >
                    حذف
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="w-full border rounded-lg px-2 py-2 text-xs"
                    placeholder="العمود الأول"
                    value={row.col1 || ""}
                    onChange={(e) => updateExecRow(idx, "col1", e.target.value)}
                  />
                  <input
                    className="w-full border rounded-lg px-2 py-2 text-xs"
                    placeholder="العمود الثاني"
                    value={row.col2 || ""}
                    onChange={(e) => updateExecRow(idx, "col2", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
            );
}