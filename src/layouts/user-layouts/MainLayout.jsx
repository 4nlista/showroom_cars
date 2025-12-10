import React from 'react';
import Header from '../../components/user-components/Header';
import Footer from '../../components/user-components/Footer';

const MainLayout = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

export default MainLayout;