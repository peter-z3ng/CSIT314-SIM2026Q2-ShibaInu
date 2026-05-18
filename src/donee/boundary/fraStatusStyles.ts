export function getFRAStatusClass(status: string) {
  if (status === "completed") {
    return "bg-green-100 text-green-700";
  }

  if (status === "closed") {
    return "bg-red-100 text-red-600";
  }

  return "bg-[#fff2df] text-[#c77700]";
}
