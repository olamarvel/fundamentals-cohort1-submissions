import { ReactNode } from 'react';

interface Action {
  label: string;
  onClick?: () => void;
}

interface StatusCardProps {
  title: string;
  status?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  actions?: Action[];
}

const StatusCard = ({
  title,
  status,
  description,
  children,
  footer = undefined,
  actions = []
}: StatusCardProps) => {
  return (
    <section className="card">
      <header className="card__header">
        <div>
          <h2 className="card__title">{title}</h2>
          {description ? <p className="card__description">{description}</p> : null}
        </div>
        {status ? <span className={`badge badge--${status.toLowerCase()}`}>{status}</span> : null}
      </header>
      <div className="card__body">{children}</div>
      {(footer || actions?.length) && (
        <footer className="card__footer">
          <div>{footer}</div>
          <div className="card__actions">
            {actions?.map((action) => (
              <button
                key={action.label}
                type="button"
                className="button"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        </footer>
      )}
    </section>
  );
};

export default StatusCard;









