declare global {
  interface Window {
    OnBoarding: any;
  }
}
// pages.tsx
import Script from "next/script";

export default function Page() {
  return (
    <>
      <Script
        id="incode-sdk"
        src="https://sdk.incode.com/sdk/onBoarding-1.70.0.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
