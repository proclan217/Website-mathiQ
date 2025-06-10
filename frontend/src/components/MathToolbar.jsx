import {
    FaSquareRootAlt,
    FaDivide,
    FaSuperscript,
    FaSubscript,
    FaInfinity,
    FaPercentage,
  } from 'react-icons/fa';
import { PiSigmaBold } from 'react-icons/pi';
import MathText from '../MathText';

const MathToolbar = ({ onInsert }) => {
  const symbols = [
    { name: '∑', icon: <PiSigmaBold />, latex: '\\sum_{#}^{#}' },
    { name: 'sqrt', icon: <FaSquareRootAlt />, latex: '\\sqrt{#}' },
    { name: 'frac', icon: <FaDivide />, latex: '\\frac{#}{#}' },
    { name: '^', icon: <FaSuperscript />, latex: '^{#}' },
    { name: '_', icon: <FaSubscript />, latex: '_{#}' },
    { name: '∫', text: '∫', latex: '\\int_{#}^{#}' },
    { 
      name: 'Greek', text: 'αβ', items: [
        { latex: '\\alpha' }, { latex: '\\beta' }, { latex: '\\gamma' },
        { latex: '\\theta' }, { latex: '\\pi' }, { latex: '\\omega' }
      ]
    },
    { 
      name: 'Operators', text: '×÷', items: [
        { latex: '\\times' }, { latex: '\\div' }, { latex: '\\pm' },
        { latex: '\\mp' }, { latex: '\\cdot' }, { latex: '\\%' }
      ]
    },
    { name: '()', latex: '\\left( # \\right)' },
    { name: '[]', latex: '\\left[ # \\right]' },
    { name: 'lim', latex: '\\lim_{# \\to #}' },
    { name: '∞', icon: <FaInfinity />, latex: '\\infty' },
    { name: '%', icon: <FaPercentage />, latex: '\\%' }
  ];

  return (
    <div className="math-toolbar">
      {symbols.map((symbol, i) => (
  symbol.items ? (
    <div key={i} className="dropdown">
      <button 
        type="button"
        className="toolbar-btn"
        aria-label={symbol.name}
      >
        {symbol.icon || symbol.text || symbol.name}
      </button>
      <div className="dropdown-content">
        {symbol.items.map((item, j) => (
          <button 
            key={j} 
            type="button"
            onClick={() => onInsert(item.latex)}
            aria-label={item.latex}
          >
            <MathText text={item.latex} inline />
          </button>
        ))}
      </div>
    </div>
  ) : (
    <button 
      key={i} 
      type="button"
      className="toolbar-btn"
      onClick={() => symbol.latex && onInsert(symbol.latex)} // <-- only if latex exists
      aria-label={symbol.name}
    >
      {symbol.icon || symbol.text || symbol.name}
    </button>
  )
))}
    </div>
  );
}


export default MathToolbar;
