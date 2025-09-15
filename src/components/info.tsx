import React from "react";

export function Info({
  label,
  value,
}: {
  label: string | React.ReactNode;
  value?: string | number | null | React.ReactNode;
}) {
  if (typeof value === "object" && !React.isValidElement(value) && value !== null) {
    console.error("Valor inválido passado para <Info />:", value);
    value = "-";
  }

  return (
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground">{label}</p>

      <div className="text-sm w-full min-w-0 break-words whitespace-pre-wrap">
        {value ?? "-"}
      </div>
    </div>
  );
}
