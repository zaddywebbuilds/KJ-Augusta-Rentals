// Legacy direct-payment config (used by BookingPanel on the homepage)
export const directPayment = {
  enabled: false,
  depositUrl: '',
  depositLabel: 'Pay deposit',
  paypalUrl: '',
};

// Hospitable property UUIDs — one per listing slug
export const HOSPITABLE_IDS: Record<string, string> = {
  'entire-river-house':   '9eaa8094-2942-4fa9-9391-babecdca8c20',
  'upstairs-river-house': '620cdb7f-d17c-4a51-a7e8-619b7685ae63',
  'river-suite':          'b7f74137-0eae-4d39-b380-e9ec5b0fc580',
};

// Maximum guests per listing (from Hospitable capacity)
export const MAX_GUESTS: Record<string, number> = {
  'entire-river-house':   20,
  'upstairs-river-house': 12,
  'river-suite':          8,
};
