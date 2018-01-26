module Oak
  ( createApp
  , HTML
  , App
  , text
  , div
  , runApp
  , render
  , renderHTML
  , DOM
  , RootNode
  ) where


import Prelude
  ( bind
  , map
  )

import Control.Monad (class Monad, ap)
import Control.Bind (class Bind)
import Control.Apply (class Apply)
import Control.Applicative (class Applicative, liftA1)
import Data.Functor (class Functor)

-- main : Program Never number Msg
-- bind :: forall a b. m a -> (a -> m b) -> m b

data App model msg = App
  { model :: model
  , update :: msg -> model -> model
  , view :: model -> HTML msg
  }


-- bind :: forall model msg.
--   App model msg ->
--   (model -> msg -> App model msg) ->
--   App model msg
-- bind app f = app

data HTML msg
  = Text String
  | Tag String (Array (HTML msg))

text :: forall msg. String -> HTML msg
text str = Text str

div :: forall msg. Array (HTML msg) -> HTML msg
div children = Tag "div" children

createApp :: forall msg model.
  { init :: model
  , update :: msg -> model -> model
  , view :: model -> HTML msg
  } -> App model msg
createApp opts = App
  { model: opts.init
  , view: opts.view
  , update: opts.update
  }

-- bind :: forall a b. m a -> (a -> m b) -> m b

foreign import data DOM :: Type -> Type
-- foreign import data Eff :: # Effect -> Type -> Type

foreign import bindD :: forall a b. DOM a -> (a -> DOM b) -> DOM b
-- foreign import bindE :: forall e a b. Eff e a -> (a -> Eff e b) -> Eff e b

instance bindDOM :: Bind DOM where
  bind = bindD

instance applyDOM :: Apply DOM where
  apply = ap

instance monadDOM :: Monad DOM

instance applicativeDOM :: Applicative DOM where
  pure = pureD

foreign import pureD :: forall a. a -> DOM a

instance functorDOM :: Functor DOM where
  map = liftA1

foreign import renderN :: forall msg. String -> Array (DOM msg) -> DOM msg
foreign import nativeText :: forall msg. String -> DOM msg

renderHTML :: forall msg. HTML msg -> DOM msg
renderHTML (Tag name children) = renderN name (map renderHTML children)
renderHTML (Text str) = nativeText str

foreign import performSideEffect :: forall msg. RootNode -> DOM msg -> DOM msg -> DOM msg

render :: forall model msg. App model msg -> RootNode -> DOM msg -> DOM msg
render (App app) node oldTree =
  let
    root = app.view app.model
    newTree = renderHTML root
  in
    performSideEffect node oldTree newTree

foreign import data RootNode :: Type

runApp :: forall model msg. App model msg -> RootNode -> DOM msg
runApp app@(App opts) rootNode = do
  msg <- render app rootNode (renderHTML (opts.view opts.model))
  runApp app rootNode
