import React from 'react'
import { LanguagesIcon } from 'lucide-react'
const Header = () => {
  return (
    <header className="text-center mb-8">
    <div className="flex items-center justify-center mb-3 relative">
      {/* <div className="absolute right-0">
        <ThemeToggle />
      </div> */}
      <LanguagesIcon className="h-8 w-8 text-blue-500 dark:text-blue-400 mr-2" />
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Voice Translator
      </h1>
    </div>
    <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
      Speak in one language, translate to another, and hear the translation
    </p>
  </header>
  )
}

export default Header