  export default function WorkshopSection({
  inviteAgendaItems,
  addAgendaItem,
  removeAgendaItem,
  updateAgendaItem,

  inviteBoxes,
  addBox,
  removeBox,
  updateBox,

  workshopIconSearch,
  setWorkshopIconSearch,
  filterIconOptions,
}) {
  return (
      <>
            {/* محاور الورشة */}
            <div className="mt-6 border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-brand-800 text-sm">
                  محاور الورشة (حتى 6)
                </h3>
                <button
                  type="button"
                  onClick={addAgendaItem}
                  disabled={(inviteAgendaItems.length || 0) >= 6}
                  className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
                >
                  + إضافة محور
                </button>
              </div>

              {inviteAgendaItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border rounded-lg p-3 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600">
                      محور رقم {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="text-[11px] text-red-500"
                    >
                      حذف
                    </button>
                  </div>

                  <input
                    type="text"
                    className="w-full border rounded-lg px-2 py-1 text-xs"
                    placeholder="عنوان المحور"
                    value={item.title || ""}
                    onChange={(e) =>
                      updateAgendaItem(index, "title", e.target.value)
                    }
                  />

                  <textarea
                    rows={3}
                    className="w-full border rounded-lg p-2 text-xs"
                    placeholder="وصف المحور..."
                    value={item.body || ""}
                    onChange={(e) =>
                      updateAgendaItem(index, "body", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {/* الصناديق الخضراء */}
            <div className="mt-6 border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-brand-800 text-sm">
                  الأيقونات   (حتى 5)
                </h3>
                <button
                  type="button"
                  onClick={addBox}
                  disabled={(inviteBoxes.length || 0) >= 5}
                  className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
                >
                  + إضافة أيقونة
                </button>
              </div>

            {inviteBoxes.map((box, index) => {
              const searchTerm = workshopIconSearch[box.id] || "";
              const filteredOptions = filterIconOptions(searchTerm);

              return (
                <div
                  key={box.id || index}
                  className="border rounded-lg p-3 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600">
                      أيقونة رقم {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBox(index)}
                      className="text-[11px] text-red-500"
                    >
                      حذف
                    </button>
                  </div>

                  {/* العنوان */}
                  <input
                    type="text"
                    className="border rounded-lg px-2 py-1 text-xs w-full"
                    placeholder="العنوان (مثال: التاريخ)"
                    value={box.label || ""}
                    onChange={(e) => updateBox(index, "label", e.target.value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] gap-2">
                    {/* 🔍 بحث + قائمة الأيقونات */}
                    <div className="space-y-1">
                      <input
                        className="w-full border rounded-lg px-2 py-1 text-xs"
                        placeholder="ابحث عن الأيقونة (وقت، تاريخ، بريد، أمن...)"
                        value={searchTerm}
                        onChange={(e) =>
                          setWorkshopIconSearch((prev) => ({
                            ...prev,
                            [box.id]: e.target.value,
                          }))
                        }
                      />

                      <select
                        className="w-full border rounded-lg px-2 py-2 text-xs"
                        value={box.iconKey || ""}
                        onChange={(e) =>
                          updateBox(index, "iconKey", e.target.value)
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

                    {/* نص البوكس */}
                    <textarea
                      rows={2}
                      className="w-full border rounded-lg p-2 text-xs"
                      placeholder="النص ..."
                      value={box.text || ""}
                      onChange={(e) =>
                        updateBox(index, "text", e.target.value)
                      }
                    />
                  </div>
                </div>
              );
            })}
            </div>
          </>

            );
}