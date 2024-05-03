"use client";
import "./ui/global.css";
import { useRef, useEffect } from "react";

let incode;
let session;

// SOLO PARA MUESTRA
// LOS VALORES DE CONFIGURACIÓN DEBEN MANEJARSE COMO VARIABLES DE ENTORNO
const apiURL: string = "https://demo-api.incodesmile.com/0";
const apiKey: string = ""; //API Key provisto por Incode
const configurationId: string = ""; //ID del flujo configurado en el dashboard de Incode

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);
  const incodeContainer = useRef(null);

  //SOLO PARA MUESTRA
  //LA SESION SE DEBE CREAR EN EL BACKEND
  function getSessionFromBackend() {
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-version", "1.0");
    myHeaders.append("x-api-key", apiKey);

    let raw = JSON.stringify({
      countryCode: "ALL",
      configurationId: configurationId, // LOS VALORES DE CONFIGURACIÓN DEBEN MANEJARSE COMO VARIABLES DE ENTORNO
    });

    return fetch(`${apiURL}/omni/start`, {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    })
      .then((omniStartResponse) => omniStartResponse.json())
      .then((sessionObject) => sessionObject)
      .catch((error) => console.log("error", error));
  }

  function captureIdFrontSide() {
    incode.renderCamera("front", incodeContainer.current, {
      onSuccess: captureIdBackSide,
      onError: console.log,
      numberOfTries: 3,
      token: session,
    });
  }

  function captureIdBackSide() {
    incode.renderCamera("back", incodeContainer.current, {
      onSuccess: processId,
      onError: console.log,
      numberOfTries: 3,
      token: session,
    });
  }

  function processId() {
    incode.processId({ token: session.token }).then(() => {
      captureSelfie();
    });
  }

  function captureSelfie() {
    incode.renderCamera("selfie", incodeContainer.current, {
      onSuccess: console.log,
      onError: console.log,
      numberOfTries: 3,
      token: session,
    });
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      incode = window.OnBoarding.create({
        apiURL:apiURL,
      });
      getSessionFromBackend().then((response) => {
        if (window !== undefined) {
          session = response;
          captureIdFrontSide();
        }
      });
    }
  });

  return (
    <html lang="en">
      <body>
        {children}
        <div ref={incodeContainer}></div>
      </body>
    </html>
  );
}
