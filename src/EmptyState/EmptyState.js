
import './EmptyState.css';
const EmptyState = () => {
    const textMessage = 'No Data found';
    return (
        <div className="empty-state"><div data-testid="emptyState" className="empty-state__text">{textMessage}</div></div>
    )
}

export default EmptyState;
