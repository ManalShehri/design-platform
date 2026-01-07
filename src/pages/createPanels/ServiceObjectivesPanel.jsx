export default function ServiceObjectivesSection({
  serviceObjectives,
  addServiceObjective,
  removeServiceObjective,
  updateServiceObjective,
}) {
  return (

<div className="mt-6 border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-800 text-sm">
                أهداف الخدمة (حتى 6)
              </h3>
              <button
                type="button"
                onClick={addServiceObjective}
                disabled={(serviceObjectives.length || 0) >= 6}
                className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
              >
                + إضافة هدف
              </button>
            </div>

            {serviceObjectives.map((obj, index) => (
              <div
                key={obj.id || index}
                className="border rounded-lg p-3 bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-600">
                    هدف رقم {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeServiceObjective(index)}
                    className="text-[11px] text-red-500"
                  >
                    حذف
                  </button>
                </div>

                <textarea
                  rows={3}
                  className="w-full border rounded-lg p-2 text-xs"
                  placeholder="نص الهدف..."
                  value={obj.text || ""}
                  onChange={(e) =>
                    updateServiceObjective(index, e.target.value)
                  }
                />
              </div>
            ))}
          </div>

           );
}