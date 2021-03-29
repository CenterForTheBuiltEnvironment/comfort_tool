const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const Container = CompLibrary.Container;

function Help() {
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="container-fluid">
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
            question has not yet been answered please ask the question on{" "}
            <a href="https://stackoverflow.com">stackoverflow</a>
            and send us an email with the link to your question at{" "}
            <a href="mailto:cbecomforttool@gmail.com">
              cbecomforttool@gmail.com
            </a>
            .
          </p>
          <p>
            <b>
              Please do not ask us questions directly via email. We will only
              respond to questions asked on{" "}
              <a href="https://stackoverflow.com">stackoverflow</a>.
            </b>
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
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
