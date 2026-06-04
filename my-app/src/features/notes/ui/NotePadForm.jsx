import { Form } from 'react-router-dom'
import { Button } from 'react-bootstrap';
export default function GetNotePadForm({ note, onHide, status }) {
    return (
        <Form method='post'>
            <input className='d-none' type='text' value={note.title == '' ? 'Untitled note' : note.title} readOnly />
            <textarea className='d-none' value={note.contentText} readOnly></textarea>
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