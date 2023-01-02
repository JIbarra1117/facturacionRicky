import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';


const Sidebar = () => {
    return (<>
      <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' , backdropFilter: "blur( 8.5px )" }}>
        <CDBSidebar textColor="#fff" backgroundColor="#333" >
          {/**<div style={{height:80}}></div> */}
          <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <a href="/facturacion" className="text-decoration-none" style={{ color: 'inherit' }}>
              Ventas
            </a>
          </CDBSidebarHeader>
  
          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
              <NavLink to="/ventas" className={({ isActive }) => isActive? "active": ''}>
                <CDBSidebarMenuItem icon="columns">Ventas</CDBSidebarMenuItem>
              </NavLink>
              <NavLink to="/reportes" className={({ isActive }) => isActive? "active": ''}>
                <CDBSidebarMenuItem icon="table">Reporte Ventas</CDBSidebarMenuItem>
              </NavLink> 
              
            </CDBSidebarMenu>
          </CDBSidebarContent>
  
          <CDBSidebarFooter style={{ textAlign: 'center' }}>
            <div
              style={{
                padding: '20px 5px',
              }}
            >
               
              <div style={{ height : 25 }}></div>
              <div>
              Powered by Ricky Reivan
              </div>
            </div>
          </CDBSidebarFooter>
        </CDBSidebar>      

      </div>

      </>
    );
  };
  
  export default Sidebar;
