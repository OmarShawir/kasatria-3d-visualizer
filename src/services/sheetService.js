import Papa from "papaparse";

export function parseCurrency(val) {
  if (!val) return 0;
  return parseFloat(String(val).replace(/[^0-9.-]+/g, "")) || 0;
}

export async function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          resolve(generateSampleData(200));
          return;
        }
        const cleaned = results.data.map((item, idx) => ({
          id: idx + 1,
          name: item.Name || item.name || `Person ${idx + 1}`,
          photo: item.Photo || item.photo || "",
          age: item.Age || item.age || Math.floor(Math.random() * 35 + 22),
          country: item.Country || item.country || "MY",
          interest: item.Interest || item.interest || "Technology",
          rawNetWorth: (item["Net Worth"] || item[" Net Worth "] || item.netWorth || "$150,000.00").trim(),
          netWorth: parseCurrency(item["Net Worth"] || item[" Net Worth "] || item.netWorth || "150000")
        }));
        resolve(cleaned);
      },
      error: (err) => {
        reject(err);
      }
    });
  });
}

export async function fetchSheetData(url) {
  if (!url || url.includes("YOUR_GOOGLE_SHEET") || url.includes("2PACX-1vTQg3x9N54G4lW7W0sR8G9vR-sample")) {
    console.warn("Using sample mock dataset of 200 records.");
    return generateSampleData(200);
  }

  try {
    const cacheBusterUrl = url.includes("?") 
      ? `${url}&_t=${Date.now()}`
      : `${url}?_t=${Date.now()}`;

    const response = await fetch(cacheBusterUrl, {
      cache: "no-store",
      headers: {
        "Pragma": "no-cache",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            resolve(generateSampleData(200));
            return;
          }
          const cleaned = results.data.map((item, idx) => ({
            id: idx + 1,
            name: item.Name || item.name || `Person ${idx + 1}`,
            photo: item.Photo || item.photo || "",
            age: item.Age || item.age || Math.floor(Math.random() * 35 + 22),
            country: item.Country || item.country || "MY",
            interest: item.Interest || item.interest || "Technology",
            rawNetWorth: (item["Net Worth"] || item[" Net Worth "] || item.netWorth || "$150,000.00").trim(),
            netWorth: parseCurrency(item["Net Worth"] || item[" Net Worth "] || item.netWorth || "150000")
          }));
          resolve(cleaned);
        },
        error: (err) => {
          console.warn("Error parsing CSV data, loading sample dataset:", err);
          resolve(generateSampleData(200));
        }
      });
    });
  } catch (err) {
    console.warn("Error fetching CSV from Google Sheets, loading sample dataset:", err);
    return generateSampleData(200);
  }
}

function generateSampleData(count = 200) {
  const names = [
    "Alex Morgan", "Sarah Chen", "Marcus Vance", "Elena Rostova", "Liam O'Connor",
    "Aisha Patel", "Dmitri Volkov", "Keiko Tanaka", "Gabriel Silva", "Chloe Dubois",
    "Hannah Abbott", "Lucas Meyer", "Zahra Al-Mansoor", "Mateo Rossi", "Siddharth Rao",
    "Freja Lindqvist", "Tariq Hassani", "Mei-Ling Zhou", "Carlos Mendoza", "Ingrid Bergman"
  ];
  const countries = ["MY", "SG", "US", "CN", "UK", "JP", "DE", "FR", "AU", "IN", "KR", "BR", "CA", "CH", "SE"];
  const interests = ["AI", "Writing", "Cooking", "Gaming", "Traveling", "Photography", "Chess", "Design", "Music", "Fitness", "Crypto", "Robotics"];
  const samplePhotos = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=60"
  ];

  return Array.from({ length: count }, (_, idx) => {
    const name = `${names[idx % names.length]} #${idx + 1}`;
    // Generate a distribution of net worths covering <100k (red), 100k-200k (orange), >200k (green)
    let netWorthVal;
    if (idx % 3 === 0) {
      netWorthVal = Math.floor(Math.random() * 60000 + 35000); // <100k (Red)
    } else if (idx % 3 === 1) {
      netWorthVal = Math.floor(Math.random() * 95000 + 105000); // 100k-200k (Orange)
    } else {
      netWorthVal = Math.floor(Math.random() * 750000 + 205000); // >200k (Green)
    }

    const formattedWorth = "$" + netWorthVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return {
      id: idx + 1,
      name: name,
      photo: samplePhotos[idx % samplePhotos.length],
      age: Math.floor(Math.random() * 35 + 22),
      country: countries[idx % countries.length],
      interest: interests[idx % interests.length],
      rawNetWorth: formattedWorth,
      netWorth: netWorthVal
    };
  });
}
