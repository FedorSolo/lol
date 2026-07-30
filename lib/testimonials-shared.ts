export interface PublicTestimonial {
  id: string;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  quote: string;
  roleContext: string | null;
  expeditionTitle: string | null;
}
