import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import App from './App.tsx';

type HelmetContext = { helmet: HelmetServerState };

export function render(url: string): { html: string; helmetContext: HelmetContext } {
  const helmetContext = {} as HelmetContext;

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  return { html, helmetContext };
}
