interface ProductDescriptionProps {
  title: string
  description: string
  features: string[]
  highlight?: string
}

export default function ProductDescription({ title, description, features, highlight }: ProductDescriptionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
      </div>
      
      {features.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Features:</h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span className="text-gray-300 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {highlight && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl p-4">
          <p className="text-blue-300 font-medium leading-relaxed">{highlight}</p>
        </div>
      )}
    </div>
  )
}