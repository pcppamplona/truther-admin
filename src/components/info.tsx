import React from "react";

export function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | React.ReactNode;
}) {
  // Lança erro se for objeto sem ser um React Element
  if (typeof value === "object" && !React.isValidElement(value) && value !== null) {
    console.error("Valor inválido passado para <Info />:", value);
    value = "-";
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <strong className="text-sm break-all">{value ?? "-"}</strong>
    </div>
  );
}
