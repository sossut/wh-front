export interface InDocket {
    id: number;
    docketNumber: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    vendorId: number | null;
    status: 'open' | 'closed';
    arrivalAt: Date | null;
    
}