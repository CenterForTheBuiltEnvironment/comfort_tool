const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : "") + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <p className="copyright">
          <strong>Please cite us if you use this software: </strong>
          <a
            href="https://www.sciencedirect.com/science/article/pii/S2352711020302454?via%3Dihub"
            style={{ color: "white", textDecorationLine: "underline" }}
          >
            Tartarini, F., Schiavon, S., Cheung, T., Hoyt, T., 2020. CBE Thermal
            Comfort Tool : online tool for thermal comfort calculations and
            visualizations. SoftwareX 12, 100563.
            https://doi.org/10.1016/j.softx.2020.100563
          </a>
        </p>
        <p className="copyright">
          We have also released
          <a
            href="https://pypi.org/project/pythermalcomfort/"
            style={{ color: "white", textDecorationLine: "underline" }}
          >
            {" "}
            pythermalcomfort{" "}
          </a>
          a Python packaged to calculate several thermal comfort indices (e.g.
          PMV, PPD, SET, adaptive). Links to the:
          <a
            href="https://pythermalcomfort.readthedocs.io/"
            style={{ color: "white", textDecorationLine: "underline" }}
          >
            {" "}
            official documentation{" "}
          </a>
          and
          <a
            href="https://www.sciencedirect.com/science/article/pii/S2352711020302910"
            style={{ color: "white", textDecorationLine: "underline" }}
          >
            {" "}
            our paper{" "}
          </a>
          .
        </p>
        <p className="copyright">
          <a
            href="http://centerforthebuiltenvironment.github.io/comfort_tool/docs/changelog"
            style={{ color: "white", textDecorationLine: "underline" }}
          >
            {" "}
            Version: 2.1.7{" "}
          </a>
        </p>

        <section className="copyright">
          <a
            href="#"
            target="_blank"
            rel="noreferrer noopener"
            className="copyright"
          >
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
