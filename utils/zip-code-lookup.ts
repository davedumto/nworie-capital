// export type AreaType = 'urban' | 'rural';

// interface ZipCodeClassification {
//   zipCode: string;
//   areaType: AreaType;
//   confidence: 'high' | 'medium' | 'low';
//   source: 'census_api' | 'population_threshold' | 'fallback';
// }

// export interface ZipCodeLookupResult {
//   found: boolean;
//   classification?: ZipCodeClassification;
//   error?: string;
// }

// // Simple cache - might need redis later for production
// const cache = new Map<string, { data: ZipCodeClassification; time: number }>();
// const CACHE_TIME = 24 * 60 * 60 * 1000; // 24hrs

// export class ZipCodeLookup {
//   private static readonly CENSUS_BASE = process.env.CENSUS_API_BASE_URL || 'https://api.census.gov/data/2023/acs/acs5';
//   private static readonly API_KEY = process.env.CENSUS_API_KEY;
  
//   // Get population from census - sometimes flaky but works most of the time
//   private static async getPopulation(zip: string): Promise<number | null> {
//     try {
//       const baseUrl = `${this.CENSUS_BASE}?get=B01003_001E&for=zip%20code%20tabulation%20area:${zip}`;
//       const url = this.API_KEY ? `${baseUrl}&key=${this.API_KEY}` : baseUrl;
      
//       const response = await fetch(url);
//       if (!response.ok) return null;

//       const data = await response.json();
//       if (data && data.length >= 2 && data[1] && data[1][0]) {
//         const pop = parseInt(data[1][0], 10);
//         return !isNaN(pop) && pop > 0 ? pop : null;
//       }
      
//       return null;
//     } catch (err) {
//       console.log(`Census lookup failed for ${zip}:`, err);
//       return null;
//     }
//   }

//   private static classifyByPop(population: number): AreaType {
//     return population >= 25000 ? 'urban' : 'rural';
//   }

//   private static getFallback(zip: string): ZipCodeClassification {
//     const urbanPrefixes = [
//       '10', '11', '100', '101', '102', '103', '104', // NYC
//       '900', '901', '902', '903', '904', '905', '906', '907', '908', // CA
//       '606', '607', '608', // Chicago
//       '770', '771', '772', '773', '774', '775', // Houston/Dallas
//       '331', '332', '333', // Miami
//       '850', '851', '852', // Phoenix
//       '191', '192', '193', '194', // Philly
//       '787', '788', // Austin
//       '972', '973', // Portland
//       '303', '304', // Atlanta
//       '200', '201', '202', '203', '204', '205', // DC
//       '981', '982', // Seattle
//       '021', '022', '023', '024', '025', // Boston
//       '802', '803', // Denver
//       '891', '892', // Vegas
//       '372', '373', // Nashville
//       '731', '732', // OKC
//       '641', '642', // KC
//       '631', '632', // STL
//       '441', '442', // Cleveland
//     ];

//     const isUrban = urbanPrefixes.some(prefix => zip.startsWith(prefix));
    
//     return {
//       zipCode: zip,
//       areaType: isUrban ? 'urban' : 'rural',
//       confidence: 'low',
//       source: 'fallback'
//     };
//   }

//   static async classifyZipCode(zipCode: string): Promise<ZipCodeLookupResult> {

//     const cleanZip = zipCode.replace(/\D/g, '').slice(0, 5);
    
//     if (cleanZip.length !== 5) {
//       return {
//         found: false,
//         error: 'Need a 5-digit zip code'
//       };
//     }

//     const cached = cache.get(cleanZip);
//     if (cached && (Date.now() - cached.time) < CACHE_TIME) {
//       return {
//         found: true,
//         classification: cached.data
//       };
//     }

//     try {

//       const population = await this.getPopulation(cleanZip);
      
//       if (population !== null) {
//         const result: ZipCodeClassification = {
//           zipCode: cleanZip,
//           areaType: this.classifyByPop(population),
//           confidence: 'high',
//           source: 'census_api'
//         };

//         cache.set(cleanZip, {
//           data: result,
//           time: Date.now()
//         });
        
//         return {
//           found: true,
//           classification: result
//         };
//       }
//     } catch (err) {
//       console.log('Census API failed:', err);
//     }

//     const fallback = this.getFallback(cleanZip);

//     cache.set(cleanZip, {
//       data: fallback,
//       time: Date.now()
//     });

//     return {
//       found: true,
//       classification: fallback
//     };
//   }
//   static async batchClassify(zipCodes: string[], delay: number = 100): Promise<ZipCodeLookupResult[]> {
//     const results: ZipCodeLookupResult[] = [];
    
//     for (const zip of zipCodes) {
//       const result = await this.classifyZipCode(zip);
//       results.push(result);

//       if (delay > 0) {
//         await new Promise(resolve => setTimeout(resolve, delay));
//       }
//     }
    
//     return results;
//   }

//   static async isRural(zip: string): Promise<boolean> {
//     const result = await this.classifyZipCode(zip);
//     return result.classification?.areaType === 'rural' || false;
//   }

//   static async isUrban(zip: string): Promise<boolean> {
//     const result = await this.classifyZipCode(zip);
//     return result.classification?.areaType === 'urban' || false;
//   }

//   static isValidZip(zip: string): boolean {
//     const clean = zip.replace(/\D/g, '');
//     return clean.length === 5;
//   }

//   static clearCache(): void {
//     cache.clear();
//   }

//   static getCacheStats(): { size: number; rural: number; urban: number } {
//     const items = Array.from(cache.values());
//     return {
//       size: items.length,
//       rural: items.filter(c => c.data.areaType === 'rural').length,
//       urban: items.filter(c => c.data.areaType === 'urban').length
//     };
//   }
// }

// export const testUsage = {
//   async basic() {
//     const result = await ZipCodeLookup.classifyZipCode('10001');
//     console.log('NYC zip:', result.classification?.areaType); 
    
//     const rural = await ZipCodeLookup.isRural('59718'); 
//     console.log('Montana rural?', rural);
    
//     const urban = await ZipCodeLookup.isUrban('90210'); 
//     console.log('Beverly Hills urban?', urban);
//   },

//   async batch() {
//     const zips = ['10001', '90210', '59718', '05001', '77001'];
//     const results = await ZipCodeLookup.batchClassify(zips);
    
//     results.forEach(result => {
//       if (result.found && result.classification) {
//         console.log(`${result.classification.zipCode}: ${result.classification.areaType}`);
//       }
//     });
//   }
// };



export type AreaType = 'urban' | 'rural';

interface ZipCodeClassification {
  zipCode: string;
  areaType: AreaType;
  confidence: 'high' | 'medium' | 'low';
  source: 'census_api';
}

export interface ZipCodeLookupResult {
  found: boolean;
  classification?: ZipCodeClassification;
  error?: string;
}

const cache = new Map<string, { data: ZipCodeClassification; time: number }>();
const CACHE_TIME = 24 * 60 * 60 * 1000; // 24hrs

export class ZipCodeLookup {
  private static readonly CENSUS_BASE = process.env.CENSUS_API_BASE_URL || 'https://api.census.gov/data/2023/acs/acs5';
  private static readonly API_KEY = process.env.CENSUS_API_KEY;
  
  
  private static async getPopulation(zip: string): Promise<number | null> {
    try {
      const baseUrl = `${this.CENSUS_BASE}?get=B01003_001E&for=zip%20code%20tabulation%20area:${zip}`;
      const url = this.API_KEY ? `${baseUrl}&key=${this.API_KEY}` : baseUrl;
      
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) return null; // Zip not found
        throw new Error(`Census API returned ${response.status}`);
      }

      const data = await response.json();
      if (data && data.length >= 2 && data[1] && data[1][0]) {
        const pop = parseInt(data[1][0], 10);
        return !isNaN(pop) && pop > 0 ? pop : null;
      }
      
      return null; 
    } catch (err) {
      console.log(`Census API failed for ${zip}:`, err);
      throw err;
    }
  }

  private static classifyByPop(population: number): AreaType {
    return population >= 25000 ? 'urban' : 'rural';
  }

  static async classifyZipCode(zipCode: string): Promise<ZipCodeLookupResult> {

    const cleanZip = zipCode.replace(/\D/g, '').slice(0, 5);
    
    if (cleanZip.length !== 5) {
      return {
        found: false,
        error: 'Please enter a valid 5-digit zip code'
      };
    }

    const cached = cache.get(cleanZip);
    if (cached && (Date.now() - cached.time) < CACHE_TIME) {
      return {
        found: true,
        classification: cached.data
      };
    }

    try {
      const population = await this.getPopulation(cleanZip);
      
      if (population === null) {
        return {
          found: false,
          error: 'Zip code not found in our database'
        };
      }

      const result: ZipCodeClassification = {
        zipCode: cleanZip,
        areaType: this.classifyByPop(population),
        confidence: 'high',
        source: 'census_api'
      };

      cache.set(cleanZip, {
        data: result,
        time: Date.now()
      });
      
      return {
        found: true,
        classification: result
      };

    } catch (err) {
      console.log('Census API error:', err);
      return {
        found: false,
        error: 'Unable to verify zip code at this time. Please try again in a few minutes or contact support if the issue persists.'
      };
    }
  }

  static async batchClassify(zipCodes: string[], delay: number = 100): Promise<ZipCodeLookupResult[]> {
    const results: ZipCodeLookupResult[] = [];
    
    for (const zip of zipCodes) {
      const result = await this.classifyZipCode(zip);
      results.push(result);

      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return results;
  }
  static async isRural(zip: string): Promise<boolean | null> {
    const result = await this.classifyZipCode(zip);
    if (!result.found) return null; 
    return result.classification?.areaType === 'rural' || false;
  }

  static async isUrban(zip: string): Promise<boolean | null> {
    const result = await this.classifyZipCode(zip);
    if (!result.found) return null; 
    return result.classification?.areaType === 'urban' || false;
  }

  static isValidZip(zip: string): boolean {
    const clean = zip.replace(/\D/g, '');
    return clean.length === 5;
  }


  static clearCache(): void {
    cache.clear();
  }

  static getCacheStats(): { size: number; rural: number; urban: number } {
    const items = Array.from(cache.values());
    return {
      size: items.length,
      rural: items.filter(c => c.data.areaType === 'rural').length,
      urban: items.filter(c => c.data.areaType === 'urban').length
    };
  }
}

export const testUsage = {
  async basic() {
    const result = await ZipCodeLookup.classifyZipCode('10001');
    if (result.found) {
      console.log('NYC zip:', result.classification?.areaType);
    } else {
      console.log('Error:', result.error);
    }
    
    const rural = await ZipCodeLookup.isRural('59718');
    if (rural === null) {
      console.log('Could not check Montana zip');
    } else {
      console.log('Montana rural?', rural);
    }
  },

  async handleErrors() {
    const invalid = await ZipCodeLookup.classifyZipCode('123');
    console.log('Invalid zip result:', invalid.error);

    const fake = await ZipCodeLookup.classifyZipCode('00000');
    console.log('Fake zip result:', fake.error);
  }
};
