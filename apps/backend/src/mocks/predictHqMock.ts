
/**
 * PredictHQ Mock Server
 * Simulates the leading demand intelligence API.
 * 
 * Key Data Points modeled:
 * - phq_rank: Proprietary importance score (0-100)
 * - phq_attendance: Predicted attendance numbers
 * - category: 'conferences', 'sports', 'concerts', 'expos'
 */

interface PredictHqEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  labels: string[];
  rank: number; // 0-100 importance
  phq_attendance: number;
  start: string;
  end: string;
  location: [number, number]; // [lon, lat]
  venue?: string;
}

interface PredictHqResponse {
  count: number;
  results: PredictHqEvent[];
  overflow: boolean;
}

export const fetchPredictHqEvents = async (
  location: string, 
  radiusKm: number = 10
): Promise<PredictHqResponse> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const city = location.toLowerCase();
  let events: PredictHqEvent[] = [];
  const today = new Date();
  
  const createDate = (daysToAdd: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysToAdd);
    return d.toISOString().split('T')[0];
  };

  if (city.includes('nashville')) {
    events = [
      {
        id: "evt_nash_001",
        title: "Global Tech Healthcare Summit",
        description: "Annual gathering of healthcare technology leaders.",
        category: "conferences",
        labels: ["medical", "tech", "business"],
        rank: 85,
        phq_attendance: 18500,
        start: createDate(14),
        end: createDate(17),
        location: [-86.7816, 36.1627],
        venue: "Music City Center"
      },
      {
        id: "evt_nash_002",
        title: "Titans vs Chiefs",
        description: "NFL Regular Season Game",
        category: "sports",
        labels: ["football", "nfl"],
        rank: 92,
        phq_attendance: 69000,
        start: createDate(35),
        end: createDate(35),
        location: [-86.7713, 36.1665],
        venue: "Nissan Stadium"
      },
      {
        id: "evt_nash_003",
        title: "CMA Music Festival",
        description: "The ultimate country music fan experience.",
        category: "concerts",
        labels: ["music", "country", "festival"],
        rank: 100,
        phq_attendance: 90000,
        start: createDate(60),
        end: createDate(64),
        location: [-86.7744, 36.1600],
        venue: "Downtown Nashville"
      }
    ];
  } else if (city.includes('new york') || city.includes('nyc')) {
    events = [
      {
        id: "evt_nyc_001",
        title: "New York Fashion Week",
        description: "Bi-annual fashion series.",
        category: "expos",
        labels: ["fashion", "retail"],
        rank: 98,
        phq_attendance: 125000,
        start: createDate(10),
        end: createDate(17),
        location: [-74.0060, 40.7128],
        venue: "Various Locations"
      },
      {
        id: "evt_nyc_002",
        title: "UN General Assembly",
        description: "Annual gathering of world leaders.",
        category: "politics",
        labels: ["diplomacy", "government"],
        rank: 95,
        phq_attendance: 10000, // Low attendance but high impact on room blocks
        start: createDate(25),
        end: createDate(30),
        location: [-73.9680, 40.7489],
        venue: "UN Headquarters"
      }
    ];
  } else {
    // Generic Events for other cities
    events = [
      {
        id: "evt_gen_001",
        title: "Regional Business Expo",
        description: "Local networking event.",
        category: "conferences",
        labels: ["business"],
        rank: 40,
        phq_attendance: 2500,
        start: createDate(5),
        end: createDate(6),
        location: [0, 0],
        venue: "Convention Center"
      }
    ];
  }

  return {
    count: events.length,
    results: events,
    overflow: false
  };
};
