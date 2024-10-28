import axios from 'axios'
import { useState, type FormEvent } from 'react'

function App() {
  const [files, setFiles] = useState<FileList | null>(null)

  async function handleUploadFile(e: FormEvent) {
    e.preventDefault()

    if (!files || files.length === 0) {
      return
    }
    const file = files[0]

    axios.put('https://nebulaport-dev.30a8a730042e5f9e6a5682f51f9e0882.r2.cloudflarestorage.com/87b9733f-2a06-4c20-95ae-7cefbfced51a-teste.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=dc78528cded598debffe781c27a2a218%2F20241028%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241028T003541Z&X-Amz-Expires=600&X-Amz-Signature=69db3af121ab9576b8ebf6ecf1a46aa7261ffd79c4288350baf117d4e5314e8a&X-Amz-SignedHeaders=host&x-id=PutObject', file, {
      headers: {
        'Content-Type': 'video/mp4',
      }
    })

  }

  return (
    <form onSubmit={handleUploadFile}>
      <input type="file" name='file' onChange={e => setFiles(e.target.files)} />
      <button type='submit'>Upload</button>
    </form>
  )
}

export default App
