module Oak.Cmd.Http
  ( HTTP
  , defaultDecode
  , defaultEncode
  , get
  ) where

import Prelude (show, ($))

import Control.Monad.Except (runExcept)
import Data.Generic.Rep (class Generic)
import Data.Foreign.Class (class Decode, class Encode)
import Data.Foreign.Generic (defaultOptions, genericDecode, genericDecodeJSON, genericEncode, genericEncodeJSON)
import Data.Foreign.Generic.Class (class GenericEncode, class GenericDecode)
import Data.Foreign.Generic.Types (Options)
import Data.Foreign (F, Foreign)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
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
fetch url msgCtor options = (runFn4 fetchImpl) Left Right url (combineOptions options) f
  where
    f (Left err) = msgCtor $ Left err
    f (Right str) = msgCtor $ makeDecoder str

foreign import concatOptionImpl ::
  Fn3 String String NativeOptions NativeOptions

concatHeader ::
    Header
    -> NativeOptions
    -> NativeOptions
concatHeader (ContentType) options =

combineHeaders ::
  Array Header
    -> NativeOptions
combineHeaders headers options =
  foldr concatHeader emptyOptions options

concatOption :: ∀ body eff.
    HttpOption body
    -> NativeOptions
    -> NativeOptions
concatOption Headers options = combineHeaders
concatOption handler (Style styles) attrs =
  N.concatSimpleAttr "style" (stringifyStyles styles) attrs
concatOption handler (BooleanAttribute name b) attrs =
  N.concatBooleanAttr name b attrs
concatOption handler (DataAttribute name val) attrs =
  N.concatDataAttr name val attrs
concatOption handler (KeyPressEventHandler name f) attrs =
  N.concatHandlerFun name (\e -> handler (f e)) attrs

combineOptions :: ∀ body.
  Array (HttpOption body)
    -> NativeOptions
combineOptions options handler =
  foldr concatOption emptyOptions options
