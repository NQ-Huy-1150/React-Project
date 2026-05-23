import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../../shared/ui/Homepage/HomepageLayout'
import Hello from '../../shared/ui/Welcome/hello'
import AppCaseConverter from '../caseConverter/ui/CaseConverter'
import AppLetterCounter from '../letterCounter/letterCounter'
import AppRentCalculator from '../rentCalculator/ui/RenCalculator'
import AppSpendTracker from '../spendTracker/ui/SpendTracker'
import AppNotes from '../notes/ui/Notes'
import NotePad from '../notes/ui/Notepad'
import NoteTodolist from '../notes/ui/Todolist'
import NoteCatalog from '../notes/ui/Catalog'
import NoteArchive from '../notes/ui/Archive'

const noteRoutes = {
    path: 'notes', element: <AppNotes />,
    children: [
        { path: 'take-note', element: <NotePad /> },
        { path: 'todo-list', element: <NoteTodolist /> },
        { path: 'catalog', element: <NoteCatalog /> },
        { path: 'archive', element: <NoteArchive /> }
    ]
};
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Hello /> },
            { path: 'case-converter', element: <AppCaseConverter /> },
            { path: 'rent-calculator', element: <AppRentCalculator /> },
            { path: 'letter-counter', element: <AppLetterCounter /> },
            { path: 'spend-tracker', element: <AppSpendTracker /> },
            noteRoutes
        ]
    }
])
export default router;
