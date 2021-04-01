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
            If you have a question about the tool, first look at{" "}
            <a href="https://stackoverflow.com">stackoverflow</a> (search for
            "CBE Thermal Comfort tool" in stackoverflow search engine). If your
            question has not yet been answered please:
            <li>
              post it on <a href="https://stackoverflow.com">stackoverflow</a>.
              The question title or body must contain the words "CBE Thermal
              Comfort tool".
            </li>
            <li>
              send us an email with the link to your question at{" "}
              <a href="mailto:cbecomforttool@gmail.com">
                cbecomforttool@gmail.com
              </a>
              .
            </li>
          </p>
          <p>
            <b>
              We only answer questions asked on{" "}
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
