import { Meta, Links, Scripts, LiveReload } from "remix"
import { Outlet } from "react-router-dom"

const Document = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

const App = () => {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <Document>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>Replace this UI with what you want users to see when your app throws uncaught errors.</p>
    </Document>
  )
}

export default App
export { ErrorBoundary }
