import { createRoot } from 'react-dom/client'

// React alone: subtracted from library bundle sizes.
createRoot(document.getElementById('root')!).render(<button>baseline</button>)
