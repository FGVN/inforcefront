import { Comment } from './comment'

export interface Product {
    id: number;
    imageUrl: string;
    name: string;
    count: number;
    size: {
      width: number;
      height: number;
    };
    weight: string;
    comments?: Comment[];
    image?: File;
}
  