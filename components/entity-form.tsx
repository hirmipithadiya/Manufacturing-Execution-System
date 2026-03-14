import { createMesRecordAction } from "@/lib/mes-actions";
import { Card } from "@/components/ui";

type FieldOption = {
  label: string;
  value: string;
};

type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "number" | "datetime-local" | "date" | "textarea" | "select";
  options?: FieldOption[];
  step?: string;
};

function getFieldHint(field: FieldConfig) {
  if (field.type === "textarea") {
    return "Use one line per item where it makes sense.";
  }

  if (field.type === "select") {
    return "Choose the option that best matches this record.";
  }

  if (field.type === "datetime-local") {
    return "Enter the local date and time for this activity.";
  }

  if (field.type === "date") {
    return "Choose the effective calendar date.";
  }

  if (field.type === "number") {
    return "Numbers only.";
  }

  return null;
}

export function EntityForm({
  entity,
  path,
  title,
  description,
  fields,
  submitLabel = "Save record",
}: {
  entity: string;
  path: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  submitLabel?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
          Guided form
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-3 text-base leading-8 text-slate-600">{description}</p>
      </div>

      <form action={createMesRecordAction} className="mt-6 space-y-4">
        <input name="entity" type="hidden" value={entity} />
        <input name="path" type="hidden" value={path} />

        <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Fill in the key details</p>
              <p className="mt-1 text-sm text-slate-600">
                Required fields are marked clearly, and your changes will appear on this page after saving.
              </p>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
              Step 1 of 1
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label
              key={field.name}
              className={field.type === "textarea" ? "md:col-span-2" : ""}
            >
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                {field.label}
                {field.required ? (
                  <span className="rounded-full bg-[#edf5f1] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#265543]">
                    Required
                  </span>
                ) : null}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#265543] focus:bg-white"
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ) : field.type === "select" ? (
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#265543] focus:bg-white"
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                >
                  <option disabled value="">
                    Select {field.label.toLowerCase()}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#265543] focus:bg-white"
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  step={field.step}
                  type={field.type ?? "text"}
                />
              )}
              {getFieldHint(field) ? (
                <span className="mt-2 block text-xs leading-5 text-slate-500">{getFieldHint(field)}</span>
              ) : null}
            </label>
          ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-600">
            Save when you’re ready. This keeps the workflow simple and updates the visible list on the page.
          </p>
          <button
            className="rounded-full bg-[#265543] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4537]"
            type="submit"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Card>
  );
}
