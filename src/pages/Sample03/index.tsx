import { MarkdownComponents, MarkdownEditor } from '@react-libraries/markdown-editor';
import { ElementType, useState } from 'react';
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
---
AA~~AA~~AAA
`;

// const defaultComponents: MarkdownComponents = {
//   heading: ({ children, node, ...props }) => React.createElement('h' + node.depth, props, children),
//   strong: ({ children, node, ...props }) => React.createElement('strong', props, children),
//   emphasis: ({ children, node, ...props }) => React.createElement('em', props, children),
//   inlineCode: ({ children, node, ...props }) => React.createElement('em', props, children),
//   code: ({ children, node, ...props }) => React.createElement('code', props, children),
//   link: ({ children, node, ...props }) => React.createElement('span', props, children),
//   image: ({ children, node, ...props }) => React.createElement('span', props, children),
//   list: ({ children, node, ...props }) => React.createElement('span', props, children),
//   html: ({ children, node, ...props }) => React.createElement('span', props, children),
//   table: ({ children, node, ...props }) => React.createElement('code', props, children),
//   delete: ({ children, node, ...props }) => React.createElement('del', props, children),
//   paragraph: ({ children, node, ...props }) => React.createElement('p', props, children),
//   blockquote: ({ children, node, ...props }) => React.createElement('span', props, children),
// };

const Page = () => {
  const [message, setMessage] = useState('none');
  const components: MarkdownComponents = {
    strong: ({ children, node, ...props }) => (
      <strong
        {...props}
        onMouseOver={(e) => {
          setMessage('strong');
          e.stopPropagation();
        }}
      >
        {children}
      </strong>
    ),
    emphasis: ({ children, node, ...props }) => (
      <em
        {...props}
        onMouseOver={(e) => {
          setMessage('emphasis');
          e.stopPropagation();
        }}
      >
        {children}
      </em>
    ),
    table: ({ children, node, ...props }) => (
      <code
        {...props}
        onMouseOver={(e) => {
          setMessage('table');
          e.stopPropagation();
        }}
      >
        {children}
      </code>
    ),
    heading: ({ children, node, ...props }) => {
      const Tag = ('h' + node.depth) as ElementType;
      return (
        <Tag
          {...props}
          onMouseOver={(e: React.MouseEvent<HTMLHeadingElement>) => {
            setMessage('heading');
            e.stopPropagation();
          }}
        >
          {/* If you use `data-type="ignore"`, it will be excluded from the character count. */}
          <div
            style={{ display: 'block', userSelect: 'none' }}
            contentEditable={false}
            data-type="ignore"
          >
            [Header]
          </div>
          {children}
        </Tag>
      );
    },
  };

  return (
    <>
      <div>Message: {message}</div>
      <MarkdownEditor
        className={styled.markdown}
        defaultValue={defaultValue}
        components={components}
      />
    </>
  );
};
export default Page;
