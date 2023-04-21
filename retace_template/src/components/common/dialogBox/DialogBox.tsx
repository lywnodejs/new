import React from 'react'
// import MD components
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

interface DialogBoxState {
    boxSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    openDialog: boolean,
    handleCloseDialog: () => void,
    title: any,
    content: any,
    action: any,
};

export const DialogBox: React.FC<DialogBoxState> = ({
    boxSize, openDialog, handleCloseDialog,
    title, content, action
}) => {
    return (
        <Dialog
            maxWidth={boxSize}
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent
                style={{ overflow: 'auto' }}
            >
                {content}
            </DialogContent>
            <DialogActions>
                {action}
            </DialogActions>
        </Dialog>
    )
}
