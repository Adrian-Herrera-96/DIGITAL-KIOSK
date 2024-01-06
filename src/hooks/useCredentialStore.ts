import { setChangeStep, setIdentifyUser, setIdentityCard, setInstructionState, setResetAll, setTimer } from "@/store";
import { useDispatch, useSelector } from "react-redux";
export const useCredentialStore = () => {
  const { step, identityCard, userIdentify, timer, InstructionState } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const changeStep = async (step: string | null) => {
    dispatch(setChangeStep({ step }))
  }
  const changeIdentityCard = async (identityCard: string) => {
    dispatch(setIdentityCard({ identityCard: identityCard }));
  }
  const changeIdentifyUser = async (userIdentify: boolean) => {
    dispatch(setIdentifyUser({ userIdentify: userIdentify }));
  }
  const changeTimer = async (timer: number) => {
    dispatch(setTimer({ timer }));
  }
  const changeStateInstruction = async (state: boolean) => {
    dispatch(setInstructionState({ state }));
  }
  const changeResetAll = async () => {
    dispatch(setResetAll());
  }


  return {
    //* Propiedades
    step,
    identityCard,
    userIdentify,
    timer,
    InstructionState,
    //* Métodos
    changeStep,
    changeIdentityCard,
    changeIdentifyUser,
    changeTimer,
    changeStateInstruction,
    changeResetAll,
  }
}
