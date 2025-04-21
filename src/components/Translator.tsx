"use client"
import React,{useState,useEffect,useRef} from 'react'
import { MicIcon, StopCircleIcon, PlayIcon, LanguagesIcon } from 'lucide-react'
import { default as languageCodesData } from '@/data/language-codes.json';
import { default as countryCodesData } from '@/data/country-codes.json';

const languageCodes: Record<string, string> = languageCodesData;
const countryCodes: Record<string, string> = countryCodesData;


const Translator = () => {

  const recognitionRef=useRef<SpeechRecognition | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const[translation,setTranslation]=useState<string>('')
    const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>();
    const [language, setLanguage] = useState<string>('pt-BR');
    const [sourceLanguage, setSourceLanguage] = useState<string>('en-US')

    const availableLanguages = Array.from(new Set(voices?.map(({ lang }) => lang)))
    .map(lang => {
      const split = lang.split('-');
      const languageCode: string = split[0];
      const countryCode: string = split[1];
      return {
        lang,
        label: languageCodes[languageCode] || lang,
        dialect: countryCodes[countryCode]
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label));

    const activeLanguage = availableLanguages.find(({ lang }) => language === lang);


// console.log("voices",voices)
    const[text,setText]=useState<string>()
     const isSpeechDetected=false
    
     const availableVoices = voices?.filter(({ lang }) => lang === language);
     const activeVoice =
       availableVoices?.find(({ name }) => name.includes('Google'))
       || availableVoices?.find(({ name }) => name.includes('Luciana'))
       || availableVoices?.[0];
       console.log(activeVoice)
     useEffect(()=>{
      const voices=window.speechSynthesis.getVoices()
      if ( Array.isArray(voices) && voices.length > 0 ) {
        setVoices(voices);
        return;
      }
      if ( 'onvoiceschanged' in window.speechSynthesis ) {
        window.speechSynthesis.onvoiceschanged = function() {
          const voices = window.speechSynthesis.getVoices();
          setVoices(voices);
        }
      }
     },[])
    function handleOnRecord() {

      if(isRecording){
        recognitionRef.current?.stop();
        setIsRecording(false);
        return;
      }
      speak(' ')
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
      }
       recognitionRef.current = new SpeechRecognition();

       recognitionRef.current.onstart=function(){
        setIsRecording(true)
       }
       recognitionRef.current.onend=function(){
       setIsRecording(false)
       }
      recognitionRef.current.onresult = async function(event) {
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
              language 
            }),
          });
  
          const data = await response.json();
          setTranslation(data.text);
        speak(data.text)

        } catch (err) {
          console.error("Translation failed:", err);
          setTranslation("Translation failed. Please try again.");
        }
     
        
      }
      recognitionRef.current.onerror = function (event: any) {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current.start();
    }

    function speak(text: string) {
      if (!text) return;
    
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
    
      if (activeVoice) {
        utterance.voice = activeVoice;
      }
    
      // Cancel any ongoing speech and wait a moment before speaking
      window.speechSynthesis.cancel();
    
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 250); // Delay ensures cancellation is processed before speaking
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
            <select
              id="sourceLanguage"
              value={sourceLanguage}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              disabled={isRecording}
            >
            
                <option  value={sourceLanguage}>
                 English {sourceLanguage}
                </option>
        
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="targetLanguage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Target Language
            </label>
            <select
              id="language"
              name='language'
              value={language}
              onChange={(e)=>{setLanguage(e.currentTarget.value)}}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              disabled={isRecording}
            >
               {availableLanguages.map(({ lang, label }) => {
                    return (
                      <option key={lang} value={lang}>
                        { label } ({ lang })
                      </option>
                    )
                  })}
              </select>
         
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
            {/* Play Translation Button */}
            {translation && (
          <div className="flex justify-center">
            <button
              onClick={()=>{speak(translation)}}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow transition-colors"
              aria-label="Play translation"
            >
              <PlayIcon className="h-5 w-5" />
              <span>Play Translation</span>
            </button>
          </div>
        )}
      
      </div>

    </div>
  )
}

export default Translator