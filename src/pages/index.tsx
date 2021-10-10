import { dispatchLocalEvent } from '@react-libraries/use-local-event';
import React, { useState } from 'react';
import { MarkdownEditor, useMarkdownEditor } from '@react-libraries/markdown-editor';
import styled from './index.module.scss';
const defaultValue = `# Title

Putting **emphasis** in a sentence

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
      <div className={styled.info}>
        <div>
          Sample of{' '}
          <a href="https://www.npmjs.com/package/@react-libraries/markdown-editor">
            @react-libraries/markdown-editor
          </a>
        </div>
        <div>
          Source:
          <a href="https://github.com/SoraKumo001/next-markdown">
            https://github.com/SoraKumo001/next-markdown
          </a>
        </div>
      </div>
      <button
        onClick={() => {
          setValue(defaultValue);
        }}
      >
        init
      </button>
      <button
        onClick={() => {
          dispatchLocalEvent(event, {
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
          dispatchLocalEvent(event, {
            type: 'setPosition',
            payload: { start: 0, end: value.length },
          });
        }}
      >
        setPosition
      </button>
      <button
        onClick={() => {
          dispatchLocalEvent(event, {
            type: 'setFocus',
          });
        }}
      >
        setFocus
      </button>
      <button
        onClick={() => {
          dispatchLocalEvent(event, {
            type: 'update',
            payload: { value: '{new value}\n', start: 0 },
          });
        }}
      >
        insert to first
      </button>
      <button
        onClick={() => {
          dispatchLocalEvent(event, {
            type: 'update',
            payload: { value: '{new value}\n' },
          });
        }}
      >
        insert to caret
      </button>
      <button
        onClick={() => {
          dispatchLocalEvent(event, {
            type: 'undo',
          });
        }}
      >
        undo
      </button>
      <button
        onClick={() => {
          dispatchLocalEvent(event, {
            type: 'redo',
          });
        }}
      >
        redo
      </button>
      <div>{message}</div>
      <MarkdownEditor className={styled.markdown} event={event} value={value} onUpdate={setValue} />
      {/* uncontrolled */}
      {/* <MarkdownEditor className={styled.markdown} event={event} defaultValue={defaultValue} /> */}
    </div>
  );
};
export default Page;
