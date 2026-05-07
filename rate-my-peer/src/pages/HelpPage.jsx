import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import FAQItem from '../components/FAQItem'
import faqData from '../data/faqData'

export default function HelpPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [contactSubmitted, setContactSubmitted] = useState(false)
  const handleContactChange = (e) => {
    const { name, value } = e.target

    setContactForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }))
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()

    setContactSubmitted(true)

    setContactForm({
      name: '',
      email: '',
      message: ''
    })
  }

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

      <div className="hero-block">
        <h1>Contact Us</h1>
        <p className="contact-intro">
          If you still have questions, feel free to contact us!
        </p>

        {contactSubmitted && (
          <p className="success-message">
            Thank you! We got your message and we'll reach out to you shortly :)
          </p>
        )}

        <form className="contact-form" onSubmit={handleContactSubmit}>
          <div className="contact-row">
            <input
              className="contact-input"
              type="text"
              name="name"
              placeholder="Your name"
              value={contactForm.name}
              onChange={handleContactChange}
              required
            />

            <input
              className="contact-input"
              type="email"
              name="email"
              placeholder="Your email"
              value={contactForm.email}
              onChange={handleContactChange}
              required
            />
          </div>

          <textarea
            className="contact-textarea"
            name="message"
            placeholder="Your message..."
            value={contactForm.message}
            onChange={handleContactChange}
            required
          />

          <button type="submit" className="contact-submit">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
