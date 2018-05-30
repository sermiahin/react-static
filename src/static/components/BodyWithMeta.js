import React from 'react'
import jsesc from 'jsesc'

const REGEX_FOR_SCRIPT = /<(\/)?(script)/gi

const generateRouteInformation = embeddedRouteInfo => ({
  __html: `
    window.__routeInfo = ${jsesc(embeddedRouteInfo, {
    es6: false,
    isScriptContext: true,
  }).replace(REGEX_FOR_SCRIPT, '<"+"$1$2')};`,
})

// Not only do we pass react-helmet attributes and the app.js here, but
// we also need to  hard code site props and route props into the page to
// prevent flashing when react mounts onto the HTML.
export const makeBodyWithMeta = ({
  head,
  route,
  // This embeddedRouteInfo will be inlined into the HTML for this route.
  // It should only include the full props, not the partials.
  embeddedRouteInfo,
  clientScripts = [],
  ClientCssHash,
  config,
}) => ({ children, ...rest }) => (
  <body {...head.bodyProps} {...rest}>
    {children}
    <ClientCssHash />
    {!route.redirect && (
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={generateRouteInformation(embeddedRouteInfo)}
      />
    )}
    {!route.redirect &&
      clientScripts.map(script => (
        <script
          key={script}
          defer
          type="text/javascript"
          src={`${config.publicPath}${script}`}
        />
      ))}
  </body>
)