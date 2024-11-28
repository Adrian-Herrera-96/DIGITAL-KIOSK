import { IdentityCard } from "./IdentityCard";
import { useCallback, useContext, useEffect, useRef } from "react";
import { useCredentialStore } from "@/hooks";
import { InstructionCard } from "./InstructionCard";

//@ts-expect-error do not proceed
import imageLogoBlanco from "@/assets/images/muserpol-logo-blanco.png";
import { HomeScreen } from "./HomeScreen";
import { FaceRecognition, OcrView } from ".";
import Footer from "@/components/Footer";

import { TimerContext } from "@/context/TimerContext";
import { AuthMethodChooser } from "./AuthMethodChooser";
import { BiometricRecognition } from "./biometric/BiometricRecognition";
import { Chooser } from "./Chooser";
import Header from "@/components/Header";

interface ChildRefType {
  action: (prop?: boolean) => void;
  onRemoveCam: () => void;
}

export const AuthView = () => {
  const childRef = useRef<ChildRefType>();
  const {
    step,
    identityCard,
    name,
    changeStep,
    changeIdentifyUser,
    changeIdentityCard,
    changeStateInstruction,
  } = useCredentialStore();

  const { seconds, resetTimer } = useContext(TimerContext);

  useEffect(() => {
    if (step == "home") {
      resetTimer();
    } else if (seconds == 1) {
      childRef.current?.onRemoveCam();
      changeStep("home");
      changeIdentityCard("");
      changeIdentifyUser(false);
      changeStateInstruction(true);
      resetTimer();
    }
  }, [step, seconds]);

  const handleClick = useCallback(() => {
    if (childRef) if (childRef.current) childRef.current.action(true);
    resetTimer();
  }, [childRef]);

  const handleClean = useCallback(() => {
    if (childRef) if (childRef.current) childRef.current.onRemoveCam();
  }, [childRef]);

  const resetStep = useCallback(() => {
    changeStep("home");
    changeIdentityCard("");
    handleClean();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {step != "home" && (
        <Header
          name={name}
          identityCard={identityCard}
          seconds={seconds}
          resetStep={resetStep}
        />
      )}
      <div style={{ flex: "1 1 auto", overflowX: "auto" }}>
        {/* Pantalla casita */}
        {step == "home" && <HomeScreen />}
        {/* Pantalla input carnet */}
        {step == "identityCard" && <IdentityCard ref={childRef} />}
        {/* Pantalla selección de servicio */}
        {step == "chooser" && <Chooser />}
        {/* Pantalla instrucción */}
        {step == "instructionCard" && identityCard != "" && (
          <InstructionCard ref={childRef} />
        )}
        {/* Pantalla reconocimiento ocr */}
        {step == "recognitionCard" && <OcrView ref={childRef} />}
        {/* Pantalla de selección de autenticación */}
        {step == "authMethodChooser" && <AuthMethodChooser />}
        {/* Pantalla de reconocimiento facial */}
        {step == "faceRecognition" && <FaceRecognition ref={childRef} />}
        {/* Pantalla reconocimiento de huellas */}
        {step == "biometricRecognition" && (
          <BiometricRecognition ref={childRef} />
        )}
      </div>
      {step != "home" && step != "chooser" && step != "authMethodChooser" && (
        <Footer action={handleClick} onRemoveCam={handleClean} />
      )}
    </div>
  );
};
