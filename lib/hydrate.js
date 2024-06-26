import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { createFromFetch, encodeReply } from 'react-server-dom-webpack/client'

let updateRoot

async function callServer(id, args) {
  const response = fetch('/', {
    method: 'POST',
    headers: {
      Accept: 'text/x-component',
      'rsc-action': id,
    },
    body: await encodeReply(args),
  })
  const { returnValue, root } = await createFromFetch(response, { callServer })

  // Refresh the tree with the new RSC payload.
  React.startTransition(() => {
    updateRoot(root)
  })
  return returnValue
}

function Shell({ data }) {
  const [root, setRoot] = React.useState(data)
  updateRoot = setRoot
  return root
}

async function hydrate() {
  /**
   * When hydrating, request the RSC payload from the server.
   * Once received, render the <Shell />.
   */
  const { root, returnValue, formState } = await createFromFetch(
    fetch('/payload', {
      headers: {
        Accept: 'text/x-component',
      },
    }),
    {
      /**
       * @note This is never called. Like ever.
       */
      callServer,
    },
  )

  const domRoot = ReactDOM.createRoot(document.getElementById('root'))
  domRoot.render(React.createElement(Shell, { data: root }))
}

hydrate()
