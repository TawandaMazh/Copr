/** Format Zambian Kwacha as "K 450.00" */
export function formatKwacha(amount: number): string {
  const formatted = amount.toLocaleString("en-ZM", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `K ${formatted}`;
}

/** Normalize / display Zambian phone numbers in +260 format */
export function formatPhoneZM(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("260") && digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+260 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (digits.length === 9) {
    return `+260 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return phone.startsWith("+") ? phone : `+260 ${phone}`;
}
