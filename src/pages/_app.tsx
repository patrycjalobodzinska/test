import { ToastProvider } from "@/components/ui/ToastsContext";
import "@/styles/globals.css";
import { NextPageWithLayout } from "@/ui/Layout/NextPageWithLayout";

import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const montserrat = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } })
  );

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={montserrat.className}>
        <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
