"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FaqSection({ faqs }: { faqs: { q: string, a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        const questionId = `faq-q-${i}`;
        const answerId = `faq-a-${i}`;
        return (
          <div 
            key={i} 
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-controls={answerId}
            onClick={() => toggleFaq(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaq(i);
              }
            }}
            style={{
              background: isOpen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px 32px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.4)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 
                id={questionId}
                style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#FFFFFF', fontFamily: "var(--font-display), 'Montserrat', sans-serif" }}
              >
                {faq.q}
              </h3>
              <div 
                aria-hidden="true"
                style={{ 
                  color: '#e11d48', 
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  userSelect: 'none',
                  flexShrink: 0,
                  marginLeft: '12px'
                }}
              >
                +
              </div>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ margin: '16px 0 0', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
