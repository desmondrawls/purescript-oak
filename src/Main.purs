module Main (main) where

import Prelude
import Control.Alt
import Data.Array ( take, (!!), concat, length, filter, (..) )
import Data.Tuple
import Data.Maybe
import Data.Either
import Data.List as List
import Data.Int ( floor )
import Math

import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Oak.Cmd.Random (RANDOM, generate)
import Oak.Cmd.Http (HTTP, get, post)
import Oak.Cmd.Http.Conversion (defaultDecode, defaultEncode)

import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Foreign.Class (class Decode, class Encode)

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
    limit :: Int,
    centers :: Centers,
    error :: String
  }

data TransportModel = TransportModel { size :: Int, padding :: Int, limit :: Int, randomness :: Int, centers :: Centers }

instance showTransportModel :: Show TransportModel where 
  show = genericShow

derive instance genericTransportModel :: Generic TransportModel _

instance encodeTransportModel :: Encode TransportModel where
  encode = defaultEncode

data Center = Center { center_x :: Int, center_y :: Int }

instance showCenter :: Show Center where 
  show = genericShow

derive instance genericCenter :: Generic Center _

instance decodeCenter :: Decode Center where
  decode = defaultDecode

instance encodeCenter :: Encode Center where
  encode = defaultEncode

data Centers = Centers (Array Center)

instance showCenters :: Show Centers where 
  show = genericShow

derive instance genericCenters :: Generic Centers _

instance decodeCenters :: Decode Centers where
  decode = defaultDecode

instance encodeCenters :: Encode Centers where
  encode = defaultEncode

data Msg
  = GetRandom
  | GetCenters Number
  | GotCenters Int (Either String Centers)

next :: forall c. Msg -> Model -> Cmd (http :: HTTP, random :: RANDOM | c) Msg
next GetRandom _ =
  generate GetCenters
next (GetCenters randomness) model
    = post url body $ GotCenters rando
  where
    url = "http://localhost:8082/http://localhost:8080/"
    body = (TransportModel { size: model.size, padding: model.padding, limit: model.limit, randomness: model.randomness, centers: domain })
    rando = factor randomness
    domain = (Centers $ spots model.height model.width)
next _ _ = none

update :: Msg -> Model -> Model
update (GotCenters randomness (Right centers)) model =
  model { randomness = randomness, centers = centers }
update (GotCenters randomness (Left error)) model =
  model { randomness = randomness, error = error }
update msg model =
  model

init :: Unit -> Model
init _ =
  { randomness: 50,
    height: 70,
    width: 140,
    size: 4,
    padding: 1,
    limit: 10,
    centers: (Centers []),
    error: ""
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
manyShapes { randomness, size, centers: (Centers cents) } =
    map (shapeView randomness size) cents

spots :: Int -> Int -> Array Center
spots x y = do
  center_x <- 1 .. 20
  center_y <- 1 .. 20
  pure $ (Center {center_x, center_y})

shapeView :: Int -> Int -> Center -> Html Msg
shapeView randomness size | randomness `mod` 2 == 0 = circleView randomness size
                          | otherwise               = squareView randomness size

positionAdjustment :: Int
positionAdjustment = 40

color :: String
color = "red"

circleView :: Int -> Int -> Center -> Html Msg
circleView randomness size (Center { center_x, center_y }) =
    circle [ key_ key, cx (center_x - positionAdjustment), cy (center_y - positionAdjustment), r (show size), fill color ] []
    where
      key = "circle-" <> show randomness

squareView :: Int -> Int -> Center -> Html Msg
squareView randomness size (Center { center_x, center_y }) =
    rect [ key_ key, x (center_x - positionAdjustment), y (center_y - positionAdjustment), width dimension, height dimension, fill color ] []
    where
      dimension = show $ size + 20
      key = "square-" <> show randomness

app :: App (http :: HTTP, random :: RANDOM) Model Msg Unit
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
