import { useEffect, useState } from 'react'
import FAQItem from '../components/FAQItem'
import { api } from '../api/client'

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)

  useEffect(() => {
    let cancelled = false
    api.faqs.list()
      .then((data) => !cancelled && setFaqs(data.faqs))
      .catch(() => !cancelled && setFaqs([]))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setContactSubmitted(true)
    setContactForm({ name: '', email: '', message: '' })
    // TODO: POST to a /api/contact endpoint when we build it.
  }

  const filteredFAQs = faqs.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <section className="page help-page">
      <div className="hero-block">
        <h1>How Can We Help?</h1>
        <div className="search-bar" role="search" aria-label="Search FAQ">
          <input
            type="search"
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="hero-block">
        <h1>FAQ</h1>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : filteredFAQs.length > 0 ? (
          filteredFAQs.map((item) => (
            <FAQItem key={item.id} question={item.question} answer={item.answer} />
          ))
        ) : (
          <p>No matching FAQs found.</p>
        )}
      </div>

      <div className="hero-block">
        <h1>Contact Us</h1>
        <p className="contact-intro">If you still have questions, feel free to contact us!</p>

        {contactSubmitted && (
          <p className="success-message">
            Thank you! We got your message and we'll reach out to you shortly :)
          </p>
        )}

        <form className="contact-form" onSubmit={handleContactSubmit} aria-label="Contact Us">
          <div className="contact-row">
            <input className="contact-input" type="text" name="name" placeholder="Your name" value={contactForm.name} onChange={handleContactChange} required />
            <input className="contact-input" type="email" name="email" placeholder="Your email" value={contactForm.email} onChange={handleContactChange} required />
          </div>
          <textarea className="contact-textarea" name="message" placeholder="Your message..." value={contactForm.message} onChange={handleContactChange} required />
          <button type="submit" className="contact-submit">Send Message</button>
        </form>
      </div>
    </section>
  )
}
