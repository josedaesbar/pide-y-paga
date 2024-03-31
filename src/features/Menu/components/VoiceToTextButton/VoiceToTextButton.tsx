import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "../../../../components/2-molecules/Button/Button";
import { useEffect, useState } from "react";

type VoiceToTextButtonProps = {
  isLoading: boolean;
  value: string;
  setValue(value: string): void;
};

export const VoiceToTextButton = ({ isLoading, setValue, value }: VoiceToTextButtonProps) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition, interimTranscript } =
    useSpeechRecognition();

  const [isReset, setIsReset] = useState<boolean>(false);

  const onClickButton = () => {
    if (listening) {
      setIsReset(true);
      SpeechRecognition.stopListening();

      resetTranscript();
      return;
    }

    setIsReset(false);
    SpeechRecognition.startListening({ continuous: true, language: "es-PE" });
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>El navegador no es compatible, use Chrome</span>;
  }

  useEffect(() => {
    if (isReset === false) {
      setValue(transcript);
      console.log(transcript);
    }
  }, [transcript]);

  return (
    <Button
      bgColor={listening ? "red-light" : "blue-light-1"}
      color="white"
      disabled={isLoading}
      onClick={onClickButton}
    >
      {listening ? "Detener" : "Insertar texto por voz"}
    </Button>
  );
};
