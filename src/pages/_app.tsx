import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FluentProvider } from "@fluentui/react-provider";
import { teamsLightTheme } from "@fluentui/tokens";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <Component {...pageProps} />
    </FluentProvider>
  );
}
