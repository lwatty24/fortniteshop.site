export async function fetchShopData(signal?: AbortSignal) {
  const response = await fetch('https://fortnite-api.com/v2/shop/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    signal,
    mode: 'cors'  // Explicitly set CORS mode
  });

  if (!response.ok) {
    throw new Error('Failed to fetch shop data');
  }

  const data = await response.json();
  return processShopData(data.data);
}

function processShopData(data: any) {
  const sections: any[] = [];
  const bundleItems = new Set<string>();

  const isFestivalGear = (entry: any) => {
    const tags = entry.items[0].gameplayTags || [];
    return tags.some((tag: string) => 
      tag.toLowerCase().includes('festival') || 
      tag.toLowerCase().includes('rhythm')
    );
  };

  // First pass: identify bundle items
  const processBundles = (sectionData: any) => {
    if (!sectionData?.entries) return;
    sectionData.entries.forEach((entry: any) => {
      if (entry.bundle) {
        entry.items.forEach((bundleItem: any) => {
          bundleItems.add(bundleItem.id);
        });
      }
    });
  };

  // Process bundles
  if (data.featured) processBundles(data.featured);
  if (data.daily) processBundles(data.daily);
  if (data.specialFeatured) processBundles(data.specialFeatured);

  // Process sections
  const processSection = (sectionData: any) => {
    if (!sectionData?.entries) return;

    sectionData.entries.forEach((entry: any) => {
      const isBundle = entry.bundle !== null && entry.bundle !== undefined;
      const itemId = entry.items[0].id;
      
      if (isBundle || !bundleItems.has(itemId)) {
        const isFestival = isFestivalGear(entry);
        const isJamTrack = entry.items[0].type.displayValue?.toLowerCase().includes('music') || 
                          entry.items[0].type.value?.toLowerCase().includes('music');

        const categoryName = isBundle ? 'Bundle' : 
                           isFestival ? 'Festival Gear' :
                           (entry.items[0].type.displayValue || 'Other');
        
        const existingSection = sections.find(s => s.name === categoryName);

        const item = {
          id: entry.offerId,
          name: entry.items[0].name,
          description: entry.items[0].description,
          rarity: entry.items[0].rarity.value,
          price: entry.finalPrice,
          image: entry.items[0].images.icon,
          featuredImage: entry.items[0].images.featured || entry.items[0].images.icon,
          type: entry.items[0].type.value,
          set: entry.items[0].set?.value || null,
          series: entry.items[0].series?.value || null,
          added: entry.items[0].added,
          isBundle,
          bundleItems: isBundle ? entry.items.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type.value,
            rarity: item.rarity.value,
            image: item.images.icon
          })) : undefined,
          history: {
            firstSeen: entry.items[0].added,
            lastSeen: new Date().toISOString(),
            occurrences: entry.items[0].shopHistory?.length || 0
          }
        };

        if (existingSection) {
          existingSection.items.push(item);
        } else {
          sections.push({
            name: categoryName,
            items: [item]
          });
        }
      }
    });
  };

  if (data.featured) processSection(data.featured);
  if (data.daily) processSection(data.daily);
  if (data.specialFeatured) processSection(data.specialFeatured);

  return sections;
}

// In-memory cache with pre-filtered results
const searchCache = new Map<string, {
  results: any[];
  timestamp: number;
  promise?: Promise<any[]>;
}>();

const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
const MAX_RESULTS = 25;

export async function searchCosmetics(query: string) {
  const cacheKey = query.toLowerCase();
  const now = Date.now();
  const cached = searchCache.get(cacheKey);

  // Return cached results if valid
  if (cached) {
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.results;
    }
    // Return pending promise if exists
    if (cached.promise) {
      return cached.promise;
    }
  }

  // Create new promise for this search
  const promise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        `https://fortnite-api.com/v2/cosmetics/br/search/all?name=${encodeURIComponent(query)}&matchMethod=contains&language=en`,
        { 
          signal: controller.signal,
          headers: {
            'Accept-Encoding': 'gzip',
            'Cache-Control': 'max-age=3600'
          }
        }
      );
      
      clearTimeout(timeoutId);
      const data = await response.json();

      if (!data.data) return [];

      const results = processSearchResults(data.data);
      searchCache.set(cacheKey, { results, timestamp: now });
      return results;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error);
      }
      return [];
    }
  })();

  // Cache the promise
  searchCache.set(cacheKey, { 
    results: [], 
    timestamp: now, 
    promise 
  });

  return promise;
}

// Separate processing function for better performance
function processSearchResults(data: any) {
  const items = Array.isArray(data) ? data : [data];
  return items
    .slice(0, MAX_RESULTS)
    .map(item => ({
      id: item.id,
      name: item.name,
      rarity: item.rarity.value,
      type: item.type.value,
      image: item.images.icon,
      featuredImage: item.images.featured || item.images.icon,
      added: item.added,
      lastSeen: item.shopHistory?.[item.shopHistory.length - 1] || item.added,
      isFromSearch: true
    }));
}

export async function fetchShopHistory(date: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/shop/br/${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    const data = await response.json();
    if (!data.data) throw new Error('Invalid data format');
    
    return {
      date: date,
      sections: processShopData(data.data)
    };
  } catch (error) {
    console.error('Error fetching shop history:', error);
    throw error;
  }
}
