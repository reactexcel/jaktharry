import React from "react";
import { Col, Container, ListGroup, Row, Tab } from "react-bootstrap";
import { TabContent2, TabContent3, TabContent4, 
  TabContent5} from "../components/adminContent.js";
import { TabContent7, TabContent8, TabContent9, 
    TabContent11, TabContent12, } from "../components/adminContent2.js";

// Define the array containing tab items
const tabItems = [
  { id: '#link1', title: 'INLÄGG' },
  { id: '#link2', title: 'Alla', content: <TabContent2 /> },
  { id: '#link3', title: 'Riks', content: <TabContent3 /> },
  { id: '#link4', title: 'Lans', content: <TabContent4 /> },
  { id: '#link5', title: 'Kretsar', content: <TabContent5 /> },
];

const tabItems2 = [
  { id: '#link6', title: 'AKTIVITETER' },
  { id: '#link7', title: 'Alla', content: <TabContent7 /> },
  { id: '#link8', title: 'För en användare', content: <TabContent8 /> },
  { id: '#link9', title: 'För en aktivitet', content: <TabContent9 /> },
];

const tabItems3 = [
  { id: '#link10', title: 'Användarna' },
  { id: '#link11', title: 'Alla användare', content: <TabContent11 /> },
  { id: '#link12', title: 'Moderatorer', content: <TabContent12 /> },
];

// Define the array containing non-clickable link IDs
const nonClickableLinks = ['#link1', '#link6', '#link10'];

const Panel = () => {
  
  return (
    <Container className="conLayout">
      <h1>Admin Dashboard</h1>
      <Tab.Container id="list-group-tabs" defaultActiveKey="#link1">
        <Row className="rowClass">
          <Col className="col1Class" sm={3}>
            <ListGroup className="groupClass">
              {tabItems.map(item => (
                <ListGroup.Item 
                key={item.id} 
                className={`list-group-item list-group-item-success ${nonClickableLinks.includes(item.id) ? "non-clickable" : ""}`}
                {...(nonClickableLinks.includes(item.id) ? {} : { action: true, href: item.id })}
                >
                  {item.title}
                </ListGroup.Item>
              ))}
              {tabItems2.map(item => (
                <ListGroup.Item 
                key={item.id} 
                className={`list-group-item list-group-item-secondary ${nonClickableLinks.includes(item.id) ? "non-clickable" : ""}`}
                {...(nonClickableLinks.includes(item.id) ? {} : { action: true, href: item.id })}
                >
                  {item.title}
                </ListGroup.Item>
              ))}
              {tabItems3.map(item => (
                <ListGroup.Item 
                key={item.id} 
                className={`list-group-item list-group-item-warning ${nonClickableLinks.includes(item.id) ? "non-clickable" : ""}`}
                {...(nonClickableLinks.includes(item.id) ? {} : { action: true, href: item.id })}
                >
                  {item.title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col className="col2Class" sm={9}>
            <Tab.Content>
              {tabItems.map(item => (
                <Tab.Pane key={item.id} eventKey={item.id}>
                  {item.content}
                </Tab.Pane>
              ))}
              {tabItems2.map(item => (
                <Tab.Pane key={item.id} eventKey={item.id}>
                  {item.content}
                </Tab.Pane>
              ))}
              {tabItems3.map(item => (
                <Tab.Pane key={item.id} eventKey={item.id}>
                  {item.content}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>

  );
};

export default Panel;