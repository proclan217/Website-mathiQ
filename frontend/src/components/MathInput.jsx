import React, { useState, useRef } from 'react';
import MathText from '../MathText';
import MathToolbar from './MathToolbar';

const MathInput = ({ value, onChange, label, rows = 3 }) => {
  const textareaRef = useRef(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleInsert = (latex) => {
    const before = value.substring(0, selection.start);
    const after = value.substring(selection.end);
    const newValue = before + latex.replace(/#/g, '') + after;
    onChange(newValue);
    
    // Focus back on textarea
    setTimeout(() => {
      const pos = before.length + latex.indexOf('#');
      textareaRef.current.setSelectionRange(pos, pos);
      textareaRef.current.focus();
    }, 0);
  };

  const handleSelection = () => {
    setSelection({
      start: textareaRef.current.selectionStart,
      end: textareaRef.current.selectionEnd
    });
  };

  return (
    <div className="math-input-container">
      {label && <label>{label}</label>}
      <MathToolbar onInsert={handleInsert} />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelection}
        rows={rows}
        className="math-textarea"
      />
      <div className="math-preview">
        <MathText text={value || "Preview will appear here"} />
      </div>
    </div>
  );
};

export default MathInput;