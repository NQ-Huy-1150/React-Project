import { Form } from 'react-router-dom'
import { Button } from 'react-bootstrap';
export default function GetNotePadForm({ note, onHide, status, catalogId, currentId }) {
    return (
        <Form method='post'>
            <input className='d-none' name='id' type='hidden' value={currentId} />
            <input className='d-none' name='title' type='hidden' value={note.title == '' ? 'Untitled note' : note.title} />
            <textarea className='d-none' name='content' value={note.contentText} ></textarea>
            <input className='d-none' name='catalogId' type='hidden' value={catalogId ?? ''} />
            <Button className='me-3'
                type='submit'
                disabled={
                    note.contentText.length === 0 || status === 'submitting'
                }
            >Save</Button>
            <Button variant='secondary' onClick={onHide}>Close</Button>
        </Form>
    );
}