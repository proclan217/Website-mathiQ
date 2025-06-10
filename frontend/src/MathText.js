import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathText = ({ text }) => {
  let html;
  try {
    html = katex.renderToString(text, {
      throwOnError: false,
    });
  } catch (e) {
    html = `<span style="color:red;">Invalid math input</span>`;
  }

  return (
    <div
      className="math-rendered"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MathText;
