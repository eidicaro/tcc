export default function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="admin-page-header">
      <div>
        {eyebrow && <p className="admin-page-header__eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="admin-page-header__description">{description}</p>}
      </div>
      {actions && <div className="admin-page-header__actions">{actions}</div>}
    </header>
  );
}
