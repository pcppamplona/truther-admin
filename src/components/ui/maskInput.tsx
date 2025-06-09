import { Input } from "@/components/ui/input";

type MaskInputProps = {
  mask: string; 
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export function MaskInput({ mask, value, onChange, placeholder }: MaskInputProps) {
  const applyMask = (raw: string, mask: string) => {
    const digits = raw.replace(/\D/g, "");
    let masked = "";
    let digitIndex = 0;

    for (let i = 0; i < mask.length; i++) {
      if (digitIndex >= digits.length) break;

      if (mask[i] === "9") {
        masked += digits[digitIndex];
        digitIndex++;
      } else {
        masked += mask[i];
      }
    }

    return masked;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const masked = applyMask(input, mask);
    onChange(masked);
  };

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      maxLength={mask.length}
    />
  );
}
