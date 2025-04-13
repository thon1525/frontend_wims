// eslint-disable-next-line react/prop-types
const Card = ({ children, classNames, style }) => {
    return (
        <div className="overflow-hidden rounded-lg shadow" style={style}>
            <div className={classNames}>{children}</div>
        </div>
    );
};

export default Card;
