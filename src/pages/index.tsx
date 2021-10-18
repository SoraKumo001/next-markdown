import React from 'react';
import Link from 'next/link';
import styled from './index.module.scss';

const Page = () => {
  const menus = [
    ['Basic', 'Sample01'],
    ['Style', 'Sample02'],
    ['Custom component', 'Sample03'],
    ['Dispatch', 'Sample04'],
    ['Scroll', 'Sample05'],
  ];

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

      {menus.map(([name, href], index) => (
        <div key={name}>
          {index + 1}:<Link href={`/${href}`}>{name}</Link>
        </div>
      ))}
    </div>
  );
};
export default Page;
