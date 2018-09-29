module Main (main) where

import Prelude
import Data.Array
import Data.Tuple
import Data.List

import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Control.Monad.Eff.Random (RANDOM, randomInt)

import Oak
import Oak.Html ( Html, div, svg, circle, text )
import Oak.Html.Events
import Oak.Html.Attribute ( cx, cy, r, fill, height, width, id_ )
import Oak.Document
import Oak.Cmd
import Oak.Cmd.Http (get)

type BraidedQuantity =
    { quantity :: Int
    , braids :: Int
    }

type Model =
  { braidedQuantity :: BraidedQuantity
  }


data Msg
  = PickRandomQuantity
  | RandomResult BraidedQuantity


quantityGenerator :: Gen BraidedQuantity
quantityGenerator =
    do
      x <- randomInt 1 20
      y <- randomInt 1 100
      pure $ { quantity: x, braids: y }
    


view :: Model -> Html Msg
view model =
    div [] 
        [ div [] [ text "The laws of physics are only patterns, beginning with quantities." ]
        , div [] [ text "The quantity: " <> model.quantity ]
        , svg [ height 600, width 1200, onClick PickRandomQuantity ] 
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
next PickRandomQuantity model =
  RandomResult quantityGenerator
next _ _ = none

update :: Msg -> Model -> Model
update (RandomResult braid) model =
  model { quantity = braid.quantity }
update msg model =
  model


init :: Unit -> Model
init _ =
  { number: 0
  }

app :: App () Model Msg Unit
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
