import { Form, useActionData, useNavigation } from "react-router-dom";
import { Button } from "react-bootstrap";
export default function GetTodoList({ title, onHide, todos, setError, setStatus }) {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const handleSetStatus = () => {
        setStatus(isSubmitting);
    }
    return (
        <>
            <Form method="post">
                {actionData?.error && setError(actionData.error)}
                <input className='d-none' type="text" name='title' value={title} />
                <input className='d-none' type="hidden" name='items' value={JSON.stringify(todos)} />
                <Button className='me-3' type='submit' disabled={isSubmitting} onClick={handleSetStatus}>Save</Button>
                <Button variant='secondary' onClick={onHide} disabled={isSubmitting}>Close</Button>
            </Form>
        </>
    );
}