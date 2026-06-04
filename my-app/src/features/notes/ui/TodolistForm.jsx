import { Button } from "react-bootstrap";
export default function GetTodoList({ title, onHide, todos, fetcher, isSaving, currentId, catalogId }) {
    return (
        <>
            <fetcher.Form method="post">
                <input className='d-none' type="hidden" name="id" value={currentId} />
                <input className='d-none' type="hidden" name="catalogId" value={catalogId ?? ''} />
                <input className='d-none' type="hidden" name='title' value={title} />
                <input className='d-none' type="hidden" name='items' value={JSON.stringify(todos)} />
                <Button className='me-3' type='submit' disabled={isSaving}>Save</Button>
                <Button variant='secondary' onClick={onHide} disabled={isSaving}>Close</Button>
            </fetcher.Form>
        </>
    );
}