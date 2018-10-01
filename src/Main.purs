module Main (main) where

import Prelude
import Control.Alt
import Data.Array ( take, (!!), concat, length, filter, (..) )
import Data.Tuple
import Data.Maybe
import Data.List as List
import Data.Int ( floor )
import Math

import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Oak.Cmd.Random (RANDOM, generate)

import Oak
import Oak.Html ( Html, div, svg, circle, rect, text )
import Oak.Html.Events
import Oak.Html.Attribute ( id_, key_, style, cx, cy, r, fill, x, y, height, width, id_ )
import Oak.Document
import Oak.Cmd
import Oak.Css ( backgroundColor )
import Oak.Cmd.Http (get)
import Quantities (quantities)

type Model =
  { randomness :: Int,
    height :: Int,
    width :: Int,
    size :: Int,
    padding :: Int,
    limit :: Int
  }

data Msg
  = GetRandom
  | GotRandom Number

next :: forall c. Msg -> Model -> Cmd (random :: RANDOM | c) Msg
next GetRandom _ =
  generate GotRandom
next _ _ = none

update :: Msg -> Model -> Model
update (GotRandom n) model =
  model { randomness = factor n }
update msg model =
  model

init :: Unit -> Model
init _ =
  { randomness: 50,
    height: 700,
    width: 1400,
    size: 40,
    padding: 15,
    limit: 10
  }
  
view :: Model -> Html Msg
view model =
    div [] 
        [ div [] [ text "The laws of physics are only patterns, beginning with quantities." ]
        , div [] [ text ("The quantity: " <> (show $ length shapes)) ]
        , svg [ id_ ("svg-" <> show model.randomness), key_ ("svg-" <> show model.randomness), style [backgroundColor "blue"], height model.height, width model.width, onClick GetRandom ] 
          shapes
        ]
        where
          shapes = 
              (manyShapes model)

factor :: Number -> Int
factor randomness =
 floor $ randomness * 100.0

manyShapes :: Model -> Array (Html Msg)
manyShapes model =
    map (shapeView model.randomness model.size) $ centers model

centers :: Model -> Array (Tuple Int Int)
centers model =
   quantities model.size model.padding model.limit model.randomness $ spots model.height model.width 

spots :: Int -> Int -> Array (Tuple Int Int)
spots height width = do
  y <- 1 .. height
  x <- 1 .. width
  pure (Tuple x y)    

shapeView :: Int -> Int -> (Tuple Int Int) -> Html Msg
shapeView randomness size | randomness `mod` 2 == 0 = circleView randomness size
                          | otherwise               = squareView randomness size

positionAdjustment :: Int
positionAdjustment = 40

color :: String
color = "red"

circleView :: Int -> Int -> (Tuple Int Int) -> Html Msg
circleView randomness size (Tuple center_x center_y) =
    circle [ key_ key, cx (center_x - positionAdjustment), cy (center_y - positionAdjustment), r (show size), fill color ] []
    where
      key = "circle-" <> show randomness

squareView :: Int -> Int -> (Tuple Int Int) -> Html Msg
squareView randomness size (Tuple center_x center_y) =
    rect [ key_ key, x (center_x - positionAdjustment), y (center_y - positionAdjustment), width dimension, height dimension, fill color ] []
    where
      dimension = show $ size + 20
      key = "square-" <> show randomness

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
