import { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";

const AdminLayout = ({ children }: PropsWithChildren) => (
  <div className="layout layout--admin">
    <header className="navbar admin-navbar">
      <div className="container admin-navbar__inner">
        <div className="admin-navbar__head">
          <Link to="/admin" className="brand">
            Admin
          </Link>
          <Link className="admin-return" to="/" aria-label="Return to store">
            <span className="admin-return__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path
                  d="m15.5 6-6 6 6 6-1.4 1.4L6.7 12l7.4-7.4L15.5 6Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="admin-return__label">Store</span>
          </Link>
        </div>
        <nav className="admin-links" aria-label="Admin sections">
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/inventory">Inventory</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/customers">Customers</NavLink>
          <NavLink to="/admin/coupons">Coupons</NavLink>
          <NavLink to="/admin/collections">Collections</NavLink>
          <NavLink to="/admin/theme">Theme</NavLink>
          <NavLink to="/admin/blog">Blog</NavLink>
          <NavLink to="/admin/pages">Pages</NavLink>
          <NavLink to="/admin/quiz">Quiz</NavLink>
          <NavLink to="/admin/reports">Reports</NavLink>
        </nav>
      </div>
    </header>
    <main>
      <div className="container page-fade">{children}</div>
    </main>
  </div>
);

export default AdminLayout;
