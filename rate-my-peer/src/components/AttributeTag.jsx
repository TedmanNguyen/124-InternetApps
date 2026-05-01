const negativeAttributes = new Set(['Absent'])

export default function AttributeTag({ label }) {
  const tone = negativeAttributes.has(label) ? 'negative' : 'positive'

  return (
    <span className={`attribute-tag ${tone}`}>
      {label}
    </span>
  )
}

