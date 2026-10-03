export interface DeliveryMethodEntity {
  id: string;
  name: string;
  code: string;
  description: string | null;
  pricePaise: number;
  freeThresholdPaise: number | null;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}
