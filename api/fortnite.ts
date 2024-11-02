export async function fetchShopData() {
  try {
    const response = await fetch('https://fortnite-api.com/v2/shop/br');
    const data = await response.json();

    // Debug log to check API response
    console.log('API Response:', JSON.stringify(data.data.featured?.entries?.[0]?.items?.[0], null, 2));
    
    // Check for music packs
    const allItems = [
      ...(data.data.featured?.entries || []),
      ...(data.data.daily?.entries || []),
      ...(data.data.specialFeatured?.entries || [])
    ];
    
    console.log('All Items Types:', allItems.map(entry => ({
      name: entry.items[0].name,
      type: entry.items[0].type,
      displayValue: entry.items[0].type.displayValue,
      value: entry.items[0].type.value,
      rawType: JSON.stringify(entry.items[0].type)
    })));
    
    const musicPacks = allItems.filter(entry => {
      const type = entry.items[0].type;
      const typeValue = type?.value?.toLowerCase() || '';
      const displayValue = type?.displayValue?.toLowerCase() || '';
      
      console.log('Checking item:', {
        name: entry.items[0].name,
        typeValue,
        displayValue,
        matches: typeValue.includes('music') || displayValue.includes('music')
      });
      
      return typeValue.includes('music') || displayValue.includes('music');
    });
    
    console.log('Found Music Packs:', musicPacks.length, musicPacks);

    if (!data.data) throw new Error('Invalid data format');

    const sections: any[] = [];
    const bundleItems = new Set<string>();

    // Add festival gear detection
    const isFestivalGear = (entry: any) => {
      const tags = entry.items[0].gameplayTags || [];
      return tags.some((tag: string) => 
        tag.toLowerCase().includes('festival') || 
        tag.toLowerCase().includes('rhythm')
      );
    };

    // First pass: identify all bundle items
    const processBundles = (sectionData: any) => {
      if (!sectionData?.entries) return;
      
      sectionData.entries.forEach((entry: any) => {
        if (entry.bundle) {
          // Add all items in the bundle to the Set
          entry.items.forEach((bundleItem: any) => {
            bundleItems.add(bundleItem.id);
          });
        }
      });
    };

    // Process all sections for bundles first
    if (data.data.featured) processBundles(data.data.featured);
    if (data.data.daily) processBundles(data.data.daily);
    if (data.data.specialFeatured) processBundles(data.data.specialFeatured);

    // Process each major section from the API
    const processSection = (sectionData: any) => {
      if (!sectionData?.entries) return;

      sectionData.entries.forEach((entry: any) => {
        console.log('Processing item:', {
          name: entry.items[0].name,
          type: entry.items[0].type,
          displayValue: entry.items[0].type.displayValue,
          value: entry.items[0].type.value
        });
        
        const isBundle = entry.bundle !== null && entry.bundle !== undefined;
        const itemId = entry.items[0].id;
        
        if (isBundle || !bundleItems.has(itemId)) {
          const isFestival = isFestivalGear(entry);
          const isJamTrack = entry.items[0].type.displayValue?.toLowerCase().includes('music') || 
                            entry.items[0].type.value?.toLowerCase().includes('music');

          const categoryName = isBundle ? 'Bundle' : 
                             isJamTrack ? 'Jam Tracks' :
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
            isJamTrack: isJamTrack,
            previewAudio: entry.items[0].audio || null,
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
            },
            isFestivalGear: isFestival
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

    // Process all sections
    if (data.data.featured) processSection(data.data.featured);
    if (data.data.daily) processSection(data.data.daily);
    if (data.data.specialFeatured) processSection(data.data.specialFeatured);

    // After processing all sections, ensure we have a Jam Tracks section
    if (!sections.find(s => s.name === 'Jam Tracks')) {
      sections.push({
        name: 'Jam Tracks',
        items: []
      });
    }

    // Sort sections to maintain consistent order
    sections.sort((a, b) => {
      const order = ['Featured', 'Daily', 'Special', 'Bundle', 'Festival Gear', 'Jam Tracks'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

    return sections;
  } catch (error) {
    console.error('Error fetching shop data:', error);
    throw error;
  }
}

export async function searchCosmetics(query: string) {
  try {
    // Use a more lenient search endpoint with partial matching
    const response = await fetch(`https://fortnite-api.com/v2/cosmetics/br/search/all?name=${query}&matchMethod=contains&language=en`);
    const data = await response.json();

    if (!data.data) return [];

    // Ensure we always work with an array of items
    const items = Array.isArray(data.data) ? data.data : [data.data];

    // Sort results by name relevance to the search query
    const sortedItems = items.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().indexOf(query.toLowerCase());
      const bNameMatch = b.name.toLowerCase().indexOf(query.toLowerCase());
      return aNameMatch - bNameMatch;
    });

    // Take top 25 results after sorting
    return sortedItems.slice(0, 25).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      rarity: item.rarity.value,
      type: item.type.value,
      image: item.images.icon,
      featuredImage: item.images.featured || item.images.icon,
      added: item.added,
      price: null,
      series: item.series?.value || null,
      set: item.set?.value || null,
      setImage: item.set?.image || null,
      history: {
        firstSeen: item.shopHistory?.[0] || item.added,
        lastSeen: item.shopHistory?.[item.shopHistory.length - 1] || item.added,
        occurrences: item.shopHistory?.length || 0
      },
      isFromSearch: true
    }));
  } catch (error) {
    console.error('Error searching cosmetics:', error);
    return [];
  }
}