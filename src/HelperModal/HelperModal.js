import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';

const HelperModal = ({ handleClose, show, children, header }) => {
    return (
        <>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title data-testid = 'header'>{header}</Modal.Title>
                </Modal.Header>
                <Modal.Body data-testid = 'content'>{children}</Modal.Body>
                <Modal.Footer>
                    <Button data-testid="close" variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default HelperModal;
