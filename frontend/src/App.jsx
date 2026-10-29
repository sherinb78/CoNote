import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', 'my-document-room', ydoc)

// Give each tab a random name + color so you can tell users apart
const names = ['Alex', 'Sam', 'Riya', 'Jordan', 'Mia', 'Kabir']
const colors = ['#e63946', '#2a9d8f', '#e9c46a', '#457b9d', '#9b5de5', '#f77f00']
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const currentUser = { name: pick(names), color: pick(colors) }

function App() {
  const [users, setUsers] = useState([])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({ provider, user: currentUser }),
    ],
  })

  // Presence: track who is currently connected
  useEffect(() => {
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values())
      setUsers(states.map((s) => s.user).filter(Boolean))
    }
    provider.awareness.on('change', updateUsers)
    updateUsers()
    return () => provider.awareness.off('change', updateUsers)
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>CoNote</h2>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Online ({users.length}): </strong>
        {users.map((u, i) => (
          <span
            key={i}
            style={{
              background: u.color,
              color: 'white',
              padding: '2px 10px',
              borderRadius: '12px',
              marginRight: '6px',
              fontSize: '14px',
            }}
          >
            {u.name}
          </span>
        ))}
      </div>

      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', minHeight: '300px' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default App