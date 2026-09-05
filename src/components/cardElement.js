/**
 * Card Element Component Factory
 * Creates and formats CSS3D card DOM elements according to Net Worth tiers.
 */

export function createCardElement(item) {
  const element = document.createElement("div");
  element.className = "element";

  // Tier Thresholds: Red < $100K, Yellow/Orange $100K - $200K, Green > $200K
  let borderCol = "#EF3022";
  let bgCol = "rgba(239, 48, 34, 0.18)";
  let shadowCol = "rgba(239, 48, 34, 0.45)";

  if (item.netWorth > 200000) {
    borderCol = "#3AB54A";
    bgCol = "rgba(58, 181, 74, 0.18)";
    shadowCol = "rgba(58, 181, 74, 0.45)";
  } else if (item.netWorth >= 100000) {
    borderCol = "#F7931E";
    bgCol = "rgba(247, 147, 30, 0.18)";
    shadowCol = "rgba(247, 147, 30, 0.45)";
  }

  element.style.borderColor = borderCol;
  element.style.backgroundColor = bgCol;
  element.style.boxShadow = `0 0 14px ${shadowCol}`;

  // Card Header: Country (Top-Left) & Record Index (Top-Right)
  const header = document.createElement("div");
  header.className = "card-header";

  const country = document.createElement("span");
  country.className = "card-country";
  country.textContent = item.country || "MY";

  const number = document.createElement("span");
  number.className = "card-number";
  number.textContent = item.id || "0";

  header.appendChild(country);
  header.appendChild(number);
  element.appendChild(header);

  // Avatar Image: Rectangular portrait photo
  const img = document.createElement("img");
  img.className = "avatar";
  img.src = item.photo;
  img.alt = item.name;
  img.onerror = () => {
    img.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=60";
  };
  element.appendChild(img);

  // Candidate Name
  const name = document.createElement("div");
  name.className = "name";
  name.textContent = item.name;
  element.appendChild(name);

  // Candidate Interest
  const interest = document.createElement("div");
  interest.className = "interest";
  interest.textContent = item.interest || "Interest";
  element.appendChild(interest);

  return element;
}
