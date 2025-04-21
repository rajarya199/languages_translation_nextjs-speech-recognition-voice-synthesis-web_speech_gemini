"use client"
import React,{useState,useEffect} from 'react'
import { MicIcon, StopCircleIcon, PlayIcon, LanguagesIcon } from 'lucide-react'

const Translator = () => {
    const [isRecording, setIsRecording] = useState(false)
    const[translation,setTranslation]=useState<string>('')
    const[text,setText]=useState<string>()
     const isSpeechDetected=false
     const language="en-US"
    function handleOnRecord() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.onresult = async function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('transcript', transcript)
        setText(transcript);

        console.log("text",transcript)
        try {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: transcript,
              language: "pt-BR", 
            }),
          });
  
          const data = await response.json();
          setTranslation(data.text);
        } catch (err) {
          console.error("Translation failed:", err);
          setTranslation("Translation failed. Please try again.");
        }
     
        
      }
      recognition.onerror = function (event: any) {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
      recognition.start();
    }
  return (
    <div>
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
        {/* Language Selection */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label
              htmlFor="sourceLanguage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Source Language
            </label>
           
          </div>
          <div className="flex-1">
            <label
              htmlFor="targetLanguage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Target Language
            </label>
         
          </div>
        </div>
        {/* Recording Controls */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleOnRecord}
            className={`flex items-center justify-center rounded-full w-16 h-16 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white shadow-lg transition-all`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}

          >
            {isRecording ? (
              <StopCircleIcon className="h-8 w-8" />
            ) : (
              <MicIcon className="h-8 w-8" />
            )}
          </button>
        </div>
   
        {/* Original Text */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Original Text
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[100px] border border-gray-200 dark:border-gray-600 transition-colors">
         {text}
          </div>
        </div>
        {/* Translated Text */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Translation
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[100px] border border-gray-200 dark:border-gray-600 transition-colors">
        {translation}
          </div>
        </div>
      
      </div>

    </div>
  )
}

export default Translator