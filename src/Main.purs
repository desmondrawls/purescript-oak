module Main (main) where

import Prelude

import Control.Monad.Eff
import Control.Monad.Eff.Exception
import Data.Array
import Data.Maybe

import Oak
import Oak.Html ( Html, div, text, button )
import Oak.Html.Events
import Oak.Document
import Oak.Cmd

type Project =
    { id :: Int,
      client :: String,
      name :: String
      }

type Pivot =
    { firstName :: String,
    lastName :: String
    }

type Model =
  { number :: Int,
    projects :: Array Project,
    pivots :: Array Pivot,
    selectedProject :: Maybe Int
  }

data Msg
  = Inc
  | Dec
  | SelectProject Int

projectView :: Project -> Html Msg
projectView project =
    div []
      [ div [ onClick (SelectProject project.id) ] [ text project.name ]
      , div [] [ text ("Client: " <> project.client) ]
      ]

pivotView :: Pivot -> Html Msg
pivotView pivot =
    div [] [ text (pivot.firstName <> " " <> pivot.lastName) ]

projectNameView :: Maybe Project -> String
projectNameView Nothing = "Unknown project"
projectNameView (Just project) = project.name <> " with " <> project.client

selectedProjectView :: Array Project -> Maybe Int -> Html Msg
selectedProjectView _ Nothing = 
    div [] [ text "Please select a project." ]
selectedProjectView [] _ =
    div [] [ text "You have no projects to allocate to! Call some clients." ]
selectedProjectView projects (Just projectID) =
    div [] [ text $ "Who wants to work on " <> projectNameView project ]
    where project = find (\project -> project.id == projectID) projects



view :: Model -> Html Msg
view model =
  div []
    [ div [] [ text "Projects"
    , div [] (map projectView model.projects) ]
    , div [] [ text "Pivots"
    , div [] (map pivotView model.pivots) ]
    , selectedProjectView model.projects model.selectedProject
    ]


next :: Msg -> Model -> Cmd () Msg
next _ _ = none

update :: Msg -> Model -> Model
update Inc model =
  model { number = model.number + 1 }
update Dec model =
  model { number = model.number - 1 }
update (SelectProject project) model =
  model { selectedProject = Just project }

initialProjects :: Array Project
initialProjects = [ { id: 1, client: "Insurance Inc.", name: "Replace Vehicle" },
    { id: 2, client: "CoreLogic", name: "Store Front" },
    { id: 3, client: "Cool Ass Startup", name: "Replace Vehicle" }]

initialPivots :: Array Pivot
initialPivots = [ { firstName: "Jonathan", lastName: "Sirlin" },
    { firstName: "Joe", lastName: "Greubel" },
    { firstName: "Desmond", lastName: "Pompa Alarcon Rawls" },
    { firstName: "Dan", lastName: "Kaplan" }]

init :: Model
init =
  { number: 0,
  projects: initialProjects,
  pivots: initialPivots,
  selectedProject: Nothing }

app :: App () Model Msg
app = createApp
  { init: init
  , view: view
  , update: update
  , next: next
  }

main :: Eff (exception :: EXCEPTION, dom :: DOM) Unit
main = do
  rootNode <- runApp app
  container <- getElementById "app"
  appendChildNode container rootNode
