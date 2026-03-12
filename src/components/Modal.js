// src/Modal.js - Use nodeRef for Draggable
import React, { useRef } from 'react'; // Import useRef
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable'; // <--- Import ResizableBox
import 'react-resizable/css/styles.css'; // <--- Import default styles
import './Modal.css';

function Modal({ isOpen, onClose, title, children }) {
    const nodeRef = useRef(null); // Create a ref

    if (!isOpen) {
        return null;
    }

    return (
        // Pass the ref to Draggable's nodeRef prop
        <Draggable nodeRef={nodeRef} handle=".modal-header">
            {/* Attach the ref to the direct child div Draggable controls */}
            <div ref={nodeRef} className="modal-content" style={{ padding: 0, minWidth: 'auto', maxWidth: 'none', minHeight: 'auto', maxHeight: 'none', height: 'auto', width: 'auto' }}>
                <ResizableBox
                    width={450}
                    height={600}
                    minConstraints={[300, 300]}
                    maxConstraints={[1000, 900]}
                    resizeHandles={['se', 's', 'e']}
                >
                    <div className="modal-inner" style={{ height: '100%', width: '100%', padding: '20px 25px', display: 'flex', flexDirection: 'column' }}>
                        <div className="modal-header"> {/* This is the drag handle */}
                            {title && <h3 className="modal-title">{title}</h3>}
                            <button className="modal-close-button" onClick={onClose}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body" style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {children}
                        </div>
                    </div>
                </ResizableBox>
            </div>
        </Draggable>
    );
}

export default Modal;