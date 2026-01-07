export default function SafetySection({
  safetyItems,
  addSafetyItem,
  removeSafetyItem,
  updateSafetyItem,

  safetyIconSearch,
  setSafetyIconSearch,
  filterIconOptions,
}) {
  return (
 <div className="mt-6 border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-800 text-sm">
                عناصر البوستر (حتى 4)
              </h3>
              <button
                type="button"
                onClick={addSafetyItem}
                disabled={(safetyItems.length || 0) >= 4}
                className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
              >
                + إضافة عنصر
              </button>
            </div>

            {safetyItems.map((item, index) => {
              const searchTerm = safetyIconSearch[item.id] || "";
              const filteredOptions = filterIconOptions(searchTerm);

              return (
                <div
                  key={item.id || index}
                  className="border rounded-lg p-3 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600">
                      عنصر رقم {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSafetyItem(index)}
                      className="text-[11px] text-red-500"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] gap-2">
                    {/* 🔍 حقل بحث عن الأيقونة */}
                    <div className="space-y-1">
                      <input
                        className="w-full border rounded-lg px-2 py-1 text-xs"
                        placeholder="ابحث عن الأيقونة (مثال: سلامة، بريد، أمن...)"
                        value={searchTerm}
                        onChange={(e) =>
                          setSafetyIconSearch((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                      />

                      {/* اختيار الأيقونة من القائمة المفلترة */}
                      <select
                        className="w-full border rounded-lg px-2 py-2 text-xs"
                        value={item.iconKey || ""}
                        onChange={(e) =>
                          updateSafetyItem(index, "iconKey", e.target.value)
                        }
                      >
                        <option value="">اختر الأيقونة...</option>
                        {filteredOptions.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.preview} {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* نص العنصر */}
                    <textarea
                      rows={2}
                      className="w-full border rounded-lg p-2 text-xs"
                      placeholder="نص الإرشاد أو المعلومة..."
                      value={item.text || ""}
                      onChange={(e) =>
                        updateSafetyItem(index, "text", e.target.value)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
 );
}