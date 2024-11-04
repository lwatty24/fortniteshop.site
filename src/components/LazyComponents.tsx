import { lazy } from 'react';

export const ShopSectionComponent = lazy(() => 
  import('./ShopSection').then(module => ({ default: module.ShopSection }))
);

export const ItemDetails = lazy(() => 
  import('./ItemDetails').then(module => ({ default: module.ItemDetails }))
);

export const CompareModal = lazy(() => 
  import('./CompareModal').then(module => ({ default: module.CompareModal }))
);

export const WishlistTab = lazy(() => 
  import('./WishlistTab').then(module => ({ default: module.WishlistTab }))
);

export const ShopHistory = lazy(() => 
  import('./ShopHistory').then(module => ({ default: module.ShopHistory }))
);

export const SetCollections = lazy(() => 
  import('./SetCollections').then(module => ({ default: module.SetCollections }))
); 