# Ask Geeves

Mod 6 full stack project

## Scripts

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner

## Development

1. Install packages with `npm install`.
1. Add a `VITE_API_URL` variable to `.env` with the link to the API server (usually http://localhost:5000) or copy `.env.example` to `.env`.
1. Start the dev server with `npm run dev`

## Build

1. Build the app for production with `npm run build`

## Tech stack

- Typescript
- Vite
- React
- React Router
- Redux Toolkit
- Markdoc

## Components

Page routing is handled by React Router.
The app entry point provides the Redux store, Modal context wrappers, and renders `App`.
`App` consists of `NavBar` along the top, a sidebar, and React Router `Outlet` to render pages at `/`, `/questions`, and `/tagged`.

### NavBar

`NavBar` renders `Logo`, navigation links, a search bar, new question link, and User Session buttons.
The Log in and Sign up buttons open `LoginFormModal` and `SignUpFormModal`.

### Home page `'/'`

Homepage currently has placeholder content to be filled in later with a description of the app's features.

### Questions page `'/questions'`

The All Questions pages displays a `QuestionTile` for each question.
Clicking on a `QuestionTile` leads to the detail's page where comments and answers can be seen.
Each `QuestionTile` contains quick summary info about each question:

- Total votes
- Number of answers
- Number of views
- The question title
- The first 200 characters of the question's content
- The question's tags

### Question details page `'/questions/:questionId'`

The Question Details page contains detailed information about a single question: the question and associated metadata and comments, then a list answers with comments.

All related content from a question and answer are both displayed using the `Post` component (an answer has all the same features as a question):

- Voting area for the post
- Body content for a post rendered from Markdown to a React Node in `RenderPost` (add syntax highlighting later)
- Metadata including a direct link to the post content on the page and user info
- Comments associated with the post

### Ask a question page `'/questions/ask'`

The Ask A Question page displays a form to ask a new question.
There is a title `<input>` field and a body `<textarea>` field.
A live preview of the question's body is displayed below using `RenderPost`.
