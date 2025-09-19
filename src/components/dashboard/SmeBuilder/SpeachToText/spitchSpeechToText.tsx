// import React, { useState, useRef, useEffect } from "react";
// import { Mic } from "lucide-react";

// interface SpitchSpeechToTextProps {
//   onTranscript: (transcript: string) => void;
//   disabled?: boolean;
//   language?: "en" | "yo" | "ha" | "ig" | "am";
//   timestampMode?: "sentence" | "word" | "none";
//   autoTranslate?: boolean;
// }

// const SpitchSpeechToText: React.FC<SpitchSpeechToTextProps> = ({
//   onTranscript,
//   disabled = false,
//   language = "en",
//   timestampMode = "sentence",
//   autoTranslate = true,
// }) => {
//   const [listening, setListening] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [originalText, setOriginalText] = useState<string>("");
//   const [translatedText, setTranslatedText] = useState<string>("");
//   const [showTranslation, setShowTranslation] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);

//   const toggleListening = async () => {
//     if (disabled) return;
//     if (!listening) {
//       // Clear previous transcript before new recording
//       try {
//         onTranscript("");
//         setOriginalText("");
//         setTranslatedText("");
//       } catch (e) {
//         console.warn("onTranscript clearing error:", e);
//       }
//       setError(null);
//       await startRecording();
//     } else {
//       stopRecording();
//     }
//   };

//   const startRecording = async () => {
//     setListening(true);
//     audioChunksRef.current = [];

//     try {
//       const allowedMimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg", "audio/m4a"];

//       const supportedType = allowedMimeTypes.find((type) => (type ? MediaRecorder.isTypeSupported(type) : false));

//       console.debug("Supported MIME for recording:", supportedType);

//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           channelCount: 1,
//           sampleRate: 16000,
//         },
//       });

//       const options: MediaRecorderOptions = supportedType ? { mimeType: supportedType } : {};

//       const mediaRecorder = new MediaRecorder(stream, options);
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (ev) => {
//         if (ev.data && ev.data.size > 0) {
//           audioChunksRef.current.push(ev.data);
//           console.debug("Chunk size:", ev.data.size, "type:", ev.data.type);
//         }
//       };

//       mediaRecorder.onstop = async () => {
//         setIsProcessing(true);
//         try {
//           if (audioChunksRef.current.length === 0) {
//             throw new Error("No audio data captured");
//           }

//           let blob = new Blob(audioChunksRef.current, {
//             type: mediaRecorder.mimeType || "audio/webm",
//           });

//           console.debug("Recorded blob type:", blob.type);
//           console.debug("Recorded blob size:", blob.size);

//           const spitchSupportedMime = ["audio/wav", "audio/mpeg", "audio/ogg", "audio/m4a", "audio/mp4", "audio/mp3"];

//           if (!spitchSupportedMime.includes(blob.type.toLowerCase())) {
//             console.debug("Blob type not directly supported; converting to WAV");
//             try {
//               blob = await convertBlobToWav(blob);
//               console.debug("After conversion, blob type:", blob.type);
//               console.debug("After conversion, blob size:", blob.size);
//             } catch (convErr) {
//               console.error("Conversion to WAV failed:", convErr);
//               throw new Error("Audio conversion failed: " + (convErr as Error).message);
//             }
//           }

//           if (blob.size > 25 * 1024 * 1024) {
//             throw new Error("Audio file too large (>25 MB)");
//           }

//           await transcribeAudio(blob);
//         } catch (e) {
//           console.error("Transcription error:", e);
//           setError("Transcription failed: " + (e instanceof Error ? e.message : String(e)));
//         } finally {
//           setIsProcessing(false);
//         }
//       };

//       mediaRecorder.start();
//     } catch (e) {
//       console.error("Error during startRecording:", e);
//       setError("Microphone access denied or not available");
//       setListening(false);
//     }
//   };

//   const stopRecording = () => {
//     setListening(false);
//     const mr = mediaRecorderRef.current;
//     if (mr && mr.state === "recording") {
//       mr.stop();
//       mr.stream.getTracks().forEach((t) => t.stop());
//     }
//   };

//   const transcribeAudio = async (audioBlob: Blob) => {
//     const apiKey = import.meta.env.VITE_SPITCH_API_KEY;
//     if (!apiKey) {
//       throw new Error("Spitch API key not configured");
//     }

//     console.debug("Sending blob for transcription. Blob type:", audioBlob.type, "size:", audioBlob.size);

//     const formData = new FormData();
//     formData.append("language", language);
//     formData.append("timestamp", timestampMode);
//     formData.append("content", new File([audioBlob], `recording.${getExtension(audioBlob.type)}`, { type: audioBlob.type }));

//     const response = await fetch("https://api.spi-tch.com/v1/transcriptions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: formData,
//     });

//     console.debug("Spitch API status:", response.status, response.statusText);
//     const respText = await response.clone().text();
//     console.debug("Spitch API response text:", respText);

//     if (!response.ok) {
//       let errText: string;
//       try {
//         const errJson = await response.json();
//         errText = JSON.stringify(errJson);
//       } catch (_) {
//         errText = respText;
//       }
//       throw new Error(`Spitch API error ${response.status}: ${errText}`);
//     }

//     const data = await response.json();
//     console.debug("Spitch API response JSON:", data);

//     if (data.text) {
//       setOriginalText(data.text);

//       // If language is not English and auto-translate is enabled, translate the text
//       if (language !== "en" && autoTranslate) {
//         await translateText(data.text, language);
//       } else {
//         // If it's already English or translation is disabled, just pass it through
//         onTranscript(data.text);
//         setTranslatedText(data.text);
//       }
//     } else {
//       throw new Error("No 'text' field in response");
//     }
//   };

//   // Function to translate text using Spitch Translation API
//   const translateText = async (text: string, sourceLang: string) => {
//     try {
//       const apiKey = import.meta.env.VITE_SPITCH_API_KEY;
//       if (!apiKey) {
//         throw new Error("Spitch API key not configured");
//       }

//       // Call Spitch translation API
//       const response = await fetch("https://api.spi-tch.com/v1/translations", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           text: text,
//           source_language: sourceLang,
//           target_language: "en",
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Translation failed: ${response.status} - ${errorData.message || "Unknown error"}`);
//       }

//       const data = await response.json();

//       if (data.translated_text) {
//         setTranslatedText(data.translated_text);
//         onTranscript(data.translated_text);
//       } else {
//         throw new Error("No translated_text field in response");
//       }
//     } catch (error) {
//       console.error("Translation error:", error);
//       // If translation fails, fall back to the original text
//       setTranslatedText(text);
//       onTranscript(text);
//       setError("Translation failed: " + (error instanceof Error ? error.message : String(error)));
//     }
//   };

//   const getExtension = (mimeType: string) => {
//     const m = mimeType.toLowerCase();
//     if (m.includes("wav")) return "wav";
//     if (m.includes("mpeg") || m.includes("mp3")) return "mp3";
//     if (m.includes("ogg")) return "ogg";
//     if (m.includes("m4a")) return "m4a";
//     if (m.includes("mp4")) return "mp4";
//     if (m.includes("webm")) return "webm";
//     return "wav";
//   };

//   const convertBlobToWav = async (blob: Blob): Promise<Blob> => {
//     const arrayBuffer = await blob.arrayBuffer();
//     const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
//     let audioBuffer: AudioBuffer;
//     try {
//       audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
//     } catch (decodeErr) {
//       console.error("decodeAudioData failed:", decodeErr);
//       throw new Error("decodeAudioData failed: " + (decodeErr as Error).message);
//     }

//     const wavBlob = audioBufferToWavBlob(audioBuffer, {
//       sampleRate: audioBuffer.sampleRate,
//       numChannels: audioBuffer.numberOfChannels,
//     });
//     return wavBlob;
//   };

//   const audioBufferToWavBlob = (buffer: AudioBuffer, opts: { sampleRate: number; numChannels: number }): Blob => {
//     const { sampleRate, numChannels } = opts;
//     const bitDepth = 16;
//     const wavBuffer = encodeWAV(buffer, { sampleRate, numChannels, bitDepth });
//     return new Blob([wavBuffer], { type: "audio/wav" });
//   };

//   const encodeWAV = (inputBuffer: AudioBuffer, options: { sampleRate: number; numChannels: number; bitDepth: number }): ArrayBuffer => {
//     const { sampleRate, numChannels, bitDepth } = options;
//     const bytesPerSample = bitDepth / 8;
//     const blockAlign = numChannels * bytesPerSample;
//     const byteRate = sampleRate * blockAlign;
//     const numSamples = inputBuffer.length;
//     const dataLength = numSamples * blockAlign;
//     const buffer = new ArrayBuffer(44 + dataLength);
//     const view = new DataView(buffer);

//     // Correctly define audio format for WAV
//     const audioFormat = 1; // PCM = 1

//     writeString(view, 0, "RIFF");
//     view.setUint32(4, 36 + dataLength, true);
//     writeString(view, 8, "WAVE");
//     writeString(view, 12, "fmt ");
//     view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
//     view.setUint16(20, audioFormat, true); // Audio format (1 = PCM)
//     view.setUint16(22, numChannels, true);
//     view.setUint32(24, sampleRate, true);
//     view.setUint32(28, byteRate, true);
//     view.setUint16(32, blockAlign, true);
//     view.setUint16(34, bitDepth, true);
//     writeString(view, 36, "data");
//     view.setUint32(40, dataLength, true);

//     const channelData: Float32Array[] = [];
//     for (let ch = 0; ch < numChannels; ch++) {
//       channelData.push(inputBuffer.getChannelData(ch));
//     }

//     let offset = 44;
//     for (let i = 0; i < numSamples; i++) {
//       for (let ch = 0; ch < numChannels; ch++) {
//         let sample = channelData[ch][i];
//         if (sample > 1) sample = 1;
//         if (sample < -1) sample = -1;
//         const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
//         view.setInt16(offset, intSample, true);
//         offset += 2;
//       }
//     }

//     return buffer;
//   };

//   const writeString = (view: DataView, offset: number, str: string) => {
//     for (let i = 0; i < str.length; i++) {
//       view.setUint8(offset + i, str.charCodeAt(i));
//     }
//   };

//   const toggleTranslationView = () => {
//     setShowTranslation(!showTranslation);
//   };

//   useEffect(() => {
//     return () => {
//       const mr = mediaRecorderRef.current;
//       if (mr && mr.state === "recording") {
//         mr.stop();
//         mr.stream.getTracks().forEach((t) => t.stop());
//       }
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center gap-2 p-3">
//       <div className="flex items-center gap-2 ">
//         <button
//           onClick={toggleListening}
//           disabled={disabled || isProcessing}
//           className={`transition-colors ${listening ? " text-red-600 animate-pulse" : "hover:text-blue-500"} ${
//             disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
//           }`}
//           title={listening ? "Stop recording" : "Start recording"}
//         >
//           {!isProcessing ? <Mic size={20} className="" /> : <span className="ml-2 text-sm animate-pulse">Please wait...</span>}

//           {/* {isProcessing && } */}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SpitchSpeechToText;

import React, { useState, useRef } from "react";
import { Mic, WifiOff } from "lucide-react";

type SpitchLang = "en" | "yo" | "ha" | "ig";

interface SpitchSpeechToTextProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
  language?: SpitchLang;
  timestampMode?: "sentence" | "word" | "none";
  autoTranslate?: boolean;
}

const SpitchSpeechToText: React.FC<SpitchSpeechToTextProps> = ({
  onTranscript,
  disabled = false,
  language = "en",
  timestampMode = "sentence",
  autoTranslate = true,
}) => {
  const [listening, setListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<SpitchLang>("en");
  const [networkError, setNetworkError] = useState(false);

  const [originalText, setOriginalText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const supportedTranslateLangs: SpitchLang[] = ["yo", "ha", "ig"];

  const cleanText = (text: string, lang: SpitchLang): string => {
    if (!text) return text;

    let cleaned = text;

    // Common garbage patterns across all languages
    const commonGarbage = [/ọ̀pọ̀ ọ̀pọ̀.*$/, /pẹ̀pọ̀.*$/, /ní ọdún tó ń bọ̀.*$/, /ƙarin ƙarin.*$/, /gburugburu gburugburu.*$/, /ụgbọ elu ụgbọ elu.*$/];

    commonGarbage.forEach((pattern) => {
      cleaned = cleaned.replace(pattern, "").trim();
    });

    // Language-specific cleaning
    if (lang === "yo") {
      const yorubaGarbage = [/ṣe ń ṣe ìpàdé ẹgbẹ́.*$/, /ní ọ̀sẹ̀ tí ó lọ́wọ́lọ́wọ́.*$/, /bí o bá kúrò ní ọ̀rẹ́ rẹ̀.*$/, /kúrò ní ọ̀rẹ́.*$/, /ṣe ní.*$/];
      yorubaGarbage.forEach((pattern) => {
        cleaned = cleaned.replace(pattern, "").trim();
      });
    }

    if (lang === "ha") {
      cleaned = cleaned.replace(/ɗaɗa mai daɗi.*$/, "").trim();
    }

    if (lang === "ig") {
      cleaned = cleaned.replace(/n'ọdụ ụgbọ elu.*$/, "").trim();
    }

    // Remove trailing incomplete words and punctuation
    cleaned = cleaned.replace(/[.,?]\s*[a-zA-Zà-ÿÀ-ÿ]*$/, "").trim();

    if (cleaned !== text) {
      console.log(`[Spitch] Cleaned ${lang} text: "${text}" -> "${cleaned}"`);
    }

    return cleaned;
  };

  const calculateQualityScore = (text: string, expectedLang: SpitchLang): number => {
    if (!text || text.includes("ERROR") || text.trim().length < 2) return 0;

    // INSTANT REJECTION for known garbage patterns
    const garbagePatterns = [
      "ọ̀pọ̀ ọ̀pọ̀",
      "pẹ̀pọ̀",
      "ní ọdún tó ń bọ̀",
      "ɗaɗa mai daɗi",
      "ƙarin ƙarin",
      "ụgbọ elu ụgbọ elu",
      "gburugburu gburugburu",
      "ṣe ìpàdé ẹgbẹ́",
      "kúrò ní ọ̀rẹ́",
      "n'ọdụ ụgbọ elu",
      "ɗalibai baɗi",
      "akpụkpọ ụkwụ",
      "keakị nke ọdụm",
    ];

    for (const pattern of garbagePatterns) {
      if (text.includes(pattern)) {
        return 0;
      }
    }

    let score = 0;

    // Basic quality points
    const wordCount = text.split(" ").length;
    if (wordCount >= 2 && wordCount <= 12) score += 3;

    // Language-specific scoring
    if (expectedLang === "en") {
      // English should not have African diacritics
      const diacriticCount = (text.match(/[àèìòùáéíóúñ]/g) || []).length;
      if (diacriticCount === 0) score += 4;

      // Should have proper English structure
      if (text.match(/[a-zA-Z]/) && text.match(/[.!?]$/)) score += 2;

      // Penalize short nonsensical English
      if (wordCount < 3 && text.length < 10) score -= 2;
    } else {
      // African languages should have diacritics
      const diacriticCount = (text.match(/[àèìòùáéíóúñ]/g) || []).length;
      if (diacriticCount > 0) score += 6; // Higher weight for African languages

      // Bonus for coherent African language text
      if (wordCount >= 3 && wordCount <= 8) score += 2;

      // Penalize English words in African language results
      if (text.match(/\b(the|and|for|to|a|an|is|are|was|were|bow|your|enemies)\b/i)) {
        score -= 4;
      }
    }

    return Math.max(1, score);
  };

  const toggleListening = async () => {
    console.log("[Spitch] toggleListening called, current state:", listening, "disabled:", disabled);
    if (disabled) {
      console.log("[Spitch] Component is disabled, ignoring toggle");
      return;
    }
    if (!listening) {
      console.log("[Spitch] Starting recording...");
      setError(null);
      setNetworkError(false);
      setOriginalText("");
      setTranslatedText("");
      setDetectedLanguage("en");
      onTranscript(""); // reset parent
      await startRecording();
    } else {
      console.log("[Spitch] Stopping recording...");
      stopRecording();
    }
  };

  const toggleTestMode = () => {
    setTestMode(!testMode);
    console.log("[Spitch] Test mode:", !testMode);
  };

  const startRecording = async () => {
    console.log("[Spitch] startRecording called");
    setListening(true);
    audioChunksRef.current = [];
    try {
      const allowedMimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg", "audio/m4a"];
      const supportedType = allowedMimeTypes.find((type) => type && MediaRecorder.isTypeSupported(type));
      console.debug("[Spitch] Supported MIME:", supportedType);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      console.log("[Spitch] Microphone access granted");

      const options: MediaRecorderOptions = supportedType ? { mimeType: supportedType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
          console.debug("[Spitch] Audio chunk captured - size:", ev.data.size, "type:", ev.data.type);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("[Spitch] Recording stopped, processing audio...");
        setIsProcessing(true);
        try {
          if (audioChunksRef.current.length === 0) {
            console.error("[Spitch] No audio data captured");
            throw new Error("No audio data captured");
          }
          let blob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || "audio/webm",
          });
          console.debug("[Spitch] Audio blob created - type:", blob.type, "size:", blob.size);

          const spitchSupportedMime = ["audio/wav", "audio/mpeg", "audio/ogg", "audio/m4a", "audio/mp4", "audio/mp3"];
          if (!spitchSupportedMime.includes(blob.type.toLowerCase())) {
            console.log("[Spitch] Converting blob to WAV format");
            blob = await convertBlobToWav(blob);
            console.debug("[Spitch] After conversion - type:", blob.type, "size:", blob.size);
          }

          if (blob.size > 25 * 1024 * 1024) {
            console.error("[Spitch] Audio file too large:", blob.size, "bytes");
            throw new Error("Audio file too large (>25 MB)");
          }

          if (testMode) {
            await testSpitchApi(blob);
          } else {
            await transcribeAudio(blob);
          }
        } catch (e) {
          console.error("[Spitch] Error in onstop:", e);
          setError("Transcription failed: " + (e instanceof Error ? e.message : String(e)));
          // Check if it's a network error
          if (e instanceof Error && (e.message.includes("network") || e.message.includes("Network") || e.message.includes("fetch"))) {
            setNetworkError(true);
          }
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      console.log("[Spitch] MediaRecorder started successfully");
    } catch (e) {
      console.error("[Spitch] startRecording error:", e);
      setError("Microphone access denied or not available");
      setListening(false);
    }
  };

  const stopRecording = () => {
    console.log("[Spitch] stopRecording called");
    setListening(false);
    const mr = mediaRecorderRef.current;
    if (mr && mr.state === "recording") {
      console.log("[Spitch] Stopping MediaRecorder");
      mr.stop();
      mr.stream.getTracks().forEach((t) => t.stop());
    }
  };

  // TEST FUNCTION: Try different languages to see if API works
  const testSpitchApi = async (audioBlob: Blob) => {
    console.log("[Spitch] TEST MODE: Testing API with different languages");

    const testLanguages: SpitchLang[] = ["en", "yo", "ha", "ig"];
    const results: { lang: SpitchLang; text: string; score: number }[] = [];

    for (const testLang of testLanguages) {
      try {
        console.log(`[Spitch] Testing with language: ${testLang}`);
        const result = await sendToSpitchApi(audioBlob, testLang);
        const cleanedResult = cleanText(result, testLang);
        const score = calculateQualityScore(cleanedResult, testLang);
        results.push({ lang: testLang, text: cleanedResult, score });
      } catch (e) {
        console.error(`[Spitch] Test failed for ${testLang}:`, e);
        results.push({ lang: testLang, text: `ERROR: ${e instanceof Error ? e.message : String(e)}`, score: 0 });
        // Check if it's a network error
        if (e instanceof Error && (e.message.includes("network") || e.message.includes("Network") || e.message.includes("fetch"))) {
          setNetworkError(true);
        }
      }
    }

    // Display all results
    console.log("[Spitch] TEST RESULTS:", results);

    // Find the best result
    const bestResult = results.reduce((best, current) => (current.score > best.score ? current : best));

    setError(`TEST: Best result: ${bestResult.lang} (score: ${bestResult.score}) - ${bestResult.text}`);

    // Use the best result
    setOriginalText(bestResult.text);
    setDetectedLanguage(bestResult.lang);

    if (bestResult.lang !== "en" && autoTranslate) {
      await translateText(bestResult.text, bestResult.lang);
    } else {
      onTranscript(bestResult.text);
    }
  };

  const sendToSpitchApi = async (audioBlob: Blob, targetLanguage: SpitchLang): Promise<string> => {
    const apiKey = import.meta.env.VITE_SPITCH_API_KEY;
    if (!apiKey) {
      throw new Error("API key not configured");
    }

    const formData = new FormData();
    formData.append("language", targetLanguage);
    formData.append("timestamp", timestampMode);
    formData.append(
      "content",
      new File([audioBlob], `recording.${getExtension(audioBlob.type)}`, {
        type: audioBlob.type,
      })
    );

    const response = await fetch("https://api.spi-tch.com/v1/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} ${JSON.stringify(errJson)}`);
    }

    const data = await response.json();
    return data.text || "";
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    console.log("[Spitch] transcribeAudio called");

    // Use AUTO-DETECTION by trying all languages and picking the best
    const testLanguages: SpitchLang[] = ["en", "yo", "ha", "ig"];
    const results: { lang: SpitchLang; text: string; score: number }[] = [];

    for (const testLang of testLanguages) {
      try {
        const result = await sendToSpitchApi(audioBlob, testLang);
        const cleanedResult = cleanText(result, testLang);
        const score = calculateQualityScore(cleanedResult, testLang);
        results.push({ lang: testLang, text: cleanedResult, score });
        console.log(`[Spitch] ${testLang} result (score: ${score}):`, cleanedResult);
      } catch (e) {
        console.error(`[Spitch] Failed for ${testLang}:`, e);
        results.push({ lang: testLang, text: "", score: 0 });
        // Check if it's a network error
        if (e instanceof Error && (e.message.includes("network") || e.message.includes("Network") || e.message.includes("fetch"))) {
          setNetworkError(true);
        }
      }
    }

    // Find the best result
    const bestResult = results.reduce((best, current) => (current.score > best.score ? current : best));

    console.log("[Spitch] Best result:", bestResult);

    if (bestResult.score < 3) {
      setError("Low quality transcription - please try again");
      onTranscript("");
      return;
    }

    setOriginalText(bestResult.text);
    setDetectedLanguage(bestResult.lang);

    // Only translate if we detected an African language AND autoTranslate is true
    if (bestResult.lang !== "en" && autoTranslate) {
      console.log(`[Spitch] Translating from ${bestResult.lang} to English`);
      await translateText(bestResult.text, bestResult.lang);
    } else {
      console.log(`[Spitch] Using ${bestResult.lang} text directly`);
      onTranscript(bestResult.text);
    }
  };

  const translateText = async (text: string, sourceLang: SpitchLang) => {
    console.log("[Spitch] translateText called:", { text: text.substring(0, 50) + "...", sourceLang });

    const apiKey = import.meta.env.VITE_SPITCH_API_KEY;
    if (!apiKey) {
      console.error("[Spitch] API key not found for translation");
      setError("Spitch API key not configured");
      onTranscript(text);
      return;
    }

    if (text.trim().length === 0) {
      console.warn("[Spitch] Empty text, skipping translation");
      onTranscript("");
      return;
    }

    console.log("[Spitch] API Key:", apiKey ? "Present" : "Missing");
    console.log("[Spitch] Environment:", import.meta.env);

    if (!apiKey) {
      throw new Error("API key not configured. Please check your .env file");
    }

    try {
      const resp = await fetch("https://api.spi-tch.com/v1/translate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          source: sourceLang,
          target: "en",
        }),
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        throw new Error(`Translate error: ${resp.status} ${JSON.stringify(errJson)}`);
      }

      const data = await resp.json();
      setTranslatedText(data.text);
      onTranscript(data.text);
    } catch (e) {
      console.error("[Spitch] translateText caught:", e);
      onTranscript(text); // Fallback to original text
      // Check if it's a network error
      if (e instanceof Error && (e.message.includes("network") || e.message.includes("Network") || e.message.includes("fetch"))) {
        setNetworkError(true);
      }
    }
  };
  const getExtension = (mimeType: string) => {
    const m = mimeType.toLowerCase();
    if (m.includes("wav")) return "wav";
    if (m.includes("mpeg") || m.includes("mp3")) return "mp3";
    if (m.includes("ogg")) return "ogg";
    if (m.includes("m4a")) return "m4a";
    if (m.includes("mp4")) return "mp4";
    if (m.includes("webm")) return "webm";
    return "dat";
  };

  const convertBlobToWav = async (blob: Blob): Promise<Blob> => {
    console.log("[Spitch] Converting blob to WAV...");

    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);

    // WAV encoding
    const numChannels = decoded.numberOfChannels;
    const sampleRate = decoded.sampleRate;
    const length = decoded.length * numChannels * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);

    // Write WAV header
    let offset = 0;
    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
      offset += str.length;
    };

    writeString("RIFF");
    view.setUint32(offset, 36 + decoded.length * numChannels * 2, true);
    offset += 4;
    writeString("WAVE");
    writeString("fmt ");
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2; // PCM
    view.setUint16(offset, numChannels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, sampleRate * numChannels * 2, true);
    offset += 4;
    view.setUint16(offset, numChannels * 2, true);
    offset += 2;
    view.setUint16(offset, 16, true);
    offset += 2;
    writeString("data");
    view.setUint32(offset, decoded.length * numChannels * 2, true);
    offset += 4;

    // Write PCM samples
    const interleaved = new Float32Array(decoded.length * numChannels);
    for (let i = 0; i < decoded.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        interleaved[i * numChannels + channel] = decoded.getChannelData(channel)[i];
      }
    }

    let idx = offset;
    for (let i = 0; i < interleaved.length; i++, idx += 2) {
      const s = Math.max(-1, Math.min(1, interleaved[i]));
      view.setInt16(idx, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([buffer], { type: "audio/wav" });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={toggleListening}
        disabled={disabled || isProcessing}
        className={`transition-colors ${listening ? " text-red-600 animate-pulse" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        title={listening ? "Stop recording" : "Start recording"}
      >
        {networkError ? (
          <div className="flex flex-col items-center">
            <WifiOff size={20} className="text-red-500" />
          </div>
        ) : !isProcessing ? (
          <Mic size={20} className={`text-neutral-400  ${listening ? "text-red-500" : ""}`} />
        ) : (
          <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-transparent"></span>
        )}
      </button>
    </div>
  );
};

export default SpitchSpeechToText;
