export function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-[#475467]">{label}</p>
      <strong className="text-sm break-all">{value || "-"}</strong>
    </div>
  );
}
