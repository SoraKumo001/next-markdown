import React, { useState } from 'react';
import {
  MarkdownEditor,
  useMarkdownEditor,
  dispatchMarkdown,
} from '@react-libraries/markdown-editor';
import styled from './index.module.scss';
const defaultValue = `# Title

Putting **strong** in a sentence

- ListItem
- ListItem

## Table

| Header1       | Header2                                    |
| ------------- | ------------------------------------------ |
| name1         | info1                                      |
| name2         | info 2                                     |

# A*B*CD

AAAAAAA
`;
const Page = () => {
  const [value, setValue] = useState(defaultValue);
  const [message, setMessage] = useState('');
  const event = useMarkdownEditor();

  return (
    <div className={styled.root}>
      <button
        onClick={() => {
          setValue(defaultValue);
        }}
      >
        init
      </button>
      <button
        onClick={() => {
          dispatchMarkdown(event, {
            type: 'getPosition',
            payload: {
              onResult: (start, end) => setMessage(`start:${start},end:${end}`),
            },
          });
        }}
      >
        getPosition
      </button>
      <button
        onClick={() => {
          dispatchMarkdown(event, {
            type: 'setPosition',
            payload: { start: 0, end: -1 },
          });
        }}
      >
        setPosition
      </button>
      <button
        onClick={() => {
          dispatchMarkdown(event, {
            type: 'setFocus',
          });
        }}
      >
        setFocus
      </button>
      <button
        onClick={() => {
          dispatchMarkdown(event, {
            type: 'update',
            payload: { value: '{new value}\n', start: 0 },
          });
        }}
      >
        insert to first
      </button>
      <button
        onClick={() => {
          dispatchMarkdown(event, {
            type: 'update',
            payload: { value: '{new value}\n' },
          });
        }}
      >
        insert to caret
      </button>
      <button
        onClick={() => {
          dispatchMarkdown(event, {
            type: 'undo',
          });
        }}
      >
        undo
      </button>
      <button
        onClick={() => {
          dispatchMarkdown(event, {
            type: 'redo',
          });
        }}
      >
        redo
      </button>
      <div>{message}</div>
      <MarkdownEditor className={styled.markdown} event={event} value={value} onUpdate={setValue} />
    </div>
  );
};
export default Page;
