module Quantities (quantities) where

import Prelude
import Data.Tuple
import Data.Maybe
import Data.Array

quantities :: 
  forall e. { size :: Int, padding :: Int, limit :: Int, randomness :: Int | e } 
    -> Array (Tuple Int Int) 
    -> Array (Tuple Int Int)
quantities { size, padding, limit, randomness } domain =
    take quantity $ shuffle randomness $ filter (fits size padding) domain
    where
      quantity = randomness `mod` limit

fits :: Int -> Int -> (Tuple Int Int) -> Boolean
fits size padding (Tuple x y) =
  y `mod` space == 0 && x `mod` space == 0
    where
      space = 2 * (size + padding)

shuffle :: Int -> Array (Tuple Int Int) -> Array (Tuple Int Int)
shuffle 0 deck = deck
shuffle rounds deck =
    shuffle (rounds - 1) $ concat subdecks
    where
      subdecks = do
        i <- 1 .. (length deck / 2)
        pure $ oddPair i deck (Tuple 100 100)

oddPair :: forall a. Int -> Array a -> a -> Array a
oddPair i arr backup =
    [(index (n - i)), (index (i - 1))]
    where
      n = length arr
      index at = maybe backup id (arr !! at) 

