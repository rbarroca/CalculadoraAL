import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import App from './App.tsx';

export function render(url: string): { html: string; helmetContext: FilledContext } {
  const helmetContext = {} as FilledContext;

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  return { html, helmetContext };
}
