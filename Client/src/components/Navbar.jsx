import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../img/JaktHarryLogo.png";
import adsett from "../img/adsett.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, NavDropdown, Container, Nav } from "react-bootstrap";
import { AuthContext } from "../context/authContext";

function CustomNavbar() {
  const { currentUser, logout } = useContext(AuthContext);

  // Check if currentUser is admin
  const isAdmin = currentUser && currentUser.role === 1;

  // Define kretsarList
  const kretsarList = [
    "StockholmCentrala",
    "Hallstavik",
    "HaningeTyresö",
    "Lidingö",
    "Mälarö",
    "Norrort",
    "NorrtäljeNorra",
    "NorrtäljeSödra",
    "Nynäshamn",
    "Rimbo",
    "SolnaSundbyberg",
    "Söderort",
    "Södertälje",
    "UpplandsBro",
    "WermdöNacka",
    "VäsbySollentunaJärfälla",
    "Västerort",
    "ÖsteråkerVaxholm",
  ];

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-dark navbar-dark">
      <Container>
        <Navbar.Brand>
          <Link to="/">
            <img src={Logo} alt="" className="imgClass" />
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto navClass">
            <NavDropdown title="NYHETER" id="collapsible-nav-dropdown">
              <NavDropdown.Item className="item">
                <Link to="/?cat=riks" className="nav-link itemClass">
                  RIKS
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item className="item">
                <Link to="/?cat=lans" className="nav-link itemClass">
                  LÄNS
                </Link>
              </NavDropdown.Item>
              <NavDropdown
                title="KRETSAR"
                id="kretsar-dropdown"
                className="item"
              >
                {kretsarList.map((krets, index) => (
                  <NavDropdown.Item key={index}>
                    <Link to={`/?cat=${krets}`} className="nav-link itemClass2">
                      {krets}
                    </Link>
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </NavDropdown>
            <Link to="/?cat=aktiviteter" className="nav-link">
              AKTIVITETER
            </Link>
            <Link to="#" className="nav-link">
              {currentUser?.username}
            </Link>
            {currentUser ? (
              <Link className="nav-link" onClick={logout} to="/">
                LoggaUt
              </Link>
            ) : (
              <Link className="nav-link" to="/login">
                loggaIN
              </Link>
            )}
            <Link to="/write" className="nav-link write">
              Skriva
            </Link>
            {currentUser && (
              <Link to="/profile" className="nav-link">
                Profil
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {isAdmin && (
        <Link to="/panel" className="linkClass">
          <img src={adsett} alt="" className="adClass" />
          <h6>Adminpanel</h6>
        </Link>
      )}
    </Navbar>
  );
}

export default CustomNavbar;
