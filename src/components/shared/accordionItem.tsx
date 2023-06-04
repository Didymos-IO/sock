export type AccordionItemProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
};

export const AccordionItem = (props: AccordionItemProps) => {
  const { children, isOpen, onToggle, title } = props;

  return (
    <div className="accordion-item border-warning overflow-hidden">
      <h2 className="accordion-header">
        <button
          className={`accordion-button text-warning border-bottom-warning shadow-none bg-black ${
            isOpen ? "" : "collapsed"
          }`}
          type="button"
          onClick={() => {
            onToggle();
          }}
        >
          {title}
        </button>
        <div className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}>
          <div className="accordion-body text-tip-yellow">{children}</div>
        </div>
      </h2>
    </div>
  );
};
