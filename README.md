Oak is an implementation of the Elm architecture in Purescript.

```purescript
module Main (main) where

import Prelude
  ( (+)
  , (-)
  , Unit
  , bind
  )

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception (EXCEPTION)
import Data.Tuple
import Data.Either

import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Foreign.Class (class Encode, class Decode, encode, decode)
import Data.Foreign.Generic (defaultOptions, genericDecode, genericDecodeJSON, genericEncodeJSON)

import Oak
  ( runApp
  , createApp
  , App
  )
import Oak.Html
  ( Html
  , button
  , div
  , text
  , p
  )
import Oak.Html.Events
  ( onClick
  , onInput
  )
import Oak.Document
  ( getElementById
  , appendChildNode
  , DOM
  )

import Oak.Cmd

data User =
  User
    { name :: String
    , id :: Int
    }

derive instance genericUser :: Generic User _

instance decodeUser :: Decode User where
  decode user = genericDecode opts user

opts = defaultOptions { unwrapSingleConstructors = true }


type Model =
  { response :: String
  , pending :: Boolean
  , user :: User
  }

data Msg
  = Go
  | SetUser (Either String User)

showUser :: User -> Html Msg
showUser (User { id, name }) =
  div []
    [ text id
    , text " "
    , text name
    ]

view :: Model -> Html Msg
view model =
  div []
    [ p [] [ text model.response ]
    , p [] [ text "request pending: ", text model.pending ]
    , p [] [ showUser model.user ]
    , button [ onClick Go ] [ text "request" ]
    ]


update :: Msg -> Model -> Tuple Model (Cmd (http :: HTTP) Msg)
update Go model =
  Tuple
    (model { pending = true } )
    (get "http://localhost:3000/users/1" SetUser)
update (SetUser (Left err)) model =
  Tuple
    (model { response = err, pending = false } )
    none
update (SetUser (Right user)) model =
  Tuple
    (model { user = user, response = "success", pending = false } )
    none


init :: Model
init =
  { response: "pending"
  , pending: false
  , user: User { name: "", id: 0 }
  }

app :: App (http :: HTTP) Model Msg
app = createApp
  { init: init
  , view: view
  , update: update
  }

main :: Eff (exception :: EXCEPTION, dom :: DOM) Unit
main = do
  rootNode <- runApp app
  container <- getElementById "app"
  appendChildNode container rootNode
```
