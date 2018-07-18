module Main (main) where

import Prelude (class Show, Unit, bind, show, (<>))

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception
import Data.Either (Either(..))

import Oak (App, createApp, runApp)
import Oak.Html ( Html, div, text, button )
import Oak.Html.Events (onClick)
import Oak.Document (DOM, appendChildNode, getElementById)
import Oak.Cmd (Cmd, none)
import Oak.Cmd.Http (HTTP, defaultDecode, get)

import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Foreign.Class (class Decode)


data User 
  = User { name :: String, id :: Int}
  
instance showUser :: Show User where 
  show = genericShow

derive instance genericUser :: Generic User _

instance decodeUser :: Decode User where
  decode = defaultDecode

data Msg 
  = GetUser 
  | GotUser (Either String User)

type Model = 
  { user :: User }
  
update :: Msg -> Model -> Model
update (GotUser (Right user)) model = model { user = user }
update (GotUser (Left message)) model = model { user = User { name: message, id: 0 } }
update msg model 
  = model

next :: forall c. Msg -> Model -> Cmd (http :: HTTP | c) Msg
next GetUser _
  = get "https://jsonplaceholder.typicode.com/users/1" GotUser
next _ _ 
  = none

init :: Model
init = 
  { user: (User { name: "no name", id: 0 }) }

view :: Model -> Html Msg
view model 
  = div [] [ text "HTTP practice app" 
           , button [ onClick GetUser ] [ text "make some http" ]
           , div [] [ text ("The current user is " <> show model.user) ]
           ]

app :: App (http :: HTTP) Model Msg
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
