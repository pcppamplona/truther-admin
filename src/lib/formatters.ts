export const getInitials = (text: string): string => {
  return text
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const documentFormat = (value: any) => {
  if (!value) return "-"; 
  const convertValue = String(value);
  if (convertValue.length == 11) {
    return convertValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (convertValue.length == 14) {
    return convertValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
  return convertValue;
};

export const phoneFormat = (value: any) => {
  const convertValue = String(value).replace(/\D/g, '');

  // Formato: (99) 9999-9999
  if (convertValue.length === 10) {
    return convertValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  // Formato: (99) 99999-9999
  if (convertValue.length === 11) {
    return convertValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return value;
};

export const getFlagUrl = (countryCode: string): string => {
  if (!countryCode) return '';
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

export function dateFormat(dateStr: string) {
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}/${date.getFullYear()}`;
}

export function timeFormat(dateStr: string) {
  const date = new Date(dateStr);
  return `${String(date.getHours()).padStart(2, "0")}h${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}