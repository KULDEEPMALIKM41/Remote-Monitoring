import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
// import { Auth0Provider } from "./authServices/auth0/auth0Service"
// import config from "./authServices/auth0/auth0Config.json"
import { IntlProviderWrapper } from "./Layout/Internationalization"
import { Layout } from "./Layout/Layout"
import * as serviceWorker from "./serviceWorker"
import { store } from "./redux/storeConfig/store"
import Spinner from "./ToolKit/spinner/Fallback-spinner"
import "./index.scss"
import "./@fake-db"

const LazyApp = lazy(() => import("./App"))

// configureDatabase()

ReactDOM.render(
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <Layout>
          <IntlProviderWrapper>
            <LazyApp />
          </IntlProviderWrapper>
        </Layout>
      </Suspense>
    </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
