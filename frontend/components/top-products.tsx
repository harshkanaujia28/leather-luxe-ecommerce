export function TopProducts() {
  const products = [
    {
      name: "Wireless Headphones",
      sales: 1234,
      revenue: "$12,340",
    },
    {
      name: "Running Shoes",
      sales: 987,
      revenue: "$9,870",
    },
    {
      name: "Laptop Stand",
      sales: 654,
      revenue: "$6,540",
    },
    {
      name: "Coffee Mug",
      sales: 432,
      revenue: "$4,320",
    },
    {
      name: "Phone Case",
      sales: 321,
      revenue: "$3,210",
    },
  ]

  return (
    <div className="space-y-8">
      {products.map((product, index) => (
        <div key={product.name} className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-medium">{index + 1}</span>
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.sales} sales</p>
          </div>
          <div className="ml-auto font-medium">{product.revenue}</div>
        </div>
      ))}
    </div>
  )
}
