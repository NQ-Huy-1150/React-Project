import { Button } from 'react-bootstrap';
export default function GetNotePadForm({ note, onHide, fetcher, isSaving, catalogId, currentId }) {
    return (
        <fetcher.Form method='post'>
            <input className='d-none' name='id' type='hidden' value={currentId} readOnly />
            <input className='d-none' name='title' type='hidden' value={note.title == '' ? 'Ghi chú chưa đặt tên' : note.title} readOnly />
            <textarea className='d-none' name='content' value={note.contentText} readOnly ></textarea>
            <input className='d-none' name='catalogId' type='hidden' value={catalogId ?? ''} readOnly />
            <Button className='me-3'
                type='submit'
                disabled={
                    note.contentText.length === 0 || isSaving
                }
            >Lưu</Button>
            <Button variant='secondary' onClick={onHide} disabled={isSaving}>Đóng</Button>
        </fetcher.Form>
    );
}
