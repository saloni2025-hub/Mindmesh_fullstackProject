import { useState } from 'react';
import { X } from 'lucide-react';

function TagInput({ value, onChange, placeholder }) {
  const [text, setText] = useState('');

  const add = () => {
    const t = text.trim();
    if (t && !value.some((v) => v.toLowerCase() === t.toLowerCase())) onChange([...value, t]);
    setText('');
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 text-xs bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-full">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((v) => v !== tag))}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
      />
    </div>
  );
}

export default TagInput;