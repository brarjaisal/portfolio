import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
      <h1>To-Do App</h1>
      <p>React project — in progress.</p>
    </div>
  );
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
