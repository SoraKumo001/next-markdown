import { MarkdownEditor } from '@react-libraries/markdown-editor';
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

AAAAAAA`;

const Page = () => {
  return <MarkdownEditor className={styled.markdown} defaultValue={defaultValue} />;
};
export default Page;
