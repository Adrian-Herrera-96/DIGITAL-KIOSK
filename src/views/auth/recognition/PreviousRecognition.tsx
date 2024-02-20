import { getEnvVariables } from "@/helpers"
import { useCredentialStore } from "@/hooks"
import { Grid, Typography } from "@mui/material"
import { forwardRef, useImperativeHandle } from "react"

export const PreviousRecognition = forwardRef((_, ref) => {

   const { ACTIVITY_TIME } = getEnvVariables()
   const { changeStep, changeTimer } = useCredentialStore()

   useImperativeHandle(ref, () => ({
      action: () => {
         changeStep('faceRecognition')
         changeTimer(ACTIVITY_TIME)
      }
   }))

   return (
      <Grid
         container
         justifyContent="center"
         alignItems="center"
         style={{ height: '65vh' }}
      >
         <Grid item container sm={6} direction="column">
            <Typography style={{ fontSize: '3.5vw' }} align="center">
               Por favor recoja su carnet de identidad de la bandeja
            </Typography>
         </Grid>
      </Grid>
   )
})

