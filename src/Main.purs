module Main (main) where

import Prelude
import Data.Array
import Data.Tuple
import Data.List

import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Oak.Cmd.Random (RANDOM, generate)

import Oak
import Oak.Html ( Html, div, svg, circle, text )
import Oak.Html.Events
import Oak.Html.Attribute ( cx, cy, r, fill, height, width, id_ )
import Oak.Document
import Oak.Cmd
import Oak.Cmd.Http (get)

type Model =
  { randomness :: Number
  }

data Msg
  = GetRandom
  | GotRandom Number

view :: Model -> Html Msg
view model =
    div [] 
        [ div [] [ text "The laws of physics are only patterns, beginning with quantities." ]
        , div [] [ text ("The quantity: " <> show model.randomness) ]
        , svg [ height 600, width 1200, onClick GetRandom ] 
              manyCircles
        ]

manyCircles :: Array (Html Msg)
manyCircles =
    map circleView centers

circleView :: (Tuple Int Int) -> Html Msg
circleView (Tuple x y) =
    circle [ cx x, cy y, r "40", fill "red" ] []

centers :: Array (Tuple Int Int)
centers =
   [Tuple 200 100, Tuple 400 30, Tuple 150 500]

next :: forall c. Msg -> Model -> Cmd (random :: RANDOM | c) Msg
next GetRandom _ =
  generate GotRandom
next _ _ = none

update :: Msg -> Model -> Model
update (GotRandom n) model =
  model { randomness = n }
update msg model =
  model { randomness = 1.3 }

init :: Unit -> Model
init _ =
  { randomness: 0.5
  }

app :: App (random :: RANDOM) Model Msg Unit
app = createApp
  { init: init
  , view: view
  , update: update
  , next: next
  }

main :: Eff (exception :: EXCEPTION, dom :: DOM) Unit
main = do
  rootNode <- runApp app unit
  container <- getElementById "app"
  appendChildNode container rootNode
