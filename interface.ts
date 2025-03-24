export interface StoreData {
    _id: string;
    vendorId: string;
    storeName: string;
    subdomain: string;
    primaryColor: string;
    logoUrl: string;
    bannerImg: string[]; // Array of image URLs
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  