
/**
 * STR (Smith Travel Research) Global Mock Server
 * Simulates the industry standard for hotel benchmarking data.
 * 
 * Real API capabilities often include:
 * - Competitive Set Benchmarking
 * - Daily/Weekly/Monthly Performance Data
 * - Segmentation (Group vs Transient)
 */

interface StrResponse {
  property_id: string;
  reporting_period: string;
  kpis: {
    my_property: { adr: number; revpar: number; occupancy: number };
    comp_set: { adr: number; revpar: number; occupancy: number };
    indexes: {
      mpi: number; // Market Penetration Index (Occupancy)
      ari: number; // Average Rate Index (ADR)
      rgi: number; // Revenue Generation Index (RevPAR)
    };
  };
  segmentation: {
    transient: number; // Percentage
    group: number; // Percentage
  };
  status: number;
}

export const fetchStrTrendReport = async (
  hotelName: string, 
  location: string, 
  category: string
): Promise<StrResponse> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 600));

  // Logic to simulate realistic market variances
  // Luxury hotels typically have higher ADR but slightly lower Occ than Economy
  const isLuxury = category.toLowerCase().includes('luxury');
  const isNashville = location.toLowerCase().includes('nashville');
  
  // Base lines
  let baseAdr = isLuxury ? 350.00 : 120.00;
  let baseOcc = 0.75;
  
  // Market modifiers
  if (isNashville) {
    baseAdr += 20; // Hot market
    baseOcc += 0.05;
  }

  // Random variance for realism
  const variance = (Math.random() * 0.1) - 0.05; // +/- 5%

  const myAdr = baseAdr * (1 + variance);
  const myOcc = Math.min(0.98, baseOcc + variance);
  const myRevPar = myAdr * myOcc;

  // Comp Set (Competitive Set) logic
  // Usually the comp set is slightly stabilized
  const compAdr = baseAdr * 1.05; // Market is slightly higher
  const compOcc = baseOcc;
  const compRevPar = compAdr * compOcc;

  // Calculate STR Indexes (100 is fair share, >100 is outperforming)
  const ari = (myAdr / compAdr) * 100;
  const mpi = (myOcc / compOcc) * 100;
  const rgi = (myRevPar / compRevPar) * 100;

  return {
    property_id: `STR-${Math.floor(Math.random() * 10000)}`,
    reporting_period: "Last 30 Days",
    kpis: {
      my_property: {
        adr: parseFloat(myAdr.toFixed(2)),
        occupancy: parseFloat(myOcc.toFixed(2)),
        revpar: parseFloat(myRevPar.toFixed(2))
      },
      comp_set: {
        adr: parseFloat(compAdr.toFixed(2)),
        occupancy: parseFloat(compOcc.toFixed(2)),
        revpar: parseFloat(compRevPar.toFixed(2))
      },
      indexes: {
        ari: parseFloat(ari.toFixed(1)),
        mpi: parseFloat(mpi.toFixed(1)),
        rgi: parseFloat(rgi.toFixed(1))
      }
    },
    segmentation: {
      transient: 0.70,
      group: 0.30
    },
    status: 200
  };
};
