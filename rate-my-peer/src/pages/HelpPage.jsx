import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import FAQItem from '../components/FAQItem'
import faqData from '../data/faqData'

export default function HelpPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFAQs = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="page help-page">
        <div className="hero-block">
            <h1>How Can We Help?</h1>
            <div className="search-bar">
                <input  
                    type="search"
                    placeholder="SearchFAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      
      <div className ="hero-block">
        <h1>FAQ</h1>
        {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item) => (
                <FAQItem   
                    key={item.id}
                    question={item.question}
                    answer={item.answer}
                />
            ))
        ) : (
            <p>No matching FAQs found.</p>
        )}
      </div>
    </section>
  );
}
