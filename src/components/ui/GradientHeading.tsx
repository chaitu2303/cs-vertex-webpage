import React from 'react'

interface GradientHeadingProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
  style?: React.CSSProperties
}

export function GradientHeading({ children, as: Tag = 'h2', className = '', style = {} }: GradientHeadingProps) {
  // Split the text into the first word and the rest
  const words = children.split(' ')
  const firstWord = words.shift()
  const rest = words.join(' ')

  return (
    <Tag className={`gradient-heading ${className}`} style={{ ...style }}>
      <span className="first-word">{firstWord}</span>
      {rest && <span> {rest}</span>}
      <style>{`
        .gradient-heading {
          font-weight: 700;
          color: #111;
          margin: 0;
          line-height: 1.1;
        }
        .gradient-heading .first-word {
          background: linear-gradient(135deg, #FF6A2A 0%, #FF9B2A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </Tag>
  )
}
