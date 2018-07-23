module Oak.Cmd.Http
  ( HTTP
  , HttpOptions(..)
  , MediaType(..)
  , HttpOption(..)
  , Header(..)
  , Credentials
  , defaultDecode
  , defaultEncode
  , get
  , fetch
  ) where

import Prelude (show, ($), class Show)

import Control.Monad.Except (runExcept)
import Data.Generic.Rep (class Generic)
import Data.Foreign.Class (class Decode)
import Data.Foreign.Generic (defaultOptions, genericDecode, genericDecodeJSON, genericEncode, genericEncodeJSON)
import Data.Foreign.Generic.Class (class GenericEncode, class GenericDecode)
import Data.Foreign.Generic.Types (Options)
import Data.Foreign (F, Foreign)
import Data.Traversable (foldr)
import Data.Either (Either(..))
import Data.Function.Uncurried
  ( Fn3
  , runFn3
  , Fn4
  , runFn4
  , Fn5
  , runFn5
  )

import Oak.Cmd

foreign import data HTTP :: Command
foreign import data NativeOptions :: Type

foreign import emptyOptions :: NativeOptions

type HttpOptions a = Array (HttpOption a)

-- Currently we only support JSON
-- TODO: support media types other than JSON
data MediaType = ApplicationJSON
  | ApplicationXML
  | TextHTML
  | TextPlain

data Header = ContentType MediaType
  | Accept MediaType
  | Authorization String

data Credentials = CredentialsOmit
  | CredentialsSameOrigin
  | CredentialsInclude

data HttpOption a = POST { body :: a }
  | Headers (Array Header)
  | Credentials

instance showMediaType :: Show MediaType where
  show ApplicationJSON = "application/json; charset=utf-8"
  show ApplicationXML = "application/xml"
  show TextHTML = "text/html"
  show TextPlain = "text/plain"

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
-- TODO: return Maybe or Either instead of undefined.
makeEncoder :: ∀ a t.
  Generic a t
    => GenericEncode t
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
  Fn5
    (String -> Either String a)
    (a -> Either String a)
    String
    NativeOptions
    (Either String a -> m)
    (Cmd (http :: HTTP | c) m)

fetch :: ∀ c m a t body e.
  Generic a t
    => GenericDecode t
    => Decode a
    => Generic body e
    => GenericEncode e
    => String
    -> HttpOptions body
    -> (Either String a -> m)
    -> Cmd (http :: HTTP | c) m
fetch url options msgCtor = (runFn5 fetchImpl) Left Right url (combineOptions options) f
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
    => HttpOption body
    -> NativeOptions
    -> NativeOptions
concatOption (POST a) options =
    runFn3 concatOptionImpl "body" (makeEncoder a.body) postOptions where
      postOptions = runFn3 concatOptionImpl "method" "POST" options
concatOption (Headers headers) options =
    runFn3 concatNativeOptionsImpl "headers" nativeHeaders options where
      nativeHeaders = combineHeaders headers
concatOption _ options =
    options

combineOptions :: ∀ body t.
  Generic body t
    => GenericEncode t
    => HttpOptions body
    -> NativeOptions
combineOptions options =
  foldr concatOption emptyOptions options
