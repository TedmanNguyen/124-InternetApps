import { useState } from 'react'

export default function SearchBar({
  defaultValue = '',
  placeholder = 'Search by student name or email...',
  buttonLabel = 'Search',
  onSearch,
}) {
  const [term, setTerm] = useState(defaultValue)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(term.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="search"
        value={term}
        onChange={(event) => {
          const value = event.target.value
          setTerm(value)
          onSearch(value.trim())
        }}
        placeholder={placeholder}
        aria-label="Search students by name or email"
      />
      <button type="submit">{buttonLabel}</button>
    </form>
  )
}

