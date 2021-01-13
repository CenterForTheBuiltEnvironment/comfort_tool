/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const { config: siteConfig, language = "" } = props;
  const { baseUrl, docsUrl } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
  const langPart = `${language ? `${language}/` : ""}`;
  const docUrl = (doc) => `${baseUrl}${docsPart}${langPart}${doc}`;

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
          <h1>Authors</h1>
          <p>
            This project is maintained by a group of researchers at the Center
            for the Built Environment (CBE), University of California Berkeley
            (USA). This is a free tool and we have only limited ability to
            answer questions.
          </p>
          <h1>Need help?</h1>
          <p>
            Please check the{" "}
            <a href="http://centerforthebuiltenvironment.github.io/comfort_tool/docs/changelog">
              CHANGELOG
            </a>{" "}
            page where we have described all the latest changes we have
            implemented, and visit the{" "}
            <a href="http://centerforthebuiltenvironment.github.io/comfort_tool/docs/ashrae55">
              official documentation
            </a>{" "}
            page.
          </p>
          <h2>Get help from the community</h2>
          <p>
            Ask questions, and connect with other users and top contributors on{" "}
            <a href="https://stackoverflow.com">stackoverflow</a>. If your
            question has not yet been answered please feel free to ask a new
            question send us an email with the link to your question at{" "}
            <a href="mailto:cbecomforttool@gmail.com">
              cbecomforttool@gmail.com
            </a>
          </p>
          <h1>Issues and bugs</h1>
          <p>
            Please report issues and bugs on our{" "}
            <a href="https://github.com/CenterForTheBuiltEnvironment/comfort_tool/issues">
              GitHub page.
            </a>{" "}
          </p>
          <h1>Suggest new features</h1>
          <p>
            Please suggest new features on our{" "}
            <a href="https://github.com/CenterForTheBuiltEnvironment/comfort_tool/issues">
              GitHub page.
            </a>{" "}
          </p>
          <h1>For any other inquiries</h1>
          <p>
            You can contact us at{" "}
            <a href="mailto:cbecomforttool@gmail.com">
              cbecomforttool@gmail.com
            </a>
          </p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
