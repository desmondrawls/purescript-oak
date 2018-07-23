module Oak.Cmd.Http
  ( HTTP
  , defaultDecode
  , defaultEncode
  , get
  ) where

import Prelude (show, ($), class Show)

import Control.Monad.Except (runExcept)
import Data.Generic.Rep (class Generic)
import Data.Foreign.Class (class Decode, class Encode)
import Data.Foreign.Generic (defaultOptions, genericDecode, genericDecodeJSON, genericEncode, genericEncodeJSON)
import Data.Foreign.Generic.Class (class GenericEncode, class GenericDecode)
import Data.Foreign.Generic.Types (Options)
import Data.Foreign (F, Foreign)
import Data.Traversable (foldr)
import Data.Either (Either(..))
import Data.Function.Uncurried
  ( Fn4
  , runFn4
  , Fn3
  , runFn3
  )

import Oak.Cmd

foreign import data HTTP :: Command
foreign import data NativeOptions :: Type

foreign import emptyOptions :: NativeOptions

type HttpOptions a
  = Array (HttpOption a)

data Headers
  = Array Header

data MediaType
  = ApplicationJSON
  | ApplicationXML
  | TextHTML
  | TextPlain

instance showMediaType :: Show MediaType where
  show ApplicationJSON = "application/json"
  show ApplicationXML = "application/xml"
  show TextHTML = "text/html"
  show TextPlain = "text/plain"

data Header
  = ContentType MediaType
  | Accept MediaType
  | Authorization String

data Credentials
  = CredentialsOmit
  | CredentialsSameOrigin
  | CredentialsInclude

data HttpOption a
  = POST { body :: a }
  | Headers
  | Credentials

encodeOptions :: Options
encodeOptions = defaultOptions { unwrapSingleConstructors = true }

defaultEncode ::
  ∀ a rep.
    Generic a rep
      => GenericEncode rep
      => a
      -> Foreign
defaultEncode = genericEncode encodeOptions

-- #genericEncodeJSON calls JSON.stringify, which throws an exception for
-- recursive data structures and returns undefined for functions. We can
-- assume that recursive data structures are impossible given Purescript's
-- immutability constraint. It is still possible to pass a function to
-- #genericeEncodeJSON so we should return a Maybe or Either.
-- TODO: avoid returning undefined.
makeEncoder :: ∀ a t.
  Generic a t
    => GenericEncode t
    => Encode String
    => a
    -> String
makeEncoder structured = genericEncodeJSON encodeOptions structured

decodeOptions :: Options
decodeOptions = defaultOptions { unwrapSingleConstructors = true }

defaultDecode ::
  ∀ a rep.
    Generic a rep
      => GenericDecode rep
      => Foreign
      -> F a
defaultDecode = genericDecode decodeOptions

makeDecoder :: ∀ a t.
  Generic a t
    => GenericDecode t
    => Decode a
    => String
    -> Either String a
makeDecoder json =
  case runExcept $ genericDecodeJSON decodeOptions json of
    Left err -> Left (show err)
    Right result -> Right result

foreign import getImpl :: ∀ c m a.
  Fn4
    (String -> Either String a)
    (a -> Either String a)
    String
    (Either String a -> m)
    (Cmd (http :: HTTP | c) m)

get :: ∀ c m a t.
  Generic a t
    => GenericDecode t
    => Decode a
    => String
    -> (Either String a -> m)
    -> Cmd (http :: HTTP | c) m
get url msgCtor = (runFn4 getImpl) Left Right url f
  where
    f (Left err) = msgCtor $ Left err
    f (Right str) = msgCtor $ makeDecoder str

foreign import fetchImpl :: ∀ c m a.
  Fn4
    (String -> Either String a)
    (a -> Either String a)
    String
    (Either String a -> m)
    (Cmd (http :: HTTP | c) m)

fetch :: ∀ c m a t.
  Generic a t
    => GenericDecode t
    => Decode a
    => String
    -> (Either String a -> m)
    -> Cmd (http :: HTTP | c) m
fetch url msgCtor = (runFn4 fetchImpl) Left Right url f
  where
    f (Left err) = msgCtor $ Left err
    f (Right str) = msgCtor $ makeDecoder str

foreign import concatOptionImpl ::
  Fn3 String String NativeOptions NativeOptions

foreign import concatNativeOptionsImpl ::
  Fn3 String NativeOptions NativeOptions NativeOptions

concatHeader ::
    Header
    -> NativeOptions
    -> NativeOptions
concatHeader (ContentType a) options =
    runFn3 concatOptionImpl "Content-Type" (show a) options
concatHeader (Accept a) options =
    runFn3 concatOptionImpl "Accept" (show a) options
concatHeader (Authorization a) options =
    runFn3 concatOptionImpl "Authorization" a options

combineHeaders ::
  Array Header
    -> NativeOptions
combineHeaders headers =
  foldr concatHeader emptyOptions headers

concatOption :: ∀ body t.
  Generic body t
    => GenericEncode t
    => Decode body
    => HttpOption body
    -> NativeOptions
    -> NativeOptions
concatOption (POST a) options =
    runFn3 concatOptionImpl "body" (makeEncoder a.body) options
--concatOption (Headers) options = combineHeaders
concatOption _ options =
    options

combineOptions :: ∀ body t.
  Generic body t
    => GenericEncode t
    => Decode body
    => Array (HttpOption body)
    -> NativeOptions
combineOptions options =
  foldr concatOption emptyOptions options
