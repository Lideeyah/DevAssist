import React, { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";

interface SpitchSpeechToTextProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
  language?: "en" | "yo" | "ha" | "ig" | "am";
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
  const [originalText, setOriginalText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleListening = async () => {
    if (disabled) return;
    if (!listening) {
      // Clear previous transcript before new recording
      try {
        onTranscript("");
        setOriginalText("");
        setTranslatedText("");
      } catch (e) {
        console.warn("onTranscript clearing error:", e);
      }
      setError(null);
      await startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = async () => {
    setListening(true);
    audioChunksRef.current = [];

    try {
      const allowedMimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg", "audio/m4a"];

      const supportedType = allowedMimeTypes.find((type) => (type ? MediaRecorder.isTypeSupported(type) : false));

      console.debug("Supported MIME for recording:", supportedType);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      const options: MediaRecorderOptions = supportedType ? { mimeType: supportedType } : {};

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
          console.debug("Chunk size:", ev.data.size, "type:", ev.data.type);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        try {
          if (audioChunksRef.current.length === 0) {
            throw new Error("No audio data captured");
          }

          let blob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || "audio/webm",
          });

          console.debug("Recorded blob type:", blob.type);
          console.debug("Recorded blob size:", blob.size);

          const spitchSupportedMime = ["audio/wav", "audio/mpeg", "audio/ogg", "audio/m4a", "audio/mp4", "audio/mp3"];

          if (!spitchSupportedMime.includes(blob.type.toLowerCase())) {
            console.debug("Blob type not directly supported; converting to WAV");
            try {
              blob = await convertBlobToWav(blob);
              console.debug("After conversion, blob type:", blob.type);
              console.debug("After conversion, blob size:", blob.size);
            } catch (convErr) {
              console.error("Conversion to WAV failed:", convErr);
              throw new Error("Audio conversion failed: " + (convErr as Error).message);
            }
          }

          if (blob.size > 25 * 1024 * 1024) {
            throw new Error("Audio file too large (>25 MB)");
          }

          await transcribeAudio(blob);
        } catch (e) {
          console.error("Transcription error:", e);
          setError("Transcription failed: " + (e instanceof Error ? e.message : String(e)));
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
    } catch (e) {
      console.error("Error during startRecording:", e);
      setError("Microphone access denied or not available");
      setListening(false);
    }
  };

  const stopRecording = () => {
    setListening(false);
    const mr = mediaRecorderRef.current;
    if (mr && mr.state === "recording") {
      mr.stop();
      mr.stream.getTracks().forEach((t) => t.stop());
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    const apiKey = import.meta.env.VITE_SPITCH_API_KEY;
    if (!apiKey) {
      throw new Error("Spitch API key not configured");
    }

    console.debug("Sending blob for transcription. Blob type:", audioBlob.type, "size:", audioBlob.size);

    const formData = new FormData();
    formData.append("language", language);
    formData.append("timestamp", timestampMode);
    formData.append("content", new File([audioBlob], `recording.${getExtension(audioBlob.type)}`, { type: audioBlob.type }));

    const response = await fetch("https://api.spi-tch.com/v1/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    console.debug("Spitch API status:", response.status, response.statusText);
    const respText = await response.clone().text();
    console.debug("Spitch API response text:", respText);

    if (!response.ok) {
      let errText: string;
      try {
        const errJson = await response.json();
        errText = JSON.stringify(errJson);
      } catch (_) {
        errText = respText;
      }
      throw new Error(`Spitch API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    console.debug("Spitch API response JSON:", data);

    if (data.text) {
      setOriginalText(data.text);

      // If language is not English and auto-translate is enabled, translate the text
      if (language !== "en" && autoTranslate) {
        await translateText(data.text, language);
      } else {
        // If it's already English or translation is disabled, just pass it through
        onTranscript(data.text);
        setTranslatedText(data.text);
      }
    } else {
      throw new Error("No 'text' field in response");
    }
  };

  // Function to translate text using Spitch Translation API
  const translateText = async (text: string, sourceLang: string) => {
    try {
      const apiKey = import.meta.env.VITE_SPITCH_API_KEY;
      if (!apiKey) {
        throw new Error("Spitch API key not configured");
      }

      // Call Spitch translation API
      const response = await fetch("https://api.spi-tch.com/v1/translations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          source_language: sourceLang,
          target_language: "en",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Translation failed: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json();

      if (data.translated_text) {
        setTranslatedText(data.translated_text);
        onTranscript(data.translated_text);
      } else {
        throw new Error("No translated_text field in response");
      }
    } catch (error) {
      console.error("Translation error:", error);
      // If translation fails, fall back to the original text
      setTranslatedText(text);
      onTranscript(text);
      setError("Translation failed: " + (error instanceof Error ? error.message : String(error)));
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
    return "wav";
  };

  const convertBlobToWav = async (blob: Blob): Promise<Blob> => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } catch (decodeErr) {
      console.error("decodeAudioData failed:", decodeErr);
      throw new Error("decodeAudioData failed: " + (decodeErr as Error).message);
    }

    const wavBlob = audioBufferToWavBlob(audioBuffer, {
      sampleRate: audioBuffer.sampleRate,
      numChannels: audioBuffer.numberOfChannels,
    });
    return wavBlob;
  };

  const audioBufferToWavBlob = (buffer: AudioBuffer, opts: { sampleRate: number; numChannels: number }): Blob => {
    const { sampleRate, numChannels } = opts;
    const bitDepth = 16;
    const wavBuffer = encodeWAV(buffer, { sampleRate, numChannels, bitDepth });
    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  const encodeWAV = (inputBuffer: AudioBuffer, options: { sampleRate: number; numChannels: number; bitDepth: number }): ArrayBuffer => {
    const { sampleRate, numChannels, bitDepth } = options;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const numSamples = inputBuffer.length;
    const dataLength = numSamples * blockAlign;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    // Correctly define audio format for WAV
    const audioFormat = 1; // PCM = 1

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, audioFormat, true); // Audio format (1 = PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, "data");
    view.setUint32(40, dataLength, true);

    const channelData: Float32Array[] = [];
    for (let ch = 0; ch < numChannels; ch++) {
      channelData.push(inputBuffer.getChannelData(ch));
    }

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        let sample = channelData[ch][i];
        if (sample > 1) sample = 1;
        if (sample < -1) sample = -1;
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return buffer;
  };

  const writeString = (view: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  const toggleTranslationView = () => {
    setShowTranslation(!showTranslation);
  };

  useEffect(() => {
    return () => {
      const mr = mediaRecorderRef.current;
      if (mr && mr.state === "recording") {
        mr.stop();
        mr.stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 p-3">
      <div className="flex items-center gap-2 ">
        <button
          onClick={toggleListening}
          disabled={disabled || isProcessing}
          className={`transition-colors ${listening ? " text-red-600 animate-pulse" : "hover:text-blue-500"} ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          title={listening ? "Stop recording" : "Start recording"}
        >
          {!isProcessing ? <Mic size={20} className="" /> : <span className="ml-2 text-sm animate-pulse">Please wait...</span>}

          {/* {isProcessing && } */}
        </button>
      </div>
    </div>
  );
};

export default SpitchSpeechToText;
