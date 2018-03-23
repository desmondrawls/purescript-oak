module Oak where

import Prelude
  ( Unit
  , bind
  , pure
  )
import Control.Monad.Eff
  ( Eff
  , kind Effect
  )
import Control.Monad.ST
  ( ST
  , STRef
  , newSTRef
  , readSTRef
  , runST
  , writeSTRef
  )
import Partial.Unsafe (unsafePartial)
import Data.Maybe
  ( Maybe(..)
  , fromJust
  )

import Oak.Html (Html)
import Oak.VirtualDom
  ( patch
  , render
  )
import Oak.VirtualDom.Native as N

data App model msg = App
  { model :: model
  , update :: msg -> model -> model
  , view :: model -> Html msg
  }

createApp :: ∀ msg model.
  { init :: model
  , update :: msg -> model -> model
  , view :: model -> Html msg
  } -> App model msg
createApp opts = App
  { model: opts.init
  , view: opts.view
  , update: opts.update
  }

type Runtime =
  { tree :: Maybe N.Tree
  , root :: Maybe N.Node
  }

handler :: ∀ msg model eff h.
  STRef h Runtime
    -> App model msg
    -> msg
    -> Eff ( dom :: N.DOM, st :: ST h | eff ) Runtime
handler ref app msg = do
  env <- readSTRef ref
  let (App app) = app
  let oldTree = unsafePartial (fromJust env.tree)
  let root = unsafePartial (fromJust env.root)
  let newModel = app.update msg app.model
  let newAttrs = app { model = newModel }
  let newApp = App newAttrs
  newTree <- render (handler ref newApp) (app.view newModel)
  newRoot <- patch newTree oldTree env.root
  let newRuntime =
        { root: Just newRoot
        , tree: Just newTree
        }
  writeSTRef ref newRuntime

runApp_ :: ∀ e h model msg.
  App model msg
    -> Eff ( st :: ST h, dom :: N.DOM | e) N.Node
runApp_ (App app) = do
  ref <- newSTRef { tree: Nothing, root: Nothing }
  tree <- render (handler ref (App app)) (app.view app.model)
  rootNode <- finalizeRootNode (N.createRootNode tree)
  _ <- writeSTRef ref { tree: Just tree, root: Just rootNode }
  pure rootNode


foreign import finalizeRootNode :: ∀ r.
  Eff (createRootNode :: N.NODE | r) N.Node
    -> Eff r N.Node

runApp :: ∀ e model msg.
  App model msg -> Eff (dom :: N.DOM | e) N.Node
runApp app = do
  runST (runApp_ app)

foreign import embedImpl :: ∀ e.
  String
    -> N.Node
    -> Eff (dom :: N.DOM | e) Unit

embed :: ∀ msg model e.
  String
    -> App model msg
    -> Eff (dom :: N.DOM | e) Unit
embed id_ app = do
  rootNode <- runApp app
  embedImpl id_ rootNode
