module Quantities (quantities) where

import Prelude
import Data.Tuple
import Data.Maybe
import Data.Array

fits :: Int -> Int -> (Tuple Int Int) -> Boolean
fits radius padding (Tuple x y) =
  y `mod` space == 0 && x `mod` space == 0
    where
      space = 2 * (radius + padding)

oddPair :: forall a. Int -> Array a -> a -> Array a
oddPair i arr backup =
    [(index (n - i)), (index (i - 1))]
    where
      n = length arr
      index at = maybe backup id (arr !! at) 


shuffle :: Int -> Array (Tuple Int Int) -> Array (Tuple Int Int)
shuffle 0 deck = deck
shuffle rounds deck =
    shuffle (rounds - 1) $ concat subdecks
    where
      subdecks = do
        i <- 1 .. (length deck / 2)
        pure $ oddPair i deck (Tuple 100 100)

quantities :: Int -> Int -> Int -> Int -> Array (Tuple Int Int) -> Array (Tuple Int Int)
quantities radius padding limit randomness domain =
    take quantity $ shuffle randomness $ filter (fits radius padding) domain
    where
      quantity = randomness `mod` limit
