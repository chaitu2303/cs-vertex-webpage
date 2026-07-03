"use client"

import React, { useState, useRef, useEffect } from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"

export const PREDEFINED_CATEGORIES = [
  "Web", "Mobile", "AI", "Machine Learning", "Deep Learning", "IoT", 
  "Embedded", "Robotics", "Cybersecurity", "Cloud", "Automation", 
  "Computer Vision", "NLP", "Blockchain", "Others"
]

interface MultiSelectDropdownProps {
  options?: string[]
  value: string // comma-separated string
  onChange: (value: string) => void
  placeholder?: string
}

export function MultiSelectDropdown({ options = PREDEFINED_CATEGORIES, value, onChange, placeholder = "Select Categories" }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Parse comma-separated value into array
  const selectedOptions = (value || "").split(",").map(s => s.trim()).filter(s => s !== "")

  // Filter options based on search
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleOption = (option: string) => {
    let newSelected: string[]
    if (selectedOptions.includes(option)) {
      newSelected = selectedOptions.filter(o => o !== option)
    } else {
      newSelected = [...selectedOptions, option]
    }
    onChange(newSelected.join(", "))
  }

  const selectAll = () => {
    onChange(options.join(", "))
  }

  const clearAll = () => {
    onChange("")
  }

  return (
    <div className="multi-select-container" ref={dropdownRef}>
      <div 
        className="multi-select-header premium-input"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "42px" }}
      >
        <div style={{ flex: 1, color: selectedOptions.length === 0 ? "#666" : "#fff" }}>
          {selectedOptions.length === 0 ? placeholder : `${selectedOptions.length} selected`}
        </div>
        <ChevronDown size={16} color="#888" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
      </div>

      {isOpen && (
        <div className="multi-select-dropdown premium-glass-panel">
          <div className="ms-search">
            <Search size={14} color="#666" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="ms-actions">
            <button type="button" onClick={selectAll}>Select All</button>
            <button type="button" onClick={clearAll}>Clear All</button>
          </div>

          <div className="ms-options-list">
            {filteredOptions.length === 0 ? (
              <div className="ms-no-results">No results found</div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = selectedOptions.includes(option)
                return (
                  <div 
                    key={option} 
                    className={`ms-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleOption(option)}
                  >
                    <div className="ms-checkbox">
                      {isSelected && <Check size={12} />}
                    </div>
                    <span>{option}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {selectedOptions.length > 0 && (
        <div className="ms-chips-container">
          {selectedOptions.map(option => (
            <div key={option} className="ms-chip">
              {option}
              <button type="button" onClick={(e) => { e.stopPropagation(); toggleOption(option) }}><X size={12} /></button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .multi-select-container {
          position: relative;
          width: 100%;
        }
        .multi-select-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          z-index: 100;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .ms-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 8px 12px;
        }
        .ms-search input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 13px;
          width: 100%;
          outline: none;
        }
        .ms-actions {
          display: flex;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ms-actions button {
          background: transparent;
          border: none;
          color: #FF6B2C;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .ms-actions button:hover {
          opacity: 0.8;
        }
        .ms-options-list {
          max-height: 200px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-right: 4px;
        }
        .ms-options-list::-webkit-scrollbar {
          width: 4px;
        }
        .ms-options-list::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
        .ms-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 13px;
          color: #ccc;
        }
        .ms-option:hover {
          background: rgba(255,255,255,0.05);
        }
        .ms-option.selected {
          color: #fff;
          background: rgba(255,107,44,0.05);
        }
        .ms-checkbox {
          width: 16px;
          height: 16px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF6B2C;
        }
        .ms-option.selected .ms-checkbox {
          border-color: #FF6B2C;
          background: rgba(255,107,44,0.1);
        }
        .ms-no-results {
          padding: 10px;
          text-align: center;
          color: #666;
          font-size: 13px;
        }
        .ms-chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .ms-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          color: #ddd;
        }
        .ms-chip button {
          background: transparent;
          border: none;
          color: #888;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ms-chip button:hover {
          color: #FF6B2C;
        }
      `}</style>
    </div>
  )
}
