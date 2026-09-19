import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  errors?: string[]
}

/** Labeled input that shows Laravel's 422 messages for its field. */
export function FormField({ label, errors, id, name, ...rest }: Props) {
  const inputId = id ?? name
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        aria-invalid={errors?.length ? true : undefined}
        className="h-10 w-full rounded-lg border border-input bg-input/30 px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive"
        {...rest}
      />
      {errors?.map((m) => (
        <p key={m} className="text-xs text-destructive">
          {m}
        </p>
      ))}
    </div>
  )
}
