import { Box, Grid, Stack, Typography } from "@mui/material";
import { CardComponent } from "@/components";
// @ts-expect-error no proceded
import logo from "@/assets/images/aportes.png";
import { useContext, useEffect } from "react";
import { useContributionStore } from "@/hooks/useContributionStore";
import { useAuthStore } from "@/hooks/useAuthStore";
// import Swal from "sweetalert2";
import { TimerContext } from "@/context/TimerContext";
import { useLoading } from "@/hooks/useLoading";
import { useSweetAlert } from "@/hooks/useSweetAlert";

export const ContributionView = () => {
  const {
    getAllContributions,
    hasContributionActive,
    hasContributionPassive,
    printContributionActive,
    printContributionPassive,
  } = useContributionStore();

  const { user } = useAuthStore();
  const { setLoading } = useLoading();
  const { showAlert } = useSweetAlert();

  const { resetTimer } = useContext(TimerContext);

  useEffect(() => {
    getAllContributions(user.nup);
  }, []);

  const handlePrintContributionActive = async () => {
    setLoading(true);
    const response: any = await printContributionActive(user.nup);
    switch (response) {
      case 200:
        showAlert({
          title: "Impresión exitosa",
          message: "Recoja su hoja impresa",
          icon: "success",
          timer: 3000,
        });
        // Swal.fire({
        //   title: "Impresión exitosa",
        //   text: "Recoja su hoja impresa",
        //   icon: "success",
        //   confirmButtonText: "Aceptar",
        //   timer: 3000,
        // });
        break;
      case 400:
        showAlert({
          title: "No hay impresora conectada",
          message: "Contactese con soporte",
          icon: "warning",
          timer: 1500,
        });
        // Swal.fire({
        //   title: "No hay impresora conectada",
        //   text: "Contactese con soporte",
        //   icon: "warning",
        //   confirmButtonText: "Aceptar",
        //   timer: 1500,
        // });
        break;
      case 501:
        break;
      default:
        showAlert({
          title: "Hubo un error",
          message: "El servicio de impresión no se encuentra disponible",
          icon: "error",
          timer: 1500,
        });
        // Swal.fire({
        //   title: "Hubo un error",
        //   text: "El servicio de impresión no se encuentra disponible",
        //   icon: "error",
        //   confirmButtonText: "Aceptar",
        //   timer: 1500,
        // });
        break;
    }
    setLoading(false);
    resetTimer();
  };

  const handlePrintContributionPassive = async () => {
    setLoading(true);
    const response: any = await printContributionPassive(user.nup);
    switch (response) {
      case 200:
        showAlert({
          title: "Impresión exitosa",
          message: "Recoja su hoja impresa",
          icon: "success",
          timer: 5000,
        });
        // Swal.fire({
        //   title: "Impresión exitosa",
        //   text: "Recoja su hoja impresa",
        //   icon: "success",
        //   confirmButtonText: "Aceptar",
        //   timer: 5000,
        // });
        break;
      case 400:
        showAlert({
          title: "No hay impresora conectada",
          message: "Contactese con soporte",
          icon: "warning",
          timer: 1500,
        });
        // Swal.fire({
        //   title: "No hay impresora conectada",
        //   text: "Contactese con soporte",
        //   icon: "warning",
        //   confirmButtonText: "Aceptar",
        //   timer: 1500,
        // });
        break;
      case 501:
        break;
      default:
        showAlert({
          title: "Hubo un error",
          message: "El servicio de impresión no se encuentra disponible",
          icon: "error",
          timer: 1500,
        });
        // Swal.fire({
        //   title: "Hubo un error",
        //   text: "El servicio de impresión no se encuentra disponible",
        //   icon: "error",
        //   confirmButtonText: "Aceptar",
        //   timer: 1500,
        // });
        break;
    }
    setLoading(false);
    resetTimer();
  };

  return (
    <Box sx={{ padding: 5 }}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4">Certificación de Aportes</Typography>
        <Stack direction="column" spacing={3}>
          <Grid item>
            {hasContributionActive && (
              <CardComponent
                procedureTitle="Certificación de Activo"
                onPressed={() => handlePrintContributionActive()}
                logo={logo}
                key="active"
              />
            )}
          </Grid>
          <Grid item>
            {hasContributionPassive && (
              <CardComponent
                procedureTitle="Certificación de Pasivo"
                onPressed={() => handlePrintContributionPassive()}
                logo={logo}
                key="pasive"
              />
            )}
          </Grid>
        </Stack>
      </Grid>
    </Box>
  );
};
