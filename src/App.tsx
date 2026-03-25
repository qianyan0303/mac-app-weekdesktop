import { useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { WIDGET_REGISTRY } from './widgets';
import './App.css';

function App() {
  const [activeWidgets, setActiveWidgets] = useState<string[]>(['week-info']);

  const toggle = (id: string) => {
    setActiveWidgets(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const handleClose = async () => {
    const win = getCurrentWindow();
    await win.hide();
  };

  return (
    <div className="app">
      {/* 拖动条：data-tauri-drag-region 是最可靠的拖动方式 */}
      <div className="drag-bar" data-tauri-drag-region>
        <span className="drag-bar-title" data-tauri-drag-region>⠿ WeekDesktop</span>
        <button className="close-btn" onClick={handleClose} title="隐藏">
          ✕
        </button>
      </div>

      {WIDGET_REGISTRY.filter(w => activeWidgets.includes(w.id)).map(widget => (
        <div key={widget.id} className="widget-wrapper">
          <widget.component />
        </div>
      ))}

      <div className="widget-toolbar">
        {WIDGET_REGISTRY.map(widget => (
          <button
            key={widget.id}
            className={`toolbar-btn ${activeWidgets.includes(widget.id) ? 'active' : ''}`}
            onClick={() => toggle(widget.id)}
            title={widget.description}
          >
            {widget.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
