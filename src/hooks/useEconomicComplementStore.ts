import { pvtbeApi } from "@/services";
import { setCheckSemesters } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export const useEconomicComplementStore = () => {
  const { checkSemesters } = useSelector((state: any) => state.checkSemesters);
  const dispatch = useDispatch();

  const checkSemesterEnabled = async (identityCard: string) => {
    try {
      const { data } = await pvtbeApi.get(
        `/kiosk/person/${identityCard}/ecoCom`
      );
      dispatch(setCheckSemesters({ checkSemesters: data }));
      console.log("checkSemesterEnabled: ", data);
      return data;
    } catch (e: any) {
      console.error("Hubo un error con el backend PVT-BE");
    }
  };

  const createEconomicComplementProcess = async (body: any) => {
    try {
      const data = await pvtbeApi.post(`/kiosk/ecoCom`, body);
      return data;
    } catch (e: any) {
      console.error("Hubo un error al crear un trámite");
    }
  };

  const getInformationEconomicComplement = async (ecoComId: string) => {
    try {
      const { data } = await pvtbeApi.get(`/kiosk/ecoCom/${ecoComId}`);
      console.log(data);
      return data;
    } catch (e: any) {
      console.error(
        "Hubo un error al obtener la información del trámite creado"
      );
    }
  };

  return {
    checkSemesters,
    checkSemesterEnabled,
    createEconomicComplementProcess,
    getInformationEconomicComplement,
  };
};
