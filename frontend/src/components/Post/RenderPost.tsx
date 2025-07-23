import React from "react"
import Markdoc from "@markdoc/markdoc"
import "prismjs"
import "prismjs/themes/prism-tomorrow.css"

// import Prism from "react-prism"
import { Highlight, themes } from "prism-react-renderer"

interface FenceProps {
  children: JSX.Element
  language: string
}
export function Fence({ children, language }: FenceProps) {
  return (
    <Highlight
      theme={themes.okaidia}
      code={children.toString()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span>{i + 1}</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
    // <Prism key={language} component="pre" className={`language-${language}`}>
    //   {children}
    // </Prism>
  )
}

interface Props {
  postContent: string
}
// RenderPost converts a raw Markdown string into a React Node
export const RenderPost = ({ postContent }: Props) => {
  const fence = {
    render: "Fence",
    attributes: {
      language: {
        type: String,
      },
    },
  }
  // Parse, transform, and render Markdown content from form.body
  const ast = Markdoc.parse(postContent)
  const content = Markdoc.transform(ast, {
    nodes: {
      fence,
    },
  })
  return (
    <div className="post-content">
      {Markdoc.renderers.react(content, React, {
        components: { Fence },
      })}
    </div>
  )
}
