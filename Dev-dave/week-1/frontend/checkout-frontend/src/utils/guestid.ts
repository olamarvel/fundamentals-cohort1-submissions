export default function getGuestId() {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = "guest_" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
}
