Oak is an implementation of the Elm architecture in Purescript.

```
bower install purescript-oak
```

This library requires the `virtual-dom` module. You can get it by using npm to install virtual-dom.

```
npm install virtual-dom
```

Documentation is published on [pursuit](https://pursuit.purescript.org/packages/purescript-oak/).


A breif example Oak app:

```purescript
module Main (main) where

import Prelude

import Control.Monad.Eff
import Control.Monad.Eff.Exception

import Oak
import Oak.Html ( Html, div, text, button )
import Oak.Html.Events
import Oak.Document
import Oak.Cmd


type Model =
  { number :: Int
  }


data Msg
  = Inc
  | Dec


view :: Model -> Html Msg
view model =
  div []
    [ button [ onClick Inc ] [ text "+" ]
    , div [] [ text model.number ]
    , button [ onClick Dec ] [ text "-" ]
    ]


next :: Msg -> Model -> Cmd () Msg
next _ _ = none

update :: Msg -> Model -> Model
update Inc model =
  model { number = model.number + 1 }
update Dec model =
  model { number = model.number - 1 }


init :: Model
init =
  { number: 0
  }

app :: App () Model Msg
app = createApp
  { init: init
  , view: view
  , update: update
  , next: next
  }

main :: Eff (exception :: EXCEPTION, dom :: DOM) Unit
main = do
  rootNode <- runApp app
  container <- getElementById "app"
  appendChildNode container rootNode
```
