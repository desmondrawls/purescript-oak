module Models where

import Prelude
import Oak.Cmd.Http.Conversion (defaultDecode, defaultEncode)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Foreign.Class (class Encode, class Decode, encode, decode)
import Data.Foreign.Generic (defaultOptions, genericDecode, genericEncode)
import Data.Eq

newtype TransportModel = TransportModel { size :: Int, padding :: Int, limit :: Int, randomness :: Int, centers :: Centers }

instance showTransportModel :: Show TransportModel where 
  show = genericShow

derive instance genericTransportModel :: Generic TransportModel _

instance encodeTransportModel :: Encode TransportModel where
  encode = genericEncode $ defaultOptions {unwrapSingleConstructors = true}

newtype Center = Center { center_x :: Int, center_y :: Int }

instance equateCenter :: Eq Center where 
  eq (Center {center_x: x, center_y: y}) (Center {center_x: x2, center_y: y2}) = x == x2 && y == y2 

instance showCenter :: Show Center where 
  show = genericShow

derive instance genericCenter :: Generic Center _

instance decodeCenter :: Decode Center where
  decode = genericDecode $ defaultOptions {unwrapSingleConstructors = true}

instance encodeCenter :: Encode Center where
  encode = genericEncode $ defaultOptions {unwrapSingleConstructors = true}

newtype Centers = Centers (Array Center)

instance showCenters :: Show Centers where 
  show = genericShow

derive instance genericCenters :: Generic Centers _

instance decodeCenters :: Decode Centers where
  decode = genericDecode $ defaultOptions {unwrapSingleConstructors = true}

instance encodeCenters :: Encode Centers where
  encode = genericEncode $ defaultOptions {unwrapSingleConstructors = true}
