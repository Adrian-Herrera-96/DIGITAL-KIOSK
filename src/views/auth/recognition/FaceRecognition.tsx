import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react"
import * as faceapi from "face-api.js"
import { Box, Stack, Typography } from "@mui/material";
import { useCredentialStore } from "@/hooks";

const TINY_OPTIONS = {
   inputSize: 320,
   scoreThreshold: 0.5
}

let faceMatcher: any = null;

interface GroupedDescriptors {
   [key: string]: any[];
}


export const FaceRecognition = forwardRef((_, ref) => {


   const { image, changeRecognizedByFacialRecognition, ocr, changeStep, changeIdentifyUser } = useCredentialStore()

   const videoRef: any       = useRef();
   const canvasVideoRef: any = useRef();

   let intervalVideo:  NodeJS.Timeout;
   let img: any;

   useImperativeHandle(ref, () => ({
      onScanImage: () => scanPhoto(),
      onRemoveCam: () => cleanup(),
      onPlaying:   () => getLocalUserVideo(),
      action:  () => scanPhoto()
   }));

   const cleanup = useCallback(() => {
      intervalVideo && clearInterval(intervalVideo);

      if (videoRef.current) videoRef.current.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());

   }, [videoRef]);


   /* Carga de modelos */
   useEffect(() => {
      loadModels().then(async () => {
         await scanFace();
         await getLocalUserVideo();
      }).catch(() => console.error("No se cargaron los modelos"))
   }, [])

   const loadModels = async () => {
      const uri = "/models";
      await Promise.all([
         faceapi.nets.tinyFaceDetector.loadFromUri(uri),
         faceapi.nets.ssdMobilenetv1.loadFromUri(uri),
         faceapi.nets.faceLandmark68Net.loadFromUri(uri),
         faceapi.nets.faceRecognitionNet.loadFromUri(uri),
      ]);
   }

   const getLocalUserVideo = async () => {
      try {
         // const environmentStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } });
         // webcamRef?.current && (webcamRef.current.srcObject = environmentStream);
         // const userStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } });
         // videoRef?.current && (videoRef.current.srcObject = userStream);

         const streams = await getAllCameras();
         // webcamRef?.current && (webcamRef.current.srcObject = streams[1])
         videoRef?.current && (videoRef.current.srcObject = streams[0])
      } catch (error) {
         console.error("Error:", error);
      }
   };

   const getAllCameras = async () => {
      try {
         const devices = await navigator.mediaDevices.enumerateDevices()
         const videoDevices = devices.filter(device => device.kind === 'videoinput')

         const streams = await Promise.all(videoDevices.map(async device => {
            try {
               return await navigator.mediaDevices.getUserMedia({
                  audio: false,
                  video: {
                     deviceId: { exact: device.deviceId }
                  }
               })
            } catch (error) {
               console.error(`Error al acceder a la cámara ${device.label}`)
               return null
            }
         }))
         return streams.filter(stream => stream !== null)
      } catch (error) {
         console.error("Error al enumerar dispositivos", error)
         return []
      }
   }

   const isFaceDetectionModelLoad = () => !!faceapi.nets.tinyFaceDetector.params;

   const groupDescriptorsByName = (faceDescriptors: any) =>
      faceDescriptors.reduce((groupedDescriptors: GroupedDescriptors, { descriptor }: { descriptor: any }, index: number) => {
         const name = `persona ${index}`;
         groupedDescriptors[name] = [...(groupedDescriptors[name] || []), descriptor];
         return groupedDescriptors;
      }, {});

   const scanFace = async () => { // video
      if (!isFaceDetectionModelLoad()) return;

      const options = new faceapi.TinyFaceDetectorOptions(TINY_OPTIONS);

      intervalVideo = setInterval(async () => {
         const detections = await faceapi.detectAllFaces(videoRef.current, options)
            .withFaceLandmarks()
            .withFaceDescriptors();

         const groupedDescriptors = groupDescriptorsByName(detections);
         const labeledDescriptors = Object.keys(groupedDescriptors).map(
            (name) => new faceapi.LabeledFaceDescriptors(name, groupedDescriptors[name])
         );

         if (labeledDescriptors.length > 0) {
            faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
            if (videoRef.current != null) {
               const dims = faceapi.matchDimensions(canvasVideoRef.current, videoRef.current, true);
               const resizedDetections = faceapi.resizeResults(detections, dims);
               resizedDetections.forEach(({ detection, descriptor }) => {
                  const label = faceMatcher.findBestMatch(descriptor).toString();
                  const boxStyle = {
                     label,
                     lineWidth: 2,
                     boxColor: "green",
                     drawLabel: true,
                  };
                  new faceapi.draw.DrawBox(detection.box, boxStyle).draw(canvasVideoRef.current);
               });
               faceapi.draw.drawFaceLandmarks(canvasVideoRef.current, resizedDetections);
            }
         } else {
            if (canvasVideoRef.current != null) {
               const ctx = canvasVideoRef.current.getContext('2d');
               ctx.clearRect(0, 0, canvasVideoRef.current.width, canvasVideoRef.current.height);
            }
         }
      }, 60);
   };

   const scanPhoto = async () => { // imagen
      if (!image || !isFaceDetectionModelLoad()) return;
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.6 });
      img = await faceapi.fetchImage(image);

      // creando el elemento
      const canvas = document.createElement('canvas')

      img.onload = () => {
         const width = img.width
         const height = img.height
         canvas.width = width
         canvas.height = height
      }

      const detections = await faceapi.detectAllFaces(img, options)
         .withFaceLandmarks()
         .withFaceDescriptors();

      if (detections.length === 0) { return; }

      if (!canvas && !img) { return; }

      faceapi.matchDimensions(canvas, img);
      const resizeResults = faceapi.resizeResults(detections, img);

      if (resizeResults.length === 0) { return; }

      resizeResults.forEach(({ detection, descriptor }) => {
         if(faceMatcher) {
            let label = faceMatcher.findBestMatch(descriptor).toString();
            let options = null;
            if (!label.includes('unknown')) {
               label = `Persona encontrada`;
               options = { label, boxColor: 'green' };
               changeRecognizedByFacialRecognition(true)
               if(ocr) {
                  // enviar al backend para registrar el tipo de reconocimiento
                  // si entro a este punto, es por que ocr = true y reconocimiento = true
                  // dej pasar
               }
               // deja pasar
               changeIdentifyUser(true)
               console.log("encuentra a la persona")
               changeStep('home')
               cleanup()
            } else {
               label = `Persona no encontrada`;
               options = { label };
               console.log("no encuentra la persona")
               if(ocr) {
                  // enviar al backend para registrar el tipo de reconocimiento
                  // si entro a este punto, es por que ocr = true y reconocimiento = false
                  // igual se lo deja pasar
                  changeIdentifyUser(true)
                  changeStep('home')
                  cleanup()
               }
            }
            new faceapi.draw.DrawBox(detection.box, options).draw(canvas);
         }
      });
      faceapi.draw.drawFaceLandmarks(canvas, resizeResults);
   }

   return (
      <Box sx={{
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         height: '70vh'
      }}
      >
         <Stack spacing={2} >
            <Typography style={{ fontSize: '2vw' }} align="center">
               Reconocimiento Facial
            </Typography>
            <Stack >
               <video
                  muted
                  autoPlay
                  ref={videoRef}
                  style={{
                     objectFit: "fill",
                     borderRadius: '30px',
                     backgroundColor: '#fff',
                     padding: '10px',
                     width: '40vw',
                     height: '30vw'
                  }}
               />
               <canvas
                  ref={canvasVideoRef}
                  style={{
                     position: "absolute",
                     pointerEvents: "none",
                     padding: '10px',
                     width: '40vw',
                     height: '30vw'
                  }}
               />
            </Stack>
         </Stack>
      </Box>
   );
});
