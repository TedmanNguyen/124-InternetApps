import './FAQItem.css'
import { useState } from 'react'


export default function FAQItem({ question, answer}) {
    const [open, setOpen] = useState(false)
    
    return (
        <div className="faq-item">
            <button
                className="faq-question"
                onClick={() => setOpen(!open)}
            >
                {question}
            </button>

            {open && (
                <p className="faq-answer">
                    {answer}
                </p>
            )}
        </div>
    )
}


