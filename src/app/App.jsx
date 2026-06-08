import { useState } from 'react'
import { CustomerPage } from '../features/customers'
import { LetterCounterPage } from '../features/letterCounter'
import MainLayout from '../shared/ui/Homepage/HomepageLayout'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <>
      <MainLayout setCurrentPage={setCurrentPage}>
        {currentPage === 'home' && <h1>test layout</h1>}
        {currentPage === 'letterCounter' && <LetterCounterPage />}
      </MainLayout>
    </>
  )
}

export default App
