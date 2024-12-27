import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export function NavigationBar() {
  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="#home">HomeRadar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Heatmap</Nav.Link>
            <Nav.Link href="#features">About</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
