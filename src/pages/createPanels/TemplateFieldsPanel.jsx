export default function TemplateFieldsSection({
  fields,
  formData,
  handleChange,
  handleFileChange,
}) {
  return (

        <div className="mt-4 grid gap-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1">
              <label className="font-semibold text-slate-700">{f.label}</label>

              {f.type === "textarea" && (
                <textarea
                  name={f.name}
                  rows={4}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  onChange={handleChange}
                  value={formData[f.name] || ""}
                  placeholder={f.label}
                />
              )}

              {f.type === "text" && (
                <input
                  type="text"
                  name={f.name}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  onChange={handleChange}
                  value={formData[f.name] || ""}
                  placeholder={f.label}
                />
              )}

              {f.type === "file" && (
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-lg p-2 text-sm bg-white"
                  onChange={(e) =>
                    handleFileChange(f.name, e.target.files[0])
                  }
                />
              )}
            </div>
          ))}
        </div>
         );
};