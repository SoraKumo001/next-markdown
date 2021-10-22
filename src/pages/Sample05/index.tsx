import React, { useRef, useState } from 'react';
import {
  MarkdownEditor,
  useMarkdownEditor,
  dispatchMarkdown,
} from '@react-libraries/markdown-editor';
import styled from './index.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const event = useMarkdownEditor();
  const ref = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    dispatchMarkdown(event, {
      type: 'getScrollLine',
      payload: {
        onResult: (line) => {
          const nodes = ref.current!.querySelectorAll<HTMLElement>('[data-sourcepos]');
          const near = Array.from(nodes).reduce<[number, HTMLElement] | undefined>((near, node) => {
            const v = node.dataset.sourcepos!.match(/(\d+):\d+-(\d+):\d+/);
            if (!v) return near;
            const [start, end] = [Number(v[1]), Number(v[2])];
            return line >= start && line <= end && (near === undefined || start - line < near[0])
              ? [start - line, node]
              : near;
          }, undefined);
          if (near) {
            near[1].scrollIntoView();
          }
        },
      },
    });
  };

  return (
    <div className={styled.root}>
      <MarkdownEditor
        className={styled.markdown}
        event={event}
        value={value}
        onUpdate={setValue}
        onScroll={handleScroll}
      />
      <div ref={ref} className={styled.preview}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} sourcePos={true}>
          {value}
        </ReactMarkdown>
      </div>
    </div>
  );
};
export default Page;
