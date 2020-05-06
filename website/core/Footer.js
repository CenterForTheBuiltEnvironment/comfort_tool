/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
          <section className="copyright">Authors: Tyler Hoyt, Stefano Schiavon, Federico Tartarini, Toby Cheung, Kyle Steinfeld, Alberto Piccioli, and Dustin Moon.</section>

          <section className="copyright">
          <a
              href="https://github.com/FedericoTartarini/comfort_tool"
              target="_blank"
              rel="noreferrer noopener"
              className="copyright github-button">
          </a>
          </section>
          <section className="copyright">
        <a
          href="#"
          target="_blank"
          rel="noreferrer noopener"
          className="copyright">
          <img
            src={this.props.config.baseUrl + this.props.config.footerIcon}
            alt={this.props.config.title}
            width="170"
          />
        </a>
      </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
