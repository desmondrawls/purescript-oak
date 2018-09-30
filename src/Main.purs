module Main (main) where

import Prelude
import Data.Array ( filter, (..) )
import Data.Tuple
import Data.List as List
import Data.Int ( floor )
import Math

import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Oak.Cmd.Random (RANDOM, generate)

import Oak
import Oak.Html ( Html, div, svg, circle, text )
import Oak.Html.Events
import Oak.Html.Attribute ( style, cx, cy, r, fill, height, width, id_ )
import Oak.Document
import Oak.Cmd
import Oak.Css ( backgroundColor )
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
        , div [] [ text ("The quantity: " <> (show $ calc model.randomness)) ]
        , svg [ style [backgroundColor "blue"], height 600, width 1200, onClick GetRandom ] 
              (manyCircles model.randomness)
        ]

calc :: Number -> Int
calc randomness =
 floor $ randomness * 100.0

fits :: Int -> Int -> (Tuple Int Int) -> Boolean
fits radius padding (Tuple x y) =
  y `mod` space == 0 && x `mod` space == 0
    where
      space = 2 * (radius + padding)

spots :: Int -> Int -> Int -> Int -> Array (Tuple Int Int)
spots height width radius padding = filter (fits radius padding) $ do
  y <- 1 .. height
  x <- 1 .. width
  pure (Tuple x y)    

manyCircles :: Number -> Array (Html Msg)
manyCircles randomness =
    map circleView $ centers $ calc randomness

circleView :: (Tuple Int Int) -> Html Msg
circleView (Tuple x y) =
    circle [ cx (x - 30), cy (y - 20), r "40", fill "red" ] []

centers :: Int -> Array (Tuple Int Int)
centers randomness =
   spots 600 1200 40 5

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
