/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    // {
    //   content: `Learn more using the [documentation on this site.](${docUrl(
    //     'ashrae55.html',
    //   )})`,
    //   title: 'Browse Docs',
    // },
    // {
    //   content: 'Ask questions about the documentation and project',
    //   title: 'Join the community',
    // },
    // {
    //   content: "Find out what's new with this project",
    //   title: 'Stay up to date',
    // },
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Authors</h1>
          </header>
          <div>This project is maintained by a group of researches at the Center for the Built Environment (CBE), University of California Berkeley (USA).</div>
          <header className="postHeader">
            <h1>Need help?</h1>
          </header>
          <div>You can contact us at cbecomforttool@gmail.com</div>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
