export interface Product {

  id: string;

  name: string;

  category: string;

  price: number;

  image: string;

  hoverImage: string;

  imagePosition?: string;

  hoverImagePosition?: string;

  description: string;

}



export const products: Product[] = [

  {

    id: "01",

    name: "Midnight Drape",

    category: "Outerwear",

    price: 3120,

    image: "/images/products/midnight-drape.webp",

    hoverImage: "/images/products/midnight-drape-hover.webp",

    imagePosition: "center 10%",

    hoverImagePosition: "center 15%",

    description: "Japanese cupro with hand-rolled edges",

  },

  {

    id: "02",

    name: "Sculpted Trench",

    category: "Tailoring",

    price: 2280,

    image: "/images/products/sculpted-trench.webp",

    hoverImage: "/images/products/sculpted-trench-hover.webp",

    imagePosition: "center 5%",

    hoverImagePosition: "center 20%",

    description: "Waxed cotton, architectural collar",

  },

  {

    id: "03",

    name: "Veil Column",

    category: "Dresses",

    price: 1840,

    image: "/images/products/veil-column.webp",

    hoverImage: "/images/products/veil-column-hover.webp",

    imagePosition: "center 15%",

    hoverImagePosition: "center 20%",

    description: "Crêpe de chine, bias-cut fall",

  },

  {

    id: "04",

    name: "Nocturne Knit",

    category: "Knitwear",

    price: 1380,

    image: "/images/products/nocturne-knit.webp",

    hoverImage: "/images/products/nocturne-knit-hover.webp",

    imagePosition: "center 10%",

    hoverImagePosition: "center 15%",

    description: "Merino-silk blend, seamless construction",

  },

];



export function formatPrice(price: number): string {

  return new Intl.NumberFormat("en-US", {

    style: "currency",

    currency: "USD",

    minimumFractionDigits: 0,

  }).format(price);

}

