export const orbitXJacketDescription = {
  title: "Premium Quality OrbitX Club Custom Jackets",
  description: "Designed exclusively for members.",
  features: [
    "High-quality, durable fabric for everyday use",
    "OrbitX Club logo embroidery (front) + custom name print (back/side)",
    "Soft fleece inner lining for comfort",
    "Stylish fit suitable for college events & daily wear",
    "Washable & long-lasting print (No color fade)"
  ],
  highlight: "Perfect for OrbitX members who want to showcase identity, leadership, and club pride in style."
}

// Usage example for merchandise detail page
export const formatProductDescription = (product: any) => {
  if (product.name.toLowerCase().includes('jacket')) {
    return orbitXJacketDescription
  }
  
  // Default formatting for other products
  return {
    title: product.name,
    description: product.description,
    features: [],
    highlight: undefined
  }
}