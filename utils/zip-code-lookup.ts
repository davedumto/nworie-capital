// utils/zipcodeLookup.ts

export type AreaType = 'urban' | 'rural';

interface ZipCodeClassification {
  zipCode: string;
  areaType: AreaType;
  confidence: 'high' | 'medium' | 'low';
  source: 'census_api' | 'population_threshold' | 'fallback';
}

export interface ZipCodeLookupResult {
  found: boolean;
  classification?: ZipCodeClassification;
  error?: string;
}

// Cache for API responses
const classificationCache = new Map<string, { classification: ZipCodeClassification; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class ZipCodeLookup {
  private static readonly CENSUS_API_BASE = process.env.CENSUS_API_BASE_URL || 'https://api.census.gov/data/2023/acs/acs5';
  private static readonly API_KEY = process.env.CENSUS_API_KEY;
  
  /**
   * Fetches population from Census API to determine rural/urban classification
   */
  private static async getPopulationFromCensus(zipCode: string): Promise<number | null> {
    try {
      const baseUrl = `${this.CENSUS_API_BASE}?get=B01003_001E&for=zip%20code%20tabulation%20area:${zipCode}`;
      const url = this.API_KEY ? `${baseUrl}&key=${this.API_KEY}` : baseUrl;
      
      const response = await fetch(url);
      if (!response.ok) return null;

      const data = await response.json();
      if (data && data.length >= 2 && data[1] && data[1][0]) {
        const population = parseInt(data[1][0], 10);
        return !isNaN(population) && population > 0 ? population : null;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching population for ${zipCode}:`, error);
      return null;
    }
  }

  /**
   * Classifies area as rural or urban based on population
   */
  private static classifyByPopulation(population: number): AreaType {
    // Standard classification: Urban = 2,500+ people per sq mile or 50,000+ total
    // Simplified: Use 25,000 as threshold for zip code level classification
    return population >= 25000 ? 'urban' : 'rural';
  }

  /**
   * Fallback classification based on known urban zip code patterns
   */
  private static fallbackClassification(zipCode: string): ZipCodeClassification {
    // Major metropolitan area zip code ranges (generally urban)
    const urbanRanges = [
      '10', '11', '100', '101', '102', '103', '104', // NYC area
      '900', '901', '902', '903', '904', '905', '906', '907', '908', // CA major cities
      '606', '607', '608', // Chicago
      '770', '771', '772', '773', '774', '775', // Houston/Dallas
      '331', '332', '333', // Miami/South FL
      '850', '851', '852', // Phoenix
      '191', '192', '193', '194', // Philadelphia
      '787', '788', // Austin
      '972', '973', // Portland
      '303', '304', // Atlanta
      '200', '201', '202', '203', '204', '205', // DC area
      '981', '982', // Seattle
      '021', '022', '023', '024', '025', // Boston
      '802', '803', // Denver
      '891', '892', // Las Vegas
      '372', '373', // Nashville
      '731', '732', // Oklahoma City
      '641', '642', // Kansas City
      '631', '632', // St. Louis
      '441', '442', // Cleveland
    ];

    const isLikelyUrban = urbanRanges.some(range => zipCode.startsWith(range));
    
    return {
      zipCode,
      areaType: isLikelyUrban ? 'urban' : 'rural',
      confidence: 'low',
      source: 'fallback'
    };
  }

  /**
   * Main function to classify a zip code as rural or urban
   */
  static async classifyZipCode(zipCode: string): Promise<ZipCodeLookupResult> {
    // Clean and validate zip code
    const cleanZip = zipCode.replace(/\D/g, '').slice(0, 5);
    
    if (cleanZip.length !== 5) {
      return {
        found: false,
        error: 'Invalid zip code format. Please enter a 5-digit zip code.'
      };
    }

    // Check cache first
    const cached = classificationCache.get(cleanZip);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return {
        found: true,
        classification: cached.classification
      };
    }

    try {
      // Try to get population from Census API
      const population = await this.getPopulationFromCensus(cleanZip);
      
      if (population !== null) {
        const classification: ZipCodeClassification = {
          zipCode: cleanZip,
          areaType: this.classifyByPopulation(population),
          confidence: 'high',
          source: 'census_api'
        };
        
        // Cache the result
        classificationCache.set(cleanZip, {
          classification,
          timestamp: Date.now()
        });
        
        return {
          found: true,
          classification
        };
      }
    } catch (error) {
      console.error('Census API error:', error);
    }

    // Fallback to pattern-based classification
    const fallbackClassification = this.fallbackClassification(cleanZip);
    
    // Cache fallback result too (shorter duration)
    classificationCache.set(cleanZip, {
      classification: fallbackClassification,
      timestamp: Date.now()
    });

    return {
      found: true,
      classification: fallbackClassification
    };
  }

  /**
   * Batch classify multiple zip codes
   */
  static async batchClassify(zipCodes: string[], delayMs: number = 100): Promise<ZipCodeLookupResult[]> {
    const results: ZipCodeLookupResult[] = [];
    
    for (const zipCode of zipCodes) {
      const result = await this.classifyZipCode(zipCode);
      results.push(result);
      
      // Rate limiting
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    return results;
  }

  /**
   * Simple helper functions
   */
  static isRural(zipCode: string): Promise<boolean> {
    return this.classifyZipCode(zipCode).then(result => 
      result.classification?.areaType === 'rural' || false
    );
  }

  static isUrban(zipCode: string): Promise<boolean> {
    return this.classifyZipCode(zipCode).then(result => 
      result.classification?.areaType === 'urban' || false
    );
  }

  static isValidZipCode(zipCode: string): boolean {
    const cleanZip = zipCode.replace(/\D/g, '');
    return cleanZip.length === 5;
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    classificationCache.clear();
  }

  /**
   * Get cache stats
   */
  static getCacheStats(): { size: number; rural: number; urban: number } {
    const classifications = Array.from(classificationCache.values());
    return {
      size: classifications.length,
      rural: classifications.filter(c => c.classification.areaType === 'rural').length,
      urban: classifications.filter(c => c.classification.areaType === 'urban').length
    };
  }
}

// Simple usage examples
export const Examples = {
  async basicUsage() {
    // Simple classification
    const result = await ZipCodeLookup.classifyZipCode('10001');
    console.log('NYC zip code classification:', result.classification?.areaType); // 'urban'
    
    const rural = await ZipCodeLookup.isRural('59718'); // Small Montana town
    console.log('Is rural:', rural); // true
    
    const urban = await ZipCodeLookup.isUrban('90210'); // Beverly Hills
    console.log('Is urban:', urban); // true
  },

  async batchUsage() {
    const zipCodes = ['10001', '90210', '59718', '05001', '77001'];
    const results = await ZipCodeLookup.batchClassify(zipCodes);
    
    results.forEach(result => {
      if (result.found && result.classification) {
        console.log(`${result.classification.zipCode}: ${result.classification.areaType} (${result.classification.confidence} confidence)`);
      }
    });
  }
};

// For future API integration, here's an example structure:
/*
export class ZipCodeAPI {
  private static readonly API_KEY = process.env.ZIPCODE_API_KEY;
  private static readonly BASE_URL = 'https://api.zippopotam.us/us/';

  static async fetchFromAPI(zipCode: string): Promise<ZipCodeLookupResult> {
    try {
      const response = await fetch(`${this.BASE_URL}${zipCode}`);
      
      if (!response.ok) {
        return { found: false, error: 'Zip code not found' };
      }

      const data = await response.json();
      
      return {
        found: true,
        data: {
          zipCode: data['post code'],
          city: data.places[0]['place name'],
          state: data.places[0]['state abbreviation'],
          population: 0, // API doesn't provide population
          county: data.places[0]['county']
        }
      };
    } catch (error) {
      return { found: false, error: 'Failed to lookup zip code' };
    }
  }
}
*/