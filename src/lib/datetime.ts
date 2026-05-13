export function toDateTimeInputValue(date: string | null) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDateTime(date: string | null) {
  if (!date) {
    return "No date";
  }

  return new Date(date)
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replaceAll("/", "-");
}

export function getTimeLeft(endDate: string | null) {
  if (!endDate) {
    return "No deadline";
  }

  const now = new Date();
  const deadline = new Date(endDate);
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return "Deadline passed";
  }

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) {
    return `${days} days ${hours} hours left`;
  }

  return `${hours} hours ${minutes} minutes left`;
}