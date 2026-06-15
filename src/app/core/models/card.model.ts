export type CardNetwork = 'visa' | 'mastercard';

export interface Card {
  id: string;
  type: 'debit' | 'credit';
  network: CardNetwork;
  lastFour: string;
  holder: string;
  expiryMonth: string;
  expiryYear: string;
  balance: number;
  creditAvailable: number;
  frozen: boolean;
  onlinePurchases: boolean;
}
