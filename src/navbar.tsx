import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router';

export function NavigationBar() {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand as={Link} to="/">HomeRadar</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Heatmap</Nav.Link>
          <Nav.Link href="https://github.com/AxelGard/homeradar">About</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
